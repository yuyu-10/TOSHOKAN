import { useForm } from "react-hook-form"
import { useState } from "react"
import axios from "axios"
import "../css/Post.css"

export const AddMangaka = ({newMangaka}) => {
    const { register, handleSubmit } = useForm()
    const [check, setCheck] = useState(null)
    const errorMessage = <div className="error">Ce mangaka est déjà dans la liste...</div>
    const checkMessage = <div className="ok">Le mangaka a été ajouté, check dans la lsite à guache!</div>

    const onSubmit = (data) => {
        console.log(data)
        const postURL = "http://localhost:3000/addMangaka"
        axios.post(postURL, data)
            .then((response) => verification(response.data))
            .then(() => handleAddMangaka())
      }

      const handleAddMangaka = () => {
        newMangaka()
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
            <h1>Ajouté un nouveau mangaka</h1>
            <div className="formulaire">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="champs">
                        <label>Nom du magaka:</label>
                        <input type="text"  {...register("author")} required />
                    </div>
                    <button type="submit">Envoyé</button>
                </form>
            </div>
            {check === null ? null : check === true ? errorMessage : checkMessage}
        </div>
    )
}