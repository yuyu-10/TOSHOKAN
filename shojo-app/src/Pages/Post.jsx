import "../css/Post.css"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AddMangaka } from "../Components/AddMangaka"

const Post = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const [mangakas, setMangakas] = useState([])
  const [check, setCheck] = useState(false)
  const [file, setFile] = useState(null)
  const errorMessage = <div className="error">This manga is already in the list...</div>

  

  const onSubmit = async (data) => {
    const postURL = "http://localhost:3000/addManga"
    try {
      const response = await axios.post(postURL, data)
      verification(response.data, data.title)
    } catch (error) {
      console.log(error)
    }
  }

  const verification = (res, title) => {
    if (res === 'Le titre existe déjà') {
      setCheck(true)
    } else {
      uploadImage(title)
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
    const setImageUrl = "http://localhost:3000/addImage"
    try {
      const response = await axios.put(setImageUrl, {'title': title, 'url': url})
      console.log(response.data)
      navigate('/Check')
    } catch (error) {
      console.log(error)
    }
  }
  
  
  const getMangakas = async () => {
    const getURL = "http://localhost:3000/getMangakas"
    const response = await axios.get(getURL)
    setMangakas(response.data)
  }
  
  useEffect(() => {
    getMangakas()
  }, [])

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  return (
    <div className="conatiner-add">
      <div className="post">
          <h1>Add a new manga</h1>
        <div className="formulaire">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="champs">
              <label> Title: </label>
              <input
                type="text"
                placeholder="Title..."
                {...register("title")}
                required
              />
            </div>
            <div className="champs">
              <label> Year of publication: </label>
              <input
                type="text"
                placeholder="Year..."
                {...register("year")}
                required
              />
            </div>
            <div className="champs">
              <label> Resume: </label>
              <input
                type="text"
                {...register("resume")}
                required
                maxLength={500}
                style={{height: '10vh', textAlign: 'start', whiteSpace: 'nowrap', overflow: 'hidden'}}
              />
            </div>
            <div className="champs">
              <label> Mangaka: </label>
              <select {...register("mangaka")}>
                {mangakas.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.author}
                  </option>
                ))}
              </select>
            </div>
            <div className="champs">
              <label> Choose an image: </label>
              <input
                onChange={handleFileChange}
                type="file"
                style={{height: "3vh"}}
                required
              />
            </div>
            <button type="submit">Send</button>
          </form>
        </div>
          {check ? errorMessage : null}
      </div>

      <AddMangaka newMangaka={() => getMangakas()}/>

    </div>
  )
}

export default Post