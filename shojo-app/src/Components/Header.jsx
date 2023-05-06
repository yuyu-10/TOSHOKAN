import { useState, useEffect } from "react"
import '../css/Header.css'
import { useNavigate } from "react-router-dom"
import logo from '../img/logo_TK.png'

export const Header = () => {
    const [title, setTitle] = useState('')
    const navigate = useNavigate()
    const [headerOpacity, setHeaderOpacity] = useState(1)

    useEffect(() => {
      window.addEventListener("scroll", handleScroll)
      return () => {
        window.removeEventListener("scroll", handleScroll)
      }
    }, [])  

    const handleScroll = () => {
      const position = window.scrollY
      if (position > 0) {
        setHeaderOpacity(0.6)
      } else {
        setHeaderOpacity(1)
      }
    }

    const styles = {
      header: {
        width: "100%",
        height: "10vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderBottom: "1px solid rgb(202, 201, 201)",
        boxShadow: "0 5px 5px rgb(231, 230, 230)",
        position: "relative",
        backgroundColor: "#EDDBC7",
        opacity: headerOpacity,
        transition: "opacity 0.3s ease-in-out",
        position: "sticky",
        top: 0,
        marginBottom: "1%"
      }
    }

    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        activateButton()
      }
    };
  
    const activateButton = () => {
      navigate(`/search/${title}`)
    };

    return (
        <div className="header" style={styles.header}>
          <img onClick={() => navigate('/')} src={logo} alt="" />
        <div className="container-recherche">
          <button onClick={() => {navigate('/')}}>See all</button>
          <input type="text" placeholder="Which manga?" value={title} onChange={(event) => setTitle(event.target.value)}  onKeyPress={handleKeyPress}/>
          <button onClick={activateButton}>Search</button>
        </div>
        <button className="add" onClick={() => {navigate('/Post')}}>Add a new manga</button>
      </div>
    )
}