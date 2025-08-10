import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, authApi } from "../../utils/api";


const initialState = {
    id: null,
    email: null,
    provider: null,
    provider_id: null,
    created_at: null,
    updated_at: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    theme_preference: null,
    profile: [],
    is_active: false,
    is_staff: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // 今の所なし
    },
    extraReducers: (builder) => {
        // ユーザー新規登録の処理中はローディングの表示をさせる
        builder.addCase(signUpWithLocal.pending, (state) => {
            state.loading = true;
        })
        .addCase(signUpWithLocal.fulfilled, (state, action) => {
            // action.payloadはsignUpWithLocalでのreturnの返り値
            const user = action.payload;

            state.id = user.id;
            state.email = user.email;
            state.provider = user.provider;
            state.created_at = user.created_at;
            state.updated_at = user.updated_at;
            state.loading = false;
        })
        .addCase(signUpWithLocal.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        // ユーザー新規登録時のメール認証
        builder.addCase(verifyEmail.pending, (state) => {
            state.loading = true;
        })
        .addCase(verifyEmail.fulfilled, (state, action) => {
            const user = action.payload;
            console.log(`user: ${user}`);

            state.id = user.id;
            state.email = user.email;
            state.provider = user.provider;
            state.provider_id = user.provider_id;
            state.created_at = user.created_at;
            state.updated_at = user.updated_at;
            state.theme_preference = user.theme_preference;
            state.is_active = user.is_active;
            state.is_staff = user.is_staff;

            state.loading = false;
            state.error = null;
            state.isAuthenticated = true;
        })
        .addCase(verifyEmail.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        // ログアウト
        builder.addCase(logoutUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            return initialState;
        })
        .addCase(logoutUser.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        // 自身のユーザー情報を取得
        builder.addCase(fetchMe.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchMe.fulfilled, (state, action) => {
            const user = action.payload;

            state.id = user.id;
            state.email = user.email;
            state.provider = user.provider;
            state.provider_id = user.provider_id;
            state.created_at = user.created_at;
            state.updated_at = user.updated_at;
            state.theme_preference = user.theme_preference;
            state.is_active = user.is_active;
            state.is_staff = user.is_staff;

            state.loading = false;
            state.error = null;
            state.isAuthenticated = true;
        })
        .addCase(fetchMe.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
})

// メールアドレスとパスワードでのユーザー仮登録を行う関数（非同期）
export const signUpWithLocal = createAsyncThunk(
    "user/signUpWithLocal",
    async ({ email, password }, thunkAPI) => {
        try {
            // Django側に向けてリクエストを実施し、結果を取得
            const response = await api.post(
                "/accounts/signup",
                { email, password }
            );

            const user = response.data.user;
            // Django側で発行したJWTのアクセストークン
            const accessToken = response.data.access;
            const refreshToken = response.data.refresh;
            const message = response.data.message;

            // TODO: ローカルストレージで危ないので、アクセストークンはHttpOnly Cookieに保存する
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            // returnの中身はextraReducersのfulfilledに向けて飛ばす
            // Reduxにユーザー情報を保存するため
            // コンポーネント側でunwrap()を使えばreturnの中身を取得できる
            return {
                id: user.id,
                email: user.email,
                provider: user.provider,
                created_at: user.created_at,
                updated_at: user.updated_at,
                message: message,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "ログインに失敗しました。");
        }
    }
);


// サインアップ後のメール認証時
export const verifyEmail = createAsyncThunk(
    "user/verifyEmail",
    async({token}, thunkAPI) => {
        try {
            const response = await api.get(`/accounts/verify_email?token=${token}`);
            return response.data.user;
        } catch(error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.message || "メール認証に失敗しました。");
        }

    }
);


export const loginWithLocal = createAsyncThunk(
    "user/loginWithLocal",
    async ({email, password}, thunkAPI) => {
        try {
            const response = await api.post(
                "accounts/login",
                {email, password}
            );
            // ログインに成功するとアクセストークンとリフレッシュトークンを取得できる
            const {access, refresh} = response.data;
            // TODO: ローカルストレージに保存していたアクセストークンを削除（そもそもローカルストレージには保存したくないので修正する）
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);

            // ログインに成功したらfetchMeで自身の情報を取得する
            const me = await thunkAPI.dispatch(fetchMe());
            return me.payload;

        } catch(error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.non_field_errors[0] || "ログインに失敗しました。");
        }
    }
);


export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    async(_, thunkAPI) => {
        // TODO: ローカルストレージには保存しておかないこと
        const refreshToken = localStorage.getItem("refreshToken");
        // リフレッシュトークンがない場合、または連続でログアウト処理が走った場合は処理しない
        if (!refreshToken) {
            return true;
        }

        try {
            console.log("ログアウトの実施");
            await authApi().post(
                "accounts/logout",
                {"refresh": refreshToken},
            );

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            return true;
        } catch(error) {
            console.log(`ログアウトに失敗；エラー：${error}`);
            thunkAPI.rejectWithValue(error?.response?.data?.message || "ログアウトに失敗しました。")
        }
    }
)


export const fetchMe = createAsyncThunk(
    "user/fetchMe",
    async (_, thunkAPI) => {
        try {
            // responseで返ってくるのはユーザーの全ての情報
            const response = await authApi().get("/accounts/me");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "ユーザー情報の取得に失敗しました。");
        }
    }
);



export const { logout } = userSlice.actions;
export default userSlice.reducer