import { useEffect } from 'react'
import { toaster } from '../components/ui/toaster';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMe } from '../features/user/userSlice';

export const useRedirectIfAuthenticated = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate("");

    // ユーザー情報を取得できるか確認する
    useEffect(() => {
        dispatch(fetchMe());
    }, [dispatch]);

    // すでにログインしていたらトップページに遷移させる
    useEffect(() => {
        if (user.isAuthenticated) {
            toaster.create({
                title: `すでに${user.email}でログイン済みです。`,
                type: "error",
                closable: true,
            });
            navigate("/");
        }
    }, [user.isAuthenticated, navigate]);
}
