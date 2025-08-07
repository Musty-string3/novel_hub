import React, { useState } from 'react'
import { RiMailSendLine } from "react-icons/ri";
import { Spinner } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpWithLocal } from '../../features/user/userSlice';

const Signup = () => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const [email ,setEmail] = useState("");
    const [password ,setPassword] = useState("");
    const [message ,setMessage] = useState("");
    const [isEmailSent ,setIsEmailSent] = useState(false);


    // Django側にリクエストを飛ばし、結果を返す
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await dispatch(signUpWithLocal({ email, password })).unwrap();
            console.log("response: ", response);
            setMessage(response.message);
            setIsEmailSent(true);
        } catch (error) {
            console.log("error:", error);
            if (error.response) {
                setMessage(error.response.data.message || "ユーザー登録に失敗しました。");
            } else {
                setMessage("通信エラーが発生しました。");
            }
        }
        return
    };

    return (
        <div>
            <h2>新期登録</h2>
            {!user.loading ? (
                <>
                    {message && <div className="">{ message }</div>}
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
            ) : (
                <Spinner animationDuration="0.7s"/>
            )}
        </div>
    )
}

export default Signup
