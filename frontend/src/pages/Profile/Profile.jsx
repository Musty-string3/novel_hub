import React, { useState, useEffect } from 'react'

const Profile = () => {
    const [message, setMessage] = useState("");

    // 初回起動時にリクエスト送る
    // TODO: API通信はutilsフォルダに移行する
    useEffect(() => {
        fetch("http://127.0.0.1:8000/accounts/")
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error(err))
    }, []);

    return (
        <div>
            <h1>accountsからのレスポンスです。</h1>
            <p>メッセージ内容:{message}</p>
        </div>
    )
}

export default Profile
