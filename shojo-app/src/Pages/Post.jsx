import "../css/Post.css";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AddMangaka } from "../Components/AddMangaka";

//Import all request data
import { getMangakas } from "../api/mangaka";

const Post = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [mangakas, setMangakas] = useState([]);
  const [check, setCheck] = useState(false);
  const [file, setFile] = useState(null);
  const errorMessage = (
    <div className="error">This manga is already in the list...</div>
  );

  const onSubmit = async (data) => {
    const postURL = "http://localhost:3000/addManga";
    try {
      console.log(data);
      const response = await axios.post(postURL, data);
      verification(response.data, data.romanji_title);
    } catch (error) {
      console.log(error);
    }
  };

  const verification = (res, title) => {
    if (res === "Le titre existe déjà") {
      setCheck(true);
    } else {
      uploadImage(title);
    }
  };

  const uploadImage = async (title) => {
    const formData = new FormData();
    formData.append("romanji_title", title);
    formData.append("image", file);
    const uploadUrl = "http://localhost:3000/upload";
    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      updateImage(response, title);
    } catch (error) {
      console.log(error);
    }
  };

  const updateImage = async (response, title) => {
    const url = response.data[0].secure_url;
    const publicId = response.data[0].public_id;
    const setImageUrl = "http://localhost:3000/addImage";
    try {
      const response = await axios.put(setImageUrl, {
        romanji_title: title,
        url: url,
        publicId: publicId,
      });
      console.log(response.data);
      navigate("/Check");
    } catch (error) {
      console.log(error);
    }
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="conatiner-add">
      <div className="post">
        <h1>Add a new manga</h1>
        <div className="formulaire">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="champs">
              <label> Titre original: </label>
              <input
                type="text"
                placeholder="Titre orignal..."
                {...register("original_title")}
                required
              />
          </div>
          <div className="champs">
              <label> Titre romanji: </label>
              <input
                type="text"
                placeholder="Titre romanji..."
                {...register("romanji_title")}
                required              
              />
          </div>
          <div className="champs">
              <label> Titre francais: </label>
              <input
              type="text"
              placeholder="Titre francais..."
              {...register("french_title")}
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
              <textarea
                type="text"
                {...register("resume")}
                required
                maxLength={700}
              />
            </div>
            <div className="champs">
              <label> Mangaka: </label>
              <select className="addMangakaSelect" {...register("mangaka")}>
                <option style={{ textAlign: "center" }}>
                  --SELECT A MANGAKA--
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
              </select>
            </div>
            <div className="champs">
              <label> Animation: </label>
              <select {...register("animation")}>
                <option style={{ textAlign: "center" }}>no</option>
                <option style={{ textAlign: "center" }}>yes</option>
              </select>
            </div>
            <div className="champs">
              <label> Choose an image: </label>
              <input
                onChange={handleFileChange}
                type="file"
                style={{ height: "3vh" }}
                required
              />
            </div>
            <button type="submit">Send</button>
          </form>
        </div>
        {check ? errorMessage : null}
      </div>

      <AddMangaka newMangaka={() => fetchDataMangakas()} />
    </div>
  );
};

export default Post;
