import { Link } from "react-router-dom";
import { FaFolderOpen } from "react-icons/fa6";

const FolderItem = ({folders}) => {
    return (
        <div>
            {folders.map((folder) => (
                <div key={folder.id}>
                    <li>
                        <Link to={`/folders/${folder.id}`}>
                            {folder.name}
                        </Link>
                    </li>
                </div>
            ))}
        </div>
    )
}

export default FolderItem
