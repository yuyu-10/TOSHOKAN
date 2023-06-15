import "../css/Manga.css"
import { useNavigate } from "react-router-dom"

export const Manga = (({ id, title, mangaka, image }) => {
    const navigate = useNavigate()

    return (
        <div onClick={() => navigate(`/infos/${id}`)}
            key={id}
            className="mangaContainer"
        >
            <div className="img-list">
                <img src={image} alt="" />
            </div>

            <div className="informations-manga">
                <h2>{title}</h2>
                <p>Mangaka: {mangaka}</p>
            </div>
        </div>
    )
})