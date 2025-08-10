import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, logoutUser } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toaster } from '../../components/ui/toaster';


const Logout = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ログアウトの前にまずはユーザーを取得できるか確認する
    useEffect(() => {
        const fetchUser = async () => {
            await dispatch(fetchMe());
        }
        fetchUser();
    }, [dispatch]);

    // ユーザー状態を見てログアウトの実施
    useEffect(() => {
        // ローディング中は処理しない
        if (user.loading) return;

        const handleLogout = async () => {
            if (user.isAuthenticated) {
                // ログアウト処理を実施
                console.log("ログアウト処理の実施");
                try {
                    await dispatch(logoutUser());
                    toaster.create({
                        title: "ログアウトしました。",
                        type: "success",
                        closable: true,
                    });
                } catch (error) {
                    toaster.create({
                        title: "ログアウトに失敗しました。",
                        description: error,
                        type: "error",
                        closable: true,
                    });
                }
                navigate("/");
            } else {
                // そもそもユーザーを取得できない場合はトップページにリダイレクトさせる
                toaster.create({
                    title: "すでにログアウト済みです。",
                    type: "error",
                    closable: true,
                });
                navigate("/");
            }
        };

        handleLogout();
    }, [user.isAuthenticated, user.loading, navigate, dispatch]);

    // 画面表示はしない
    return null;
}

export default Logout