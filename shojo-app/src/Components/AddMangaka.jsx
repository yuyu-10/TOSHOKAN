import { useForm } from "react-hook-form"
import { useState } from "react"
import axios from "axios"
import "../css/Post.css"

export const AddMangaka = () => {
    const { register, handleSubmit } = useForm()
    const [check, setCheck] = useState(null)
    const errorMessage = <div className="error">This mangaka is already in the liste...</div>
    const checkMessage = <div className="ok">Your mangaka has been add to the list, you can check it to the left!</div>

    const onSubmit = (data) => {
        console.log(data)
        const postURL = "http://localhost:3000/addMangaka"
        axios.post(postURL, data)
            .then((response) => verification(response.data))
      }

      const verification = (res) => {
        if (res.message) {
            setCheck(true)
        } else {
          setCheck(false)
        }
      }

    return (
        <div className="post">
            <h1>Add a new mangaka</h1>
            {check === null ? null : check === true ? errorMessage : checkMessage}
            <div className="formulaire">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="champs">
                        <label>Mangaka's name:</label>
                        <input type="text"  {...register("author")} required />
                    </div>
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    )
}