import { Button, DataList } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const FolderItem = ({folders, handleDeleteFolder}) => {
    const navigate = useNavigate();

    return (
        <div>
            <DataList.Root orientation="horizontal" divideY="1px" maxW="md">
                {folders.map((folder) => (
                    <DataList.Item
                        key={folder.id}
                        pt="4"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/folders/${folder.id}`)}
                    >
                        <DataList.ItemLabel>{folder.name}</DataList.ItemLabel>
                        <DataList.ItemValue>{folder.name}</DataList.ItemValue>
                        <DataList.PropsProvider>
                            <Button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFolder(folder.id);
                                }}
                                size="xs"
                                style={{ cursor: "pointer" }}
                                colorPalette="red"
                            >削除
                            </Button>
                        </DataList.PropsProvider>
                    </DataList.Item>
                ))}
            </DataList.Root>
        </div>
    )
}

export default FolderItem
