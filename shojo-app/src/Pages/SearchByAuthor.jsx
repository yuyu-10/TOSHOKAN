import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Manga } from "../Components/Manga"
import axios from "axios"

const SearchByAuthor = () => {
    let { uid } = useParams()
    const getURL = `http://localhost:3000/getMangakaByName?mangaka=${uid}`
    const [mangas, setMangas] = useState("")

    const getData = async() => {
        try {
            const response = await axios.get(getURL)
            console.log(response.data)
            setMangas(response.data)
            console.log("mangas: ", mangas)
        } catch (err) {
            console.error('Problemes lors de la récup des mangas: ', err)
        }
    }

    useEffect(() => {
        getData()
    }, [uid])


    // const [mangas, setMangas] = useState("")

    // const fetchDataMangas = async () => {
    //     console.log(uid)
    //     const getURL = `http://localhost:3000/getMangakaByName/${uid}`
    //     try {
    //         const response = await axios.get(getURL)
    //         console.log(response)
    //         setMangas(response)
    //     } catch (err) {
    //         console.error("Erreur lors de la recup des mangas via l'auteur: ", err)
    //     }
    // }

    // useEffect(() => {
    //     fetchDataMangas()
    // }, [uid])
    
    return (
        <div>TEST</div>
    //     <div className="containerHome">
    //         {mangas.map((x) => (
    //         <Manga
    //             id={x.id}
    //             key={x.id}
    //             title={x.french_title !== null ? x.french_title : x.romanji_title}
    //             mangaka={x.author}
    //             image={x.url}
    //         />
    //         ))}
    //   </div>
    )
}

export default SearchByAuthor

// const onSubmit = async (data) => {
//     const postURL = "http://localhost:3000/addManga";
//     try {
//       console.log(data);
//       const response = await axios.post(postURL, data);
//       verification(response.data, data.romanji_title);
//     } catch (error) {
//       console.log(error);
//     }
//   };