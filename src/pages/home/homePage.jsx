import React from 'react';
import { useSelector } from "react-redux";
import Loader from "../../components/common/loader/loader";
import classes from "./homePage.module.scss";

const HomePage = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  return (
    <div>
      {isLoading && (
        <div className={classes.loaderContainer}>
          <Loader type="loader" />
        </div>
      )}
      <section className={classes.homeBanner}></section>
    </div>
  );
};

export default HomePage;
