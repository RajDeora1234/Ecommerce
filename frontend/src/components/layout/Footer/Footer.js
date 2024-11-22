import React from 'react';
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
    return (
        <footer id='footer'>
            <div className='leftFooter'>
                <h4>DOWNLOAD OUR AP4</h4>
                <p>Download App for Android and IOS mobile phone </p>
                <img src={playStore} alt="playStore" />
                <img src={appStore} alt="appStore" />
            </div>
            <div className='midFooter'>
                <h1>6PP.</h1>
                <p>High quality is our first priority</p>
                <p>Copyrights 2024 &copy; MeRajDeora</p>
            </div>
            <div className='rightFooter'>
                <h4>Follow Us</h4>
                <a href="https://www.instagram.com/raj_deora_rd/">Instagram</a>
                <a href="https://www.youtube.com/">Youtub</a>
                <a href="https://www.facebook.com/raj.deora.5243/">Facebook</a>
            </div>

        </footer>
    )
}

export default Footer
