// import { useSearchParams } from 'react-router-dom'
import "../css/Post.css"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AddMangaka } from "../Components/AddMangaka"

const Post = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const [mangakas, setMangakas] = useState("")
  const [check, setCheck] = useState(false)
  const errorMessage = <div className="error">This manga is already in the list...</div>

  useEffect(() => {
    getMangakas()
  }, [mangakas])

  const onSubmit = (data) => {
    console.log(data)
    const postURL = "http://localhost:3000/addManga"
    axios.post(postURL, data)
        .then((response) => verification(response.data))
  }

  const verification = (res) => {
    if (res.message) {
        setCheck(true)
    } else {
      navigate('/Check')
    }
  }

  const getMangakas = async () => {
    const getURL = "http://localhost:3000/getMangakas"
    const response = await axios.get(getURL)
    setMangakas(response.data)
  }

  if (!mangakas) return null
  return (
    <div className="conatiner-add">
      <div className="post">
          <h1>Add a new manga</h1>
          {check ? errorMessage : null}
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
                type="file"
                style={{height: "3vh"}}
                required
              />
            </div>
            {/* <div className="file-input">
              <label htmlFor="file-upload">Choose a file:</label>
              <input type="file" id="file-upload" name="file-upload" className="input-file"/>
          </div> */}
            <button type="submit">Send</button>
          </form>
        </div>
      </div>

      <AddMangaka />

    </div>
  )
}

export default Post