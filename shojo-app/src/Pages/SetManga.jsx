import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios"

const SetManga = () => {

    const {uid} = useParams()
    const getURL = `http://localhost:3000/getOneById/${uid}`
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [resume, setResume] = useState('')
    const [mangaka, setMangaka] = useState('')
    const [image, setImage] = useState('')
    const [mangakas, setMangakas] = useState([])

    const getMangakas = async () => {
        const getURL = "http://localhost:3000/getMangakas"
        const response = await axios.get(getURL)
        setMangakas(response.data)
      }
      
      useEffect(() => {
        getMangakas()
      }, [])
    
    useEffect(() => {
        const getData = async() => {
            const response = await axios.get(getURL)
            console.log(response.data)
            setTitle(response.data[0].title)
            setDate(response.data[0].year_of_publication)
            setResume(response.data[0].resume)
            setMangaka(response.data[0].author)
            setImage(response.data[0].image)
        }
        getData()
    }, [getURL])
    
    if (!title || !date || !resume) return null
    return (
        <div>
            <div className="post" >
                <h1>Update</h1>
            <div className="formulaire" style={{width: "80vh", height: "80vh"}}>
                <form>
                <div className="champs">
                    <label> Title: </label>
                    <input
                    type="text"
                    value={title}
                    />
                </div>
                <div className="champs">
                    <label> Year of publication: </label>
                    <input
                    type="text"
                    value={date}
                    />
                </div>
                <div className="champs">
                    <label> Resume: </label>
                    <textarea
                    type="text"
                    value={resume}
                    maxLength={500}
                    />
                </div>
                <div className="champs">
                    <label> Mangaka: </label>
                    <select>
                        <option style={{textAlign: 'center'}}>{mangaka}</option>
                        {mangakas.map((x) => (
                            <option key={x.id} value={x.id} style={{textAlign: 'center'}}>
                            {x.author}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="champs" style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <label> Choose another image: </label>
                        <input
                        type="file"
                        style={{height: "3vh"}}
                        />
                    </div>
                    
                    <img src={image} alt="" style={{width: "25vh"}} />
                </div>
                <button type="submit">Send</button>
                </form>
            </div>
            </div>
        </div>
    )
}

export default SetManga