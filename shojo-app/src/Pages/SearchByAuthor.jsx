import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Manga } from "./Manga";

const SearchByAuthor = () => {
    let { uid } = useParams();
    const [mangas, setMangas] = useState("");
    
    return (
        <div>

        </div>
    )
}

export default SearchByAuthor;