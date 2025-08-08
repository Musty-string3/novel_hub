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

    return axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
        }
    })
};
