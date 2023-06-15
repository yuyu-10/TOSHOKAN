import { useState, useEffect } from "react"
import React from "react";
import { Manga } from '../Components/Manga'
import '../css/Liste.css'

//Import all request data
import { getAllManga } from "../api/manga"

export const Liste = () => {
  const [mangas, setMangas] = useState([])

  const fetchDataManga = async () => {
      try {
        const mangas = await getAllManga()
        setMangas(mangas)
      } catch (error) {
        console.error("Erreur lors de la récupération des mangas :", error)
      }
    }
  
    useEffect(() => {
      fetchDataManga()
    }, [])

  return (
      <div className="containerHome">
          {mangas.map((x) => 
          <Manga
            id={x.id}
            key={x.id}
            title={x.french_title !== null ? x.french_title : x.romanji_title }
            mangaka={x.author}
            image={x.url}
          />)}
      </div>
  )
}