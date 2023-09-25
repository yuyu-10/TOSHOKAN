import "../css/Manga.css"
import { useNavigate } from "react-router-dom"

export const Manga = (({ id, title, mangaka, image }) => {
    const navigate = useNavigate()

    return (
        <div className="mangaContainer">
            <div key={id}>

                <img src={image} />

                <div className="informations-manga">
                    <h2>{title}</h2>
                    <p>Mangaka: {mangaka}</p>
                </div>
            </div>
            <button
                className="view"
                onClick={() => navigate(`/infos/${id}`)}
            >
                VIEW MORE
            </button>
        </div>
    )
})