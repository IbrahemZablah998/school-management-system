import React from "react";
import { useSelector } from "react-redux";
import admin from "../../images/admin.jpg";
import BackgroundLogo from "../../components/common/backgroundLogo/backgroundLogo";
import Footer from "../../components/common/footer/footer";
import classes from "./adminPage.module.scss";

const AdminPage = () => {
  const usersObject = useSelector((state) => state.auth.userInformation);
  const userInformation = JSON.parse(usersObject ? usersObject : false);
  const adminName =
    userInformation.userName?.charAt(0).toUpperCase() +
    userInformation.userName?.slice(1);
  const adminEmail = userInformation.uid;

  return (
    <div>
      <BackgroundLogo title={"Welcome " + adminName} major={adminEmail} />
      <div className={classes.sectionContainer}>
        <img
          src={admin}
          alt="Logo Admin Page"
          className={classes.imageAdmin}
        />
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
