import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import LoadingSpinner from "../../components/ui/LoadingSpinner"
import FolderDetailItem from "./FolderDetailItem";
import { useUpdateFolder } from "../../context/FolderContext";
import { authApi } from "../../utils/api";


const FolderDetail = () => {
    const { id } = useParams();
    const dispatch = useUpdateFolder();
    const [ loading, setLoading ] = useState(true);
    const [ folder, setFolder ] = useState({});

    // フォルダの詳細情報（小説も含めて）取得する
    useEffect(() => {
        const getFolder = async () => {
            try {
                const { data } = await authApi().get(`folders/${id}`);
                setFolder(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getFolder();
    }, [setLoading, dispatch, id])

    if (!folder?.novels?.length) return <h2>フォルダはありません</h2>;

    return (
        <div>
            <h2>ここはフォルダの詳細画面です。</h2>
            {!loading ? (
                <FolderDetailItem folder={folder}/>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    )
}

export default FolderDetail
