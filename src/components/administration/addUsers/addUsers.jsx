import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { MdPerson } from "react-icons/md";
import { MdLock } from "react-icons/md";
import Slide from "react-reveal/Slide";
import { emailRegex } from "../../../consts/RegEx";
import { loadingActions } from "../../../store/loading";
import { toastActions } from "../../../store/notification";
import Firebase from "../../../database/config";
import InputField from "../../../components/common/InputField/InputField";
import BackgroundLogo from "../../../components/common/backgroundLogo/backgroundLogo";
import Footer from "../../../components/common/footer/footer";
import classes from "./addUsers.module.scss";

const AddUsers = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const database = Firebase.firestore();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const userRole = useSelector((state) => state.auth.userRole);
  const teachersMajor = useSelector((state) => state.auth.teachersMajor);
  const [major, setMajor] = useState(teachersMajor.Math);
  const [usersRoleOptions, setUsersRoleOptions] = useState(userRole.students);

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

  const successCreateAccountInformation = (token) => {
    if (usersRoleOptions === "Teachers") {
      database
        .collection("teachersInfo")
        .doc(token)
        .set({
          uid: email,
          userName: name,
          token: token,
          major: major,
        })
        .then(() => {
          dispatch(loadingActions.setIsLoading(false));
          dispatch(
            toastActions.toast({
              type: "success",
              message: "Signup Successfully",
              position: "top",
            })
          );
          history.push("/home");
        });
    }
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
        role: usersRoleOptions,
        token: res.user.uid,
        major: major,
      })
      .then(successCreateAccountInformation(res.user.uid))
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

  const teacherMajorHandler = (event) => {
    setMajor(event.target.value);
  };

  const usersRoleHandler = (event) => {
    setUsersRoleOptions(event.target.value);
  };

  return (
    <>
      <BackgroundLogo title="Add Users" />
      <section className={classes.tableSection}>
        <Slide left>
          <p className={classes.instruction}>Add A New User With Role</p>
        </Slide>
        <form onSubmit={onSignupHandler}>
          <div className={classes.icons}>
            <MdPerson />
          </div>
          <InputField
            onChange={onNameChanged}
            type="text"
            id="userName"
            placeholder="User Name"
            value={name}
            required={true}
          />
          <div className={classes.icons}>
            <MdPerson />
          </div>
          <InputField
            onChange={onEmailChanged}
            type="email"
            placeholder="username@gmail.com"
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
            placeholder="Confirm Password"
            value={confirmPassword}
            errorPasswordMessage={"It should be match password"}
            required={true}
            checkConfirm={password}
            isButtonClicked={isButtonClicked}
            autoComplete="on"
          />
          <select
            required
            className={classes.selectOptions}
            onChange={usersRoleHandler}
            defaultValue={userRole.students}
          >
            <option value={userRole.students}> {userRole.students}</option>
            <option value={userRole.teacher}> {userRole.teacher}</option>
            <option value={userRole.admin}> {userRole.admin}</option>
          </select>

          {usersRoleOptions === "Teachers" && (
            <select
              required
              className={classes.selectOptions}
              onChange={teacherMajorHandler}
              defaultValue={teachersMajor.Math}
            >
              <option value={teachersMajor.Math}> {teachersMajor.Math}</option>
              <option value={teachersMajor.English}>
                {" "}
                {teachersMajor.English}
              </option>
              <option value={teachersMajor.Art}> {teachersMajor.Art}</option>
              <option value={teachersMajor.Piology}>
                {" "}
                {teachersMajor.Piology}
              </option>
              <option value={teachersMajor.Arabic}>
                {" "}
                {teachersMajor.Arabic}
              </option>
            </select>
          )}
          <div className={classes.actions}>
            <button className={classes.signupButton}>Sign Up</button>
          </div>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default AddUsers;
