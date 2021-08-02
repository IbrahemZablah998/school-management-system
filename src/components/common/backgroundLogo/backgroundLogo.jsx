import React from "react";
import Slide from "react-reveal/Slide";
import schoolLogo from "../../../images/schoolLogo.jpg";
import classes from "./backgroundLogo.module.scss";

const BackgroundLogo = ({ title, major }) => {
  return (
    <>
      <div className={classes.banner}>
        <Slide left>
          <img
            className={classes.schoolLogo}
            src={schoolLogo}
            alt="School Logo"
          />
        </Slide>
      </div>
      <div className={classes.sectionInformation}>
        <p>{title}</p>
        <p> {major}</p>
      </div>
    </>
  );
};

export default BackgroundLogo;
