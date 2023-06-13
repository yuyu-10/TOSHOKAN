import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom"

//Import all request data
import { getMangakas } from "../api/mangaka";
import { getMangasById } from "../api/manga";

const SetManga = () => {
    const navigate = useNavigate()
    const {uid} = useParams()

    const [original_title, setOriginalTitle] = useState('')
    const [romanji_title, setRomanjiTitle] = useState('')
    const [french_title, setFrenchTitle] = useState('')
    const [date, setDate] = useState('')
    const [resume, setResume] = useState('')
    const [mangaka, setMangaka] = useState('')
    const [animation, setAnimation] = useState('')
    const [url, setUrl] = useState('')
    const [publicId, setPublicId] = useState('')
    const [file, setFile] = useState(null)
    const [mangakas, setMangakas] = useState([])

    const fetchDataMangakas = async () => {
        try {
          const mangakas = await getMangakas();
          setMangakas(mangakas);
        } catch (error) {
          console.error("Erreur lors de la récupération des mangakas :", error);
        }
      };
    
    useEffect(() => {
    fetchDataMangakas();
    }, []);

    const fetchDataMangas = async () => {
    try {
        const mangas = await getMangasById(uid);
        console.log(mangas)
        setOriginalTitle(mangas[0].original_title)
        setRomanjiTitle(mangas[0].romanji_title)
        setFrenchTitle(mangas[0].french_title)
        setDate(mangas[0].year_of_publication)
        setResume(mangas[0].resume)
        setMangaka(mangas[0].mangaka_id)
        setUrl(mangas[0].url)
        setPublicId(mangas[0].public_id)

        if (mangas[0].animation === true) {
            setAnimation('yes')
        } else {
            setAnimation('no')
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des mangas :", error)
    }
    }

    useEffect(() => {
        fetchDataMangas()
    }, [])

    const handleChangeOriginalTitle = (event) => {
        setOriginalTitle(event.target.value)
    }
      
    const handleChangeRomanjiTitle = (event) => {
        setRomanjiTitle(event.target.value)
    }
    
    const handleChangeFrenchTitle = (event) => {
        setFrenchTitle(event.target.value)
    }
    const handleChangeDate = (event) => {
        setDate(event.target.value)
    }
    
    const handleChangeResume = (event) => {
        setResume(event.target.value)
    }

    const handleChangeAnime = (event) => {
        setAnimation(event.target.value);
    };

    const handleChangeMangaka = (event) => {
        setMangaka(event.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }
      

    const onSubmit = async (event) => {
        event.preventDefault()
        const updateMangaUrl = `http://localhost:3000/modifyManga/${uid}`
        try {
            const response = await axios.put(updateMangaUrl, {
                "original_title": original_title,
                "romanji_title": romanji_title,
                "french_title": french_title,
                "year": date,
                "mangaka": mangaka,
                "resume": resume,
                "animation": animation
            })
            getMangakas()
            checkImage(romanji_title)
        } catch (e) {
            console.log(e)
        }
    }

    const checkImage = (title) => {
        if (file === null) {
            navigate(`/infos/${uid}`)
        } else {
            changeImage(title)
        }
    }
    
    const changeImage = async(title) => {
        try {
            await axios.post("http://localhost:3000/deleteImage", {'publicId': publicId})
            uploadImage(title)
        } catch(error) {
            console.log(error)
        }
    }

    const uploadImage = async (title) => {
        const formData = new FormData()
        formData.append('romanji_title', title)
        formData.append('image', file)
        const uploadUrl = "http://localhost:3000/upload"
        try {
          const response = await axios.post(uploadUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          updateImage(response, title)
        } catch (error) {
          console.log(error)
        }
      }
      
    
      const updateImage = async (response) => {
        const url = response.data[0].secure_url
        const publicId = response.data[0].public_id
        const setImageUrl = "http://localhost:3000/updateImage"
        try {
          const response = await axios.put(setImageUrl, {'url': url, 'publicId': publicId})
          console.log(response.data[0])
          navigate(`/infos/${uid}`)
        } catch (error) {
          console.log(error)
        }
      }

    // if (!title || !date || !resume) return null
    return (
        <div>
            <div className="post" >
                <h1>Update</h1>
                <div className="formulaire" style={{width: "85vh", height: "150vh", marginBottom: "3%"}}>
                    <form>
                        <div className="champs">
                            <label> Titre original: </label>
                            <input
                            type="text"
                            value={original_title}
                            onChange={handleChangeOriginalTitle}
                            />
                        </div>
                        <div className="champs">
                            <label> Titre romanji: </label>
                            <input
                            type="text"
                            value={romanji_title}
                            onChange={handleChangeRomanjiTitle}
                            />
                        </div>
                        <div className="champs">
                            <label> Titre francais: </label>
                            <input
                            type="text"
                            value={french_title}
                            onChange={handleChangeFrenchTitle}
                            />
                        </div>
                        <div className="champs">
                            <label> Year of publication: </label>
                            <input
                            type="text"
                            value={date}
                            onChange={handleChangeDate}
                            />
                        </div>
                        <div className="champs">
                            <label> Resume: </label>
                            <textarea
                            type="text"
                            value={resume}
                            maxLength={500}
                            onChange={handleChangeResume}
                            />
                        </div>
                        <div className="champs">
                            <label> Mangaka: </label>
                            <select value={mangaka} onChange={handleChangeMangaka}>
                                {mangakas.map((x) => (
                                    <option key={x.mangaka_id} value={x.mangaka_id} style={{textAlign: 'center'}}>
                                    {x.author}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="champs">
                            <label> Animation: </label>
                            <select value={animation} onChange={handleChangeAnime}>
                                <option style={{textAlign: 'center'}}>{animation}</option>
                                <option style={{textAlign: 'center'}}>{animation === 'yes' ? 'no' : 'yes'}</option>
                            </select>
                        </div>
                        <div className="champs" style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <label> Choose another image: </label>
                                <input
                                type="file"
                                style={{height: "3vh"}}
                                onChange={handleFileChange}
                                />
                            </div>
                            
                            <img src={url} alt="" style={{width: "25vh"}} />
                        </div>
                        <button type="button" onClick={(event)=> onSubmit(event)}>Send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SetManga