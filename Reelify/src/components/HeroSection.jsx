import "../styles/HeroSection.css"
import banner from "../assets/banner.webp"
import { useNavigate } from "react-router-dom"

export default function HeroSection(){
const navigate = useNavigate();

    function HandleClick(){
        navigate("/image-to-video")
    }
    return(
        <section className="homepage-container">
            <h1 className="heading">REELIFY</h1>
            <div className="banner-card">
                <div className="homepage-introtext">
                <h2 className="title">Turn One Photo into a 10-Second Video</h2>
                <p className="introduction">Easily convert your photos into beautiful videos in seconds. No editing skills needed — just
                 upload your images, and download your share-ready video!</p>
                 <button className="button-converter" onClick={HandleClick}>CONVERT IMAGE TO VIDEO</button>
                 </div>
                <img className="banner-image" src={banner}/>
            </div>
        </section>
    )
}