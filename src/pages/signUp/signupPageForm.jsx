import React, { useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MdPerson } from "react-icons/md";
import { MdLock } from "react-icons/md";
import Slide from "react-reveal/Slide";
import { emailRegex } from "../../consts/RegEx";
import { loadingActions } from "../../store/loading";
import { toastActions } from "../../store/notification";
import Firebase from "../../database/config";
import InputField from "../../components/common/InputField/InputField";
import BackgroundLogo from "../../components/common/backgroundLogo/backgroundLogo.jsx";
import Footer from "../../components/common/footer/footer";
import classes from "./signupPageForm.module.scss";

const SignupPageForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const database = Firebase.firestore();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const errorCreateAccount = (error) => {
    dispatch(loadingActions.setIsLoading(false));
    dispatch(
      toastActions.toast({
        type: "failure",
        message: error.message,
        position: "top",
      })
    );
  };

  const successCreateAccountInformation = () => {
    dispatch(loadingActions.setIsLoading(false));
    dispatch(
      toastActions.toast({
        type: "success",
        message: "Signup Successfully",
        position: "top",
      })
    );
    history.push("/home");
  };

  const errorCreateAccountInformation = (error) => {
    dispatch(
      toastActions.toast({
        type: "failure",
        message: error.message,
        position: "top",
      })
    );
  };

  const createAccount = (res) => {
    database
      .collection("users")
      .doc(res.user.uid)
      .set({
        uid: email,
        userName: name,
        role: "",
        token: res.user.uid,
      })
      .then(successCreateAccountInformation)
      .catch(errorCreateAccountInformation);
  };

  const onSignupHandler = (event) => {
    event.preventDefault();
    setIsButtonClicked(true);
    if (password === confirmPassword) {
      dispatch(loadingActions.setIsLoading(true));
      Firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(createAccount)
        .catch(errorCreateAccount);
    }
  };

  const onEmailChanged = (event) => {
    setEmail(event.target.value);
  };

  const onPasswordChanged = (event) => {
    setPassword(event.target.value);
  };

  const onConfirmPasswordChanged = (event) => {
    setConfirmPassword(event.target.value);
  };

  const onNameChanged = (event) => {
    setName(event.target.value);
  };

  return (
    <>
      <BackgroundLogo title="WIX School " />
      <section className={classes.singupPageSection}>
        <Slide left>
          <p className={classes.instruction}>
            Create an account by registering your information
          </p>
        </Slide>
        <form onSubmit={onSignupHandler}>
          <div className={classes.icons}>
            <MdPerson />
          </div>
          <InputField
            onChange={onNameChanged}
            type="text"
            id="userName"
            placeholder="User name"
            value={name}
            required={true}
          />
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
            id="pasword"
            placeholder="Password"
            value={password}
            required={true}
            autoComplete="on"
          />
          <div className={classes.icons}>
            <MdLock />
          </div>
          <InputField
            onChange={onConfirmPasswordChanged}
            type="password"
            id="confirmPassword"
            placeholder="ConfirmPassword"
            value={confirmPassword}
            errorPasswordMessage={"It should be match password"}
            required={true}
            checkConfirm={password}
            isButtonClicked={isButtonClicked}
            autoComplete="on"
          />
          <div className={classes.actions}>
            <button className={classes.signupButton}>Sign Up</button>
          </div>
        </form>
        <NavLink className={classes.loginForward} to="/login">
          Have an account?
        </NavLink>
      </section>
      <Footer />
    </>
  );
};

export default SignupPageForm;
