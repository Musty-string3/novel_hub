import { Link } from 'react-router-dom'

const FolderDetailItem = ({folder}) => {
    return (
        <div className="">
            {folder.novels.map((novel) => (
                <div key={novel.id}>
                    <li>
                        <Link to={`/novels/${novel.id}`}>
                            {novel.title}
                        </Link>
                    </li>
                </div>
            ))}
        </div>
    )
}

export default FolderDetailItem
