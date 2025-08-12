import { useEffect, useState } from "react"

import { authApi } from "../../utils/api";
import { useFolder, useUpdateFolder } from "../../context/FolderContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner"
import FolderItem from "./FolderItem";
import { useNavigate } from "react-router-dom";

const FolderList = () => {
    const folders = useFolder();
    const folderDispatch = useUpdateFolder();
    const [loading, setLoading] = useState(true);
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
