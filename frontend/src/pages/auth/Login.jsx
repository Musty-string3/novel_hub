import { useState } from 'react'
import { Spinner, Button } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { loginWithLocal } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { toaster } from "../../components/ui/toaster";
import { useRedirectIfAuthenticated } from '../../hooks/useRedirectIfAuthenticated';


const Login = () => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate("");

    const [email ,setEmail] = useState("");
    const [password ,setPassword] = useState("");

    useRedirectIfAuthenticated();

    // Django側にリクエストを飛ばし、ログイン結果を返す
    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginPromise = dispatch(loginWithLocal({ email, password })).unwrap();

        toaster.promise(loginPromise, {
            loading: {
                title: "ログイン中...",
                description: "しばらくお待ちください",
                closable: true,
            },
            success: {
                title: "ログインに成功しました。",
                description: "",
                closable: true,
            },
        });
        try {
            await loginPromise;
            navigate("/");
        } catch (error) {
            toaster.create({
                title: "ログインに失敗しました。",
                description: error,
                type: "error",
                closable: true,
            });
        }
        return
    };

    return (
        <div>
            <h2>ログイン</h2>
            {!user.loading ? (
                <form onSubmit={handleSubmit}>
                    <div className="">
                        <label
                            htmlFor='input_email'
                        >メールアドレス</label>
                        <input
                            type="email"
                            id='input_email'
                            placeholder='メールアドレス'
                            value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="">
                        <label
                            htmlFor='input_password'
                        >パスワード</label>
                        <input
                            type="password"
                            id='input_password'
                            placeholder='パスワード'
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)}}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="">
                        <button type='submit'>ログイン</button>
                    </div>
                </form>
            ) : (
                <Spinner animationDuration="0.7s"/>
            )}
        </div>
    )
}

export default Login
