import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

const SetManga = () => {
    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()

    const {uid} = useParams()
    const getURL = `http://localhost:3000/getOneById/${uid}`

    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [resume, setResume] = useState('')
    const [mangaka, setMangaka] = useState('')
    const [animation, setAnimation] = useState('')
    const [url, setUrl] = useState('')
    const [publicId, setPublicId] = useState('')
    const [file, setFile] = useState(null)
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
            console.log('response', response.data)
            setTitle(response.data[0].title)
            setDate(response.data[0].year_of_publication)
            setResume(response.data[0].resume)
            setMangaka(response.data[0].mangaka_id)
            setUrl(response.data[0].url)
            setPublicId(response.data[0].public_id)

            if (response.data[0].animation === true) {
                setAnimation('yes')
            } else {
                setAnimation('no')
            }
        }
        getData()
    }, [getURL])

    const handleChangeTitle = (event) => {
        setTitle(event.target.value)
      }
      
      const handleChangeDate = (event) => {
        setDate(event.target.value)
      }
      
      const handleChangeResume = (event) => {
        setResume(event.target.value)
      }

      const handleFileChange = (e) => {
        setFile(e.target.files[0])
      }
      

    const onSubmit = async (data) => {
        const updateMangaUrl = `http://localhost:3000/modifyManga/${uid}`
        try {
            console.log(data)
            const response = await axios.put(updateMangaUrl, data)
            getMangakas()
            console.log(response.data)
            checkImage(data.title)
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
        formData.append('title', title)
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
      
    
      const updateImage = async (response, title) => {
        const url = response.data[0].secure_url
        const publicId = response.data[0].public_id
        const setImageUrl = "http://localhost:3000/updateImage"
        try {
          const response = await axios.put(setImageUrl, {'url': url, 'publicId': publicId})
          console.log(response.data)
          navigate('/Check')
        } catch (error) {
          console.log(error)
        }
      }

    if (!title || !date || !resume) return null
    return (
        <div>
            <div className="post" >
                <h1>Update</h1>
            <div className="formulaire" style={{width: "80vh", height: "80vh"}}>
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className="champs">
                    <label> Title: </label>
                    <input
                    type="text"
                    value={title}
                    {...register("title")}
                    onChange={handleChangeTitle}
                    />
                </div>
                <div className="champs">
                    <label> Year of publication: </label>
                    <input
                    type="text"
                    value={date}
                    {...register("year")}
                    onChange={handleChangeDate}
                    />
                </div>
                <div className="champs">
                    <label> Resume: </label>
                    <textarea
                    type="text"
                    value={resume}
                    maxLength={500}
                    {...register("resume")}
                    onChange={handleChangeResume}
                    />
                </div>
                <div className="champs">
                    <label> Mangaka: </label>
                    <select {...register("mangaka")} value={mangaka}>
                        {/* <option style={{textAlign: 'center'}}>{mangaka}</option> */}
                        {mangakas.map((x) => (
                            <option key={x.mangaka_id} value={x.mangaka_id} style={{textAlign: 'center'}}>
                            {x.author}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="champs">
                    <label> Animation: </label>
                    <select {...register("animation")}>
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
                <button type="submit">Send</button>
                </form>
            </div>
            </div>
        </div>
    )
}

export default SetManga