import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReactComponent as IgIcon } from "../assets/icons/ig-fill.svg";
import { ReactComponent as TwitterIcon } from "../assets/icons/twitter.svg";
import { ReactComponent as TiktokIcon } from "../assets/icons/tiktok.svg";
import { ReactComponent as YoutubeIcon } from "../assets/icons/youtube.svg";

const Footer = () => {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center flex-column footer col-md-12">
        <div className="d-flex flex-row justify-content-center space-between">
          <a
            href="https://www.instagram.com/diesnatalispknstan/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="icon-footer">
              <IgIcon />
            </span>
          </a>
          <a
            href="https://twitter.com/diesnatpknstan"
            target="_blank"
            rel="noreferrer"
          >
            <span className="icon-footer">
              <TwitterIcon />
            </span>
          </a>
          <a
            href="https://www.tiktok.com/@diesnatalispknstan"
            target="_blank"
            rel="noreferrer"
          >
            <span className="icon-footer">
              <TiktokIcon />
            </span>
          </a>
          <a
            href="https://www.youtube.com/c/PKNSTANKEMENKEU/videos"
            target="_blank"
            rel="noreferrer"
          >
            <span className="icon-footer">
              <YoutubeIcon />
            </span>
          </a>
        </div>
        &copy; PBS DN VII PKNSTAN
      </div>
    </>
  );
};

export default Footer;
