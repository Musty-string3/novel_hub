import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchMe } from '../../features/user/userSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';


const Profile = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // ユーザー状態を取得
    useEffect(() => {
        const getMe = async () => {
            dispatch(fetchMe());
        };
        getMe();
    }, [dispatch]);

    if (user.loading) return <LoadingSpinner />;

    return (
        <div>
            {user?.error && user.error}
            {user?.isAuthenticated ? (
                <div className="">
                    <h1>あなたの情報</h1>
                    <p>ニックネーム: { user.profile.name }</p>
                    <p>自己紹介: { user.profile.bio }</p>
                    <p>プロフィール公開設定: { user.profile.is_public ? "公開" : "非公開" }</p>
                    <div>
                        <Link to="/logout">ログアウト</Link>
                        <br />
                        <Link to="/profile/update">プロフィール編集</Link>
                        <br />
                        <Link to="/folder">フォルダ</Link>
                    </div>
                </div>
            ) : (
                <Link to="/login">ログイン</Link>
            )}
            <div className="">
                <Link to="/">トップへ</Link>
            </div>
        </div>
    )
}

export default Profile
