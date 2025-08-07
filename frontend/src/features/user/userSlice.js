import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";


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
    is_active: false,
    is_staff: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // ログアウトはAPI経由ではなくフロント側だけで行えば良いので同期通信で行う
        // TODO セッション情報などをサーバー側で保管している場合はextraReducersにしてAPI経由でログアウトさせる
        logout() {
            // TODO: ローカルストレージに保存していたアクセストークンを削除（そもそもローカルストレージには保存したくないので修正する）
            localStorage.removeItem("accessToken");
            return initialState;
        },
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
    }
})

// メールアドレスとパスワードでのユーザー登録を行う関数（非同期）
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
            const message = response.data.message;

            // TODO: ローカルストレージで危ないので、アクセストークンはHttpOnly Cookieに保存する
            localStorage.setItem("accessToken", accessToken);

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

export const { logout } = userSlice.actions;
export default userSlice.reducer
