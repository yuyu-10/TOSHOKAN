import { useState } from 'react';
import bandes_blanches from '../img/bandes_blanches.png'
import book from '../img/manga.png'
import { useNavigate } from "react-router-dom"
// import { Zoom } from "react-awesome-reveal";
import '../css/Home.css'

const Home = () => {
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className='backHome'>
            <div className='intro'>
                <p className='titleHome'>TOSHO TO KAN</p>
                <div className='slogan'>
                    <p>Ta library de shojo</p>
                    <p>en un click !</p>
                </div>
                <img className="imageBandes" src={bandes_blanches}/>
                <button
                    className='startButton'
                    style={{
                        transform: isHovered ? "scale(1.2)" : "scale(1)",
                        transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => navigate("/liste")}
                >
                    Entrer
                </button>
            </div>
            <img
                className="book"
                src={book}
                style={{
                    cursor: 'default'
                }}
            />
        </div>
    )
}

export default Home

// <div style={{backgroundColor: "#EDDBC6", height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
//     <Zoom triggerOnce>
//         <img
//             style={{
//             width: "40vh",
//             height: "40vh",
            // transform: isHovered ? "scale(1.2)" : "scale(1)",
            // transition: "transform 0.3s ease"
//             }}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//             onClick={() => navigate("/liste")}
//             src={logo}
//             alt=""
//         />
//     </Zoom>
// </div >