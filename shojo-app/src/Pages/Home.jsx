import { useState } from 'react';
import logo from '../img/logo_TK.png'
import { useNavigate } from "react-router-dom"
import { Zoom } from "react-awesome-reveal";
import '../css/Home.css'

const Home = () => {
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={{backgroundColor: "#EDDBC6", height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Zoom triggerOnce>
                <img
                    style={{
                    width: "40vh",
                    height: "40vh",
                    transform: isHovered ? "scale(1.2)" : "scale(1)",
                    transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => navigate("/liste")}
                    src={logo}
                    alt=""
                />
            </Zoom>
        </div >
    )
}

export default Home