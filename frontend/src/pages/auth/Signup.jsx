import { useState } from 'react'
import { RiMailSendLine } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { signUpWithLocal } from '../../features/user/userSlice';
import { toaster } from '../../components/ui/toaster';
import { useRedirectIfAuthenticated } from '../../hooks/useRedirectIfAuthenticated';

const Signup = () => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const [email ,setEmail] = useState("");
    const [password ,setPassword] = useState("");
    const [message ,setMessage] = useState("");
    const [isEmailSent ,setIsEmailSent] = useState(false);

    useRedirectIfAuthenticated();


    // Django側にリクエストを飛ばし、結果を返す
    const handleSubmit = async (e) => {
        e.preventDefault();

        const signupPromise = dispatch(signUpWithLocal({ email, password })).unwrap();
        toaster.promise(signupPromise, {
            loading: {
                title: "ユーザー新規登録中...",
                description: "しばらくお待ちください",
                closable: true,
            },
            success: {
                title: "ユーザー新規登録に成功しました。",
                description: "",
                closable: true,
            },
        });
        try {
            const result = await signupPromise;
            setMessage(result.message);
            setIsEmailSent(true);
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
            <h2>新期登録</h2>
            {message && <div className="">{ message }</div>}
            {!user.loading && (
                <>
                    {isEmailSent ? (
                        <div className=''>
                            <RiMailSendLine />
                        </div>
                    ) : (
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
                                <button type='submit'>登録</button>
                            </div>
                        </form>
                    )}
                </>
            )}
        </div>
    )
}

export default Signup
