import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Manga } from "./Manga";

//Import request data
import { getMangasByTitle } from "../api/manga";

export const SearchByTitle = () => {
  let { uid } = useParams();
  const [mangas, setMangas] = useState("");

  const fetchDataMangas = async () => {
    try {
      const mangas = await getMangasByTitle(uid);
      setMangas(mangas);
      console.log(mangas)
    } catch (error) {
      console.error("Erreur lors de la récupération des mangas :", error);
    }
  };

  useEffect(() => {
    fetchDataMangas();
  }, [uid]);

  if (typeof mangas == "string")
    return (
      <div className="containerHome">
        <h1 style={{ textAlign: "center" }}>
          Sorry, there is no result for '{uid}'...
        </h1>
      </div>
    );
  return (
    <div className="containerHome">
      {mangas.map((x) => (
        <Manga
          id={x.id}
          key={x.id}
          title={x.french_title !== null ? x.french_title : x.romanji_title}
          mangaka={x.author}
          image={x.url}
        />
      ))}
    </div>
  );
};
