import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import axios from "axios"
import { useForm } from "react-hook-form"

const SetManga = () => {
    const { register, handleSubmit } = useForm()

    const {uid} = useParams()
    const getURL = `http://localhost:3000/getOneById/${uid}`

    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [resume, setResume] = useState('')
    const [mangaka, setMangaka] = useState('')
    const [animation, setAnimation] = useState('')
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
            setMangaka(response.data[0].author)

            if (response.data[0].animation === true) {
                setAnimation('yes')
            } else {
                setAnimation('no')
            }
        }
        getData()
    }, [mangakas])

    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
      };
      
      const handleChangeDate = (event) => {
        setDate(event.target.value);
      };
      
      const handleChangeResume = (event) => {
        setResume(event.target.value);
      };
      

    const onSubmit = async (data) => {
        const updateMangaUrl = `http://localhost:3000/modifyManga/${uid}`
        try {
            console.log(data)
            const response = await axios.put(updateMangaUrl, data)
            getMangakas()
            console.log(response.data)
        } catch (e) {
            console.log(e)
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
                    <select {...register("mangaka")}>
                        {/* <option style={{textAlign: 'center'}}>{mangaka}</option> */}
                        {mangakas.map((x) => (
                            <option key={x.id} value={x.id} style={{textAlign: 'center'}} selected={x.author === mangaka}>
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
                {/* <div className="champs" style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <label> Choose another image: </label>
                        <input
                        type="file"
                        style={{height: "3vh"}}
                        />
                    </div>
                    
                    <img src={image} alt="" style={{width: "25vh"}} />
                </div> */}
                <button type="submit">Send</button>
                </form>
            </div>
            </div>
        </div>
    )
}

export default SetManga