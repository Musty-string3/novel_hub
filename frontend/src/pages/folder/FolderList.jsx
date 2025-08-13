import { useEffect, useState } from "react"
import { authApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";

import { useFolder, useUpdateFolder } from "../../context/FolderContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import FolderItem from "./FolderItem";
import FolderCreate from "./FolderCreate";

const FolderList = () => {
    const folders = useFolder();
    const folderDispatch = useUpdateFolder();
    const [loading, setLoading] = useState(true);
    const [newFolder, setNewFolder] = useState("");
    const navigate = useNavigate();

    // フォルダの一覧取得
    useEffect(() => {
        const fetchFolder = async () => {
            try {
                const response = await authApi().get("folders");
                await folderDispatch({ type: "folders/list", payload: response.data });
            } catch (error) {
                console.log(`error: ${error}`);
                if (error?.status === 401) {
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchFolder();
    }, [folderDispatch]);

    // フォルダ一覧から削除ボタン押下で1つのフォルダごと削除
    const handleDeleteFolder = async (folderId) => {
        await authApi().delete(`folders/${folderId}`);
        folderDispatch({"type": "folders/delete", payload: folderId});
    };

    // フォルダ一覧から作成ボタン押下で1つのフォルダを作成
    const createFolder = async () => {
        try {
            const response = await authApi().post(
                "folders",
                { name: newFolder }
            );
            await folderDispatch({"type": "folders/create", payload: response.data});
            setNewFolder("");
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div>
            <h2>ここはフォルダ一覧です。</h2>
            <FolderCreate newFolder={newFolder} setNewFolder={setNewFolder} createFolder={createFolder}/>
            {!loading ? (
                <FolderItem folders={folders} handleDeleteFolder={handleDeleteFolder}/>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    )
}

export default FolderList
