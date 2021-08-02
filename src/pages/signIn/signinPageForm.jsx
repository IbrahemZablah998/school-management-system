import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { MdPerson } from "react-icons/md";
import { MdLock } from "react-icons/md";
import Slide from 'react-reveal/Slide';
import { emailRegex } from "../../consts/RegEx";
import { authActions } from "../../store/auth";
import { loadingActions } from "../../store/loading";
import { toastActions } from "../../store/notification";
import Firebase from "../../database/config";
import InputField from "../../components/common/InputField/InputField";
import BackgroundLogo from "../../components/common/backgroundLogo/backgroundLogo.jsx";
import Footer from "../../components/common/footer/footer";
import classes from "./signinPageForm.module.scss";

const SigninForm = () => {
  const database = Firebase.firestore();
  const history = useHistory();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const userRole = useSelector((state) => state.auth.userRole);

  const onEmailChanged = (event) => {
    setEmail(event.target.value);
  };

  const onPasswordChanged = (event) => {
    setPassword(event.target.value);
  };

  const errorLogin = (error) => {
    dispatch(
      toastActions.toast({
        type: "failure",
        message: error.message,
        position: "top",
      })
    );
    dispatch(loadingActions.setIsLoading(false));
  };

  const successLogin = (res) => {
    dispatch(
      toastActions.toast({
        type: "success",
        message: "LogIn Successfully",
        position: "top",
      })
    );
    database
      .collection("users")
      .doc(res.user.uid)
      .get()
      .then((doc) => {
        dispatch(authActions.login(doc.data()));
        dispatch(loadingActions.setIsLoading(false));
        switch (doc.data().role) {
          case userRole.admin:
            history.push("/admin");
            break;
          case userRole.teacher:
            history.push("/teacher");
            break;
          case userRole.students:
            history.push("/student");
            break;
          default:
            history.push("/home");
            break;
        }
      });
  };

  const onSigninHandler = (event) => {
    event.preventDefault();
    dispatch(loadingActions.setIsLoading(true));
    setIsButtonClicked(true);
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(successLogin)
      .catch(errorLogin);
  };

  return (
    <>
      <BackgroundLogo title="WIX School" />
      <section className={classes.singInPageSection}>
        <Slide left>
          <p className={classes.instruction}>Log in using your email address</p>
        </Slide>
        <form onSubmit={onSigninHandler}>
          <div className={classes.icons}>
            <MdPerson />
          </div>
          <InputField
            onChange={onEmailChanged}
            type="email"
            placeholder="UserName@gmail.com"
            valdationRegex={emailRegex}
            value={email}
            errorEmailMessage={"It should be an e-mail"}
            required={true}
            isButtonClicked={isButtonClicked}
          />
          <div className={classes.icons}>
            <MdLock />
          </div>
          <InputField
            onChange={onPasswordChanged}
            type="password"
            placeholder="Password"
            value={password}
            required={true}
            autoComplete="on"
          />
          <div className={classes.actions}>
            <button className={classes.signinButton}>Login</button>
          </div>
        </form>
        <a className={classes.forgetPassword} href="/resetPassword">
          Forgotten your password?
        </a>
      </section>
      <Footer />
    </>
  );
};

export default SigninForm;
