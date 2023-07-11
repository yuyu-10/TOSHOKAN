import { useState, useEffect } from "react";
import "../css/Header.css";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo_TK.png";
import { Button, Select } from 'antd';

//Import all request data
import { getMangakas } from "../api/mangaka";

export const Header = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [headerOpacity, setHeaderOpacity] = useState(0.95);
  const [mangakas, setMangakas] = useState([]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const position = window.scrollY;
    if (position > 0) {
      setHeaderOpacity(0.6);
    } else {
      setHeaderOpacity(1);
    }
  };

  const styles = {
    header: {
      width: "100%",
      height: "10vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderBottom: "1px solid rgb(202, 201, 201)",
      boxShadow: "0 2px 2px rgb(231, 230, 230)",
      backgroundColor: "#C49D83",
      opacity: headerOpacity,
      transition: "opacity 0.3s ease-in-out",
      position: "sticky",
      top: 0,
      zIndex: 1
    },
  };

  const fetchDataMangakas = async () => {
    try {
      const mangakas = await getMangakas();
      setMangakas(mangakas);
    } catch (error) {
      console.error("Erreur lors de la récupération des mangakas :", error);
    }
  };

  useEffect(() => {
    fetchDataMangakas();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      activateButton();
    }
  };

  const activateButton = () => {
    navigate(`/searchTitle/${title}`);
  };

  return (
    <div className="header" style={styles.header}>
      <img onClick={() => navigate("/")} src={logo} alt="" />
      <div className="container-recherche">
      <Button           
        onClick={() => {
          navigate("/liste");
        }}
        style={{backgroundColor: '#f9f9f0', color: 'black'}}
        type="primary">
          Voir tous les mangas
      </Button>
        <input
          type="text"
          placeholder="Quel manga cherches tu ?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        {/* <button onClick={activateButton}>Search</button> */}

        <Select
          placeholder="Je veux voir les mangas de: "
          style={{ marginLeft: "1vh", width: "30vh", textAlign: 'center' }}
        >
          <option
          value={null}
          style={{ textAlign: "center" }}
          >
            Je veux voir les mangas de:
          </option>
          {mangakas.map((x) => (
            <option
              key={x.mangaka_id}
              value={x.mangaka_id}
              style={{ textAlign: "center" }}
            >
              {x.author}
            </option>
          ))}
        </Select>
      </div>
      <Button   
        className="add"        
        onClick={() => {
          navigate("/post");
        }}
        style={{backgroundColor: '#f9f9f0', color: 'black'}}
        type="primary">
          Ajouter un nouveau manga/mangaka
      </Button>
    </div>
  );
};
