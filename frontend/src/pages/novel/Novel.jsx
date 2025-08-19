import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Button, HStack, IconButton, Input, Stack, VStack } from "@chakra-ui/react";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";

import LoadingSpinner from "../../components/ui/LoadingSpinner"
import { authApi } from "../../utils/api";


const Novel = () => {
    const { id } = useParams();
    const [ loading, setLoading ] = useState(true);
    const [ novel, setNovel ] = useState({});
    const [ input, setInput ] = useState("");
    const [ editingId, setEditingId ] = useState("");

    // まずは小説の詳細データをAPI経由で取得する
    useEffect(() => {
        const fetchNovel = async () => {
            try {
                const response = await authApi().get(`novels/${id}`);
                console.log(response.data);
                setNovel(response.data)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchNovel()
    }, [id]);

    // メッセージの作成
    const handleSend = async (e) => {
        e.preventDefault();

        console.log(input);
        const response = await authApi().post(`novels/${id}/message/`, {"message": input});
        console.log(response);
        setNovel({
            ...novel,
            "messages": [...novel.messages, response.data]
        });
    };

    const handleDirection = async (direction) => {

        const directionNum = getDirectionNum(direction);

        // 変更するデータをAPIに投げてステートを更新する
        const response = await authApi().patch(
            `novels/${id}/message/${editingId}`,
            {"direction": directionNum}
        );
        setNovel({
            ...novel,
            "messages": novel.messages.map((message) => (
                Number(message.id) === Number(editingId) ? response.data : message
            ))
        });
    };

    // 表示順を切り替えた時にどちらの方向にメッセージを配置するかを計算する関数
    function getDirectionNum(direction) {
        // 現在の表示順を取得
        const editingMessage = novel.messages.find((message) => (
            Number(message.id) === Number(editingId))
        );

        if (!editingMessage) return 0;

        let num = editingMessage.direction;
        if (direction === "right") {
            num = (num + 1) % 3;
        } else if (direction === "left") {
            num = (num + 2) % 3;
        }
        return num
    }

    return (
        <div>
            <h2>ここは小説画面です</h2>
            {!loading ? (
                 <>
                    {/* チャット欄 */}
                    {/* メッセージの並び順を表示順の昇順で並べる */}
                    {[...novel.messages].sort((a, b) => a.order - b.order).map((message) => (
                        <div className="" key={message.id}>
                            <p
                                onDoubleClick={() => setEditingId(message.id)}
                            >
                                {message.message}
                            </p>
                            <p>横方向：{message.direction_label}, 縦方向：{message.order}</p>
                        </div>
                    ))}
                    {/* 送信ボックス */}
                    <Stack gap="2" align="flex-start">
                        {/* 横の表示順を変更 */}
                        {editingId && (
                            <>
                                <HStack wrap="wrap" gap="8">
                                    <VStack>
                                        <IconButton
                                            aria-label="Call support"
                                            variant="ghost"
                                            onClick={() => handleDirection("left")}
                                        >
                                            <CiCircleChevLeft />
                                        </IconButton>
                                    </VStack>
                                    <VStack>
                                        <IconButton
                                            aria-label="Call support"
                                            variant="ghost"
                                            onClick={() => handleDirection("right")}
                                        >
                                            <CiCircleChevRight />
                                        </IconButton>
                                    </VStack>
                                </HStack>
                                <Button
                                    type="button"
                                    onClick={(e) => setEditingId("")}
                                    colorPalette="teal"
                                >戻す
                                </Button>
                            </>
                        )}

                        <Stack align="center" direction="row" gap="10">
                            <Input
                                type="text"
                                placeholder="コメントを追加"
                                value={input}
                                required
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button
                                type="button"
                                onClick={(e) => handleSend(e)}
                                disabled={!input.length}
                                colorPalette="teal"
                            >作成
                            </Button>
                        </Stack>
                    </Stack>
                 </>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    )
}

export default Novel
