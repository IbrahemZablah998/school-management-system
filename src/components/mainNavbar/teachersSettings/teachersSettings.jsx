import React from "react";
import { NavLink } from "react-router-dom";
import classes from "../mainNavbar.module.scss";

const TeachersSettings = ({ navLink, userName }) => {
  return (
    <div className={classes.dropdown}>
      <div className={classes[navLink]}>{userName}</div>
      <div className={classes.userSettingsDropDown}>
        <NavLink className={classes[navLink]} to="/manageSchedule">
          Manage Schedule
        </NavLink>
        <NavLink className={classes[navLink]} to="/classSchedule">
          Class Schedule
        </NavLink>
        {/* <NavLink className={classes[navLink]} to="/about">
          About
        </NavLink> */}
        
      </div>
    </div>
  );
};

export default TeachersSettings;
