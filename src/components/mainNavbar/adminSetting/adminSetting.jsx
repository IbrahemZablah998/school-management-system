import React from "react";
import { NavLink } from "react-router-dom";
import classes from "../mainNavbar.module.scss";

const AdminSetting = ({ navLink, userName }) => {
  return (
    <div className={classes.dropdown}>
      <div className={classes[navLink]}>{userName}</div>
      <div className={classes.userSettingsDropDown}>
        <NavLink className={classes[navLink]} to="/addUser">
          Add Users
        </NavLink>
        <NavLink className={classes[navLink]} to="/usersRole">
          User Role
        </NavLink>
        <NavLink className={classes[navLink]} to="/classes">
          Classes
        </NavLink>
        <NavLink className={classes[navLink]} to="/addStudents">
          Add Students
        </NavLink>
        <NavLink className={classes[navLink]} to="/teacherClasses">
          Teacher Classes
        </NavLink>
        {/* <NavLink className={classes[navLink]} to="/about">
          About
        </NavLink> */}
      </div>
    </div>
  );
};

export default AdminSetting;
