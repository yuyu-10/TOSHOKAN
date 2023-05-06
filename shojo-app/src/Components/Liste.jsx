import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { Manga } from '../Components/Manga'
import '../css/Home.css'

export const Liste = () => {
    const getURL = 'http://localhost:3000/getAll'
    const [mangas, setMangas] = useState([])

    useEffect(() => {
        const choperLaData = async() => {
            const response =  await axios.get(getURL);
                setMangas(response.data);
            }
        choperLaData()
    },[]);

    return (
        <div className="containerHome">
            {mangas.map((x) => <Manga id={x.id} key={x.id} title={x.title} mangaka={x.author} image={x.image}/>)}
        </div>
    )
}