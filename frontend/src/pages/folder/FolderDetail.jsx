import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LoadingSpinner from "../../components/ui/LoadingSpinner"
import FolderDetailItem from "./FolderDetailItem";
import { useUpdateFolder } from "../../context/FolderContext";
import { authApi } from "../../utils/api";
import FolderDetailCreate from "./FolderDetailCreate";


const FolderDetail = () => {
    const { id } = useParams();
    const dispatch = useUpdateFolder();
    const [ loading, setLoading ] = useState(true);
    const [ folder, setFolder ] = useState([]);
    const navigate = useNavigate();

    // フォルダの詳細情報（小説も含めて）取得する
    useEffect(() => {
        const getFolder = async () => {
            try {
                const { data } = await authApi().get(`folders/${id}`);
                setFolder(data);
            } catch (error) {
                if (error?.response?.status === 401) {
                    navigate("/login");
                }
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getFolder();
    }, [setLoading, dispatch, id])

    // 特定のフォルダの中の小説一覧から削除ボタン押下で1つの小説を削除
    const handleDeleteNovel = async (novelId) => {
        await authApi().delete(`novels/${novelId}`);
        setFolder({
            ...folder,
            novels: folder.novels.filter((novel) => novel.id !== novelId)
        });
    };

    // 特定のフォルダの中の小説一覧から作成ボタン押下で1つの小説を作成
    const createNovel = async (
        title,
        description,
        isPublic,
        showSpeaker,
        backgroundColor
    ) => {
        try {
            const response = await authApi().post(
                `folders/${id}/novels`,
                {
                    "title": title,
                    "description": description,
                    "is_public": isPublic,
                    "show_speaker": showSpeaker,
                    "background_color": backgroundColor
                 }
            );
            setFolder({
                ...folder,
                novels: [...folder.novels, response.data]
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>ここはフォルダの詳細画面です。</h2>
            <FolderDetailCreate createNovel={createNovel}/>
            {!loading ? (
                <FolderDetailItem folder={folder} handleDeleteNovel={handleDeleteNovel}/>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    )
}

export default FolderDetail
