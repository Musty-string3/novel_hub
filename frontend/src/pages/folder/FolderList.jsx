import { useEffect, useState } from "react"

import { authApi } from "../../utils/api";
import { useFolder, useUpdateFolder } from "../../context/FolderContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import FolderItem from "./FolderItem";

const FolderList = () => {
    const folders = useFolder();
    const folderDispatch = useUpdateFolder();
    const [loading, setLoading] = useState(true);

    // フォルダの一覧取得
    useEffect(() => {
        const fetchFolder = async () => {
            try {
                const response = await authApi().get("folders");
                await folderDispatch({ type: "foldersList", payload: response.data });
            } catch (error) {
                console.log(`error: ${error}`);
            } finally {
                setLoading(false);
            }
        };
        fetchFolder();
    }, [folderDispatch]);

    return (
        <div>
            <h2>ここはフォルダ一覧です。</h2>
            {!loading ? (
                <FolderItem folders={folders}/>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    )
}

export default FolderList
