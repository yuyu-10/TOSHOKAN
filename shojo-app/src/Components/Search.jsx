import { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"
import { Manga } from '../Components/Manga'

export const Search = () => {
    let {uid} = useParams()
    const getURL = `http://localhost:3000/getOne?title=${uid}`
    const [mangas, setMangas] = useState('')

    useEffect(() => {
        const choperLaData = async() => {
            const response =  await axios.get(getURL)
            setMangas(response.data)
            }
        choperLaData()
    },[getURL])

    if(typeof mangas == 'string') return <div className="containerHome"><h1 style={{textAlign: "center"}}>Sorry, there is no result for '{uid}'...</h1></div>
    return (
        <div className="containerHome">
            {mangas.map((x) => <Manga id={x.id} key={x.id} title={x.title} mangaka={x.author} image={x.image}/>)}
        </div> 
    )
}