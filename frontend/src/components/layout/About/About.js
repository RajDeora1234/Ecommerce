import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import founderImage from "../../../images/owner.JPG";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/raj_deora_rd/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src={founderImage}
              alt="Founder"
            />
            <Typography>Rajesh Deora</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a sample wesbite made by @RajeshDeora. Only with the
              purpose to learn MERN Stack
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.youtube.com"
              target="blank"
            >
              <YouTubeIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://www.instagram.com/raj_deora_rd/" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
