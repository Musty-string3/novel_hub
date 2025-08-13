import { Button, DataList } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const FolderDetailItem = ({folder, handleDeleteNovel}) => {
    const navigate = useNavigate();

    return (
        <div>
            <DataList.Root orientation="horizontal" divideY="1px" maxW="md">
                {folder.novels.map((novel) => (
                    <DataList.Item
                        key={novel.id}
                        pt="4"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/novels/${novel.id}`)}
                    >
                        <DataList.ItemLabel>{novel.title}</DataList.ItemLabel>
                        <DataList.ItemValue>{novel.title}</DataList.ItemValue>
                        <Button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNovel(novel.id);
                            }}
                            size="xs"
                            style={{ cursor: "pointer" }}
                            colorPalette="red"
                        >削除
                        </Button>
                    </DataList.Item>
                ))}
            </DataList.Root>
        </div>
    )
}

export default FolderDetailItem
