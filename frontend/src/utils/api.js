import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

// トークンなしのAPI
export const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// トークンありのAPI
export const authApi = () => {
    // TODO: ローカルストレージに保存していたアクセストークンを削除（そもそもローカルストレージには保存したくないので修正する）
    const accessToken = localStorage.getItem("accessToken");

    const request = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
        }
    });

    // サーバーからログインしているかの認証結果を返却された際の動作
    request.interceptors.response.use(
        (response) => response,
        (error) => {
            // ログインユーザーの認証に失敗したらログイン画面に遷移させる
            if (error?.response?.status === 401) {
                // ログイン画面の時は動作させない
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
            return Promise.reject(error);
        }
    );

    return request;
};
