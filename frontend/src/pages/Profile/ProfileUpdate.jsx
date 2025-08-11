import { Box, Field, Input, Checkbox, defineStyle, Button } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe, updateProfile } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
    const profile = useSelector((state) => state.user.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    // ユーザー状態を取得
    useEffect(() => {
        const getMe = async () => {
            try {
                await dispatch(fetchMe()).unwrap();
            } catch (error) {
                console.log(error);
                navigate("/");
            }
        };
        getMe();
    }, [dispatch, navigate]);

    // プロフィール情報の取得後、stateへ反映
    useEffect(() => {
        if (profile) {
            setName(profile.name ?? "");
            setBio(profile.bio ?? "");
            setIsPublic(profile.is_public);
        }
    }, [profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(updateProfile({name, bio, "is_public": isPublic}));
        } catch (error) {
            console.log(error);
        }
        return
    };

    // inputのフォームのスタイル by chakraUI
    const floatingStyles = defineStyle({
        pos: "absolute",
        bg: "bg",
        px: "0.5",
        top: "-3",
        insetStart: "2",
        fontWeight: "normal",
        pointerEvents: "none",
        transition: "position",
        _peerPlaceholderShown: {
            color: "fg.muted",
            top: "2.5",
            insetStart: "3",
        },
        _peerFocusVisible: {
            color: "fg",
            top: "-3",
            insetStart: "2",
        },
    })

    return (
        <div>
            <h2>プロフィール情報の変更</h2>
            <form onSubmit={handleSubmit}>
                <Field.Root>
                    <Box pos="relative" w="full" mb={4} mt={4}>
                        <Input
                            className="peer"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Field.Label css={floatingStyles}>ユーザーネーム</Field.Label>
                    </Box>

                    <Box pos="relative" w="full" mb={4}>
                        <Input
                            className="peer"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <Field.Label css={floatingStyles}>自己紹介</Field.Label>
                    </Box>
                </Field.Root>
                <Checkbox.Root
                    checked={isPublic}
                    onCheckedChange={() => setIsPublic((prev) => !prev)}
                    mb={4}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>プロフィールを公開</Checkbox.Label>
                </Checkbox.Root>

                <Button type="submit" colorScheme="blue">更新</Button>
            </form>
        </div>
    )
}

export default ProfileUpdate
