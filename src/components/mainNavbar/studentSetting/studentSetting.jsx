import React from "react";
import { NavLink } from "react-router-dom";
import classes from "../mainNavbar.module.scss";

const StudentSetting = ({ navLink, userName }) => {
  return (
    <div className={classes.dropdown}>
      <div className={classes[navLink]}>{userName}</div>
      <div className={classes.userSettingsDropDown}>
        <NavLink className={classes[navLink]} to="/classesTime">
          Classes Time
        </NavLink>
        {/* <NavLink className={classes[navLink]} to="/about">
          About
        </NavLink> */}
      </div>
    </div>
  );
};

export default StudentSetting;
