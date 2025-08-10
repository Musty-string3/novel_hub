import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { api } from '../../utils/api';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../../features/user/userSlice';

const VerifyEmail = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [executed, setExecuted] = useState(false);


    // メール認証に完了したら一度だけ処理実行
    useEffect(() => {
        // 一度実行したらそれ以降は処理しない
        if (executed) return

        const token = searchParams.get("token");

        if (!token) {
            setMessage("トークンがありません。");
            setLoading(false);
            return;
        }

        const verify = async () => {
            try {
                const response = await dispatch(verifyEmail(token)).unwrap();
                setMessage(response.data.message);
            } catch (error) {
                setMessage(error.response.data.message);
            } finally {
                setLoading(false);
                setExecuted(true);
            }
        };

        verify();
    }, [searchParams, executed]);

    return (
        <Box p={8}>
            {loading ? (
                <Spinner animationDuration="0.7s"/>
            ) : (
                <Text fontSize="xl">
                    { message }
                </Text>
            )}
        </Box>
    )
}

export default VerifyEmail
