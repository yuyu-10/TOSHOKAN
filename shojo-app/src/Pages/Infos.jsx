import '../css/Infos.css'
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios"
import set from "../img/update.png"
import { useNavigate } from "react-router-dom";

const Infos = () => {
    const navigate = useNavigate()

    const {uid} = useParams()
    const getURL = `http://localhost:3000/getOneById/${uid}`
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [resume, setResume] = useState('')
    const [mangaka, setMangaka] = useState('')
    const [image, setImage] = useState('')
    const [animation, setAnimation] = useState("Don't know")


    
    useEffect(() => {
        const getData = async() => {
            const response = await axios.get(getURL)
            console.log(response.data)
            setTitle(response.data[0].title)
            setDate(response.data[0].year_of_publication)
            setResume(response.data[0].resume)
            setMangaka(response.data[0].author)
            setImage(response.data[0].url)

            if (response.data[0].animation === true) {
                setAnimation('Yes')
            }else if (response.data[0].animation === false) {
                setAnimation('No')
            }
        }
        getData()
    }, [getURL])
    
    if (!title || !date || !resume || !mangaka || !image || !animation) return null
    return (
        <div className="infos">
            <div className="title">
                <h1>{title}</h1>
                <img alt='' src={set} style={{position: 'absolute', right: 1, top: 1}} onClick={() => navigate(`/SetManga/${uid}`)}></img>
            </div>
            <div className='image'>
                <img src={image} alt="" />
            </div>

            <div className='informations'>
                <div className="plus">
                    <div className='step'>
                        <p>Mangaka: </p> <p>{mangaka}</p>
                    </div>

                    <div className='step'>
                        <p>Year: </p> <p>{date}</p>
                    </div>

                    <div className='step'>
                        <p>Animation: </p> <p>{animation}</p>
                    </div>
                </div>

                <div className="resume">
                    <p>RESUME: </p><h3>{resume}</h3>
                </div>
            </div>
        </div>
    )
}

export default Infos