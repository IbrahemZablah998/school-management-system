import React from "react";
import { useSelector } from "react-redux";
import teachers from "../../images/teacher.png";
import BackgroundLogo from "../../components/common/backgroundLogo/backgroundLogo";
import Footer from "../../components/common/footer/footer";
import classes from "./teachersPage.module.scss";

const Teachers = () => {
  const usersObject = useSelector((state) => state.auth.userInformation);
  const userInformation = JSON.parse(usersObject ? usersObject : false);
  const teacherName =
    userInformation.userName.charAt(0).toUpperCase() +
    userInformation.userName.slice(1);
  const teacherMajor = userInformation.major;

  return (
    <div>
      <BackgroundLogo
        title={"Hello teacher " + teacherName}
        major={teacherMajor}
      />
      <div className={classes.sectionContainer}>
        <img
          src={teachers}
          alt="Logo Teacher Page"
          className={classes.imageTeacher}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Teachers;
