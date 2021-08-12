import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import PrivateRoute from "private-route-react";
import HomePage from "./pages/home/homePage";
import GuestPage from "./pages/guestPage/guestPage";
import AdminPage from "./pages/admin/adminPage";
import SignupPageForm from "./pages/signUp/signupPageForm";
import SigninPageForm from "./pages/signIn/signinPageForm";
import Teachers from "./pages/teachers/teachers";
import Students from "./pages/students/students";
import StudentClasses from "./components/studentClasses/studentClasses";
// import About from "./pages/about/about";
import Loader from "./components/common/loader/loader";
import MainNavbar from "./components/mainNavbar/mainNavbar";
import NotifiactionBar from "./components/common/notificatioBar/notifiactionBar";
import Users from "./components/administration/usersTable/usersTable";
import AddUsers from "./components/administration/addUsers/addUsers";
import AddStudents from "./components/administration/addStudents/addStudents";
import TeacherClasses from "./components/administration/teacherClasses/teacherClasses";
import Classes from "./components/administration/classes/classes";
import ManageSchedule from "./components/teacherSchedule/manageSchedule/manageSchedule";
import ClassSchedule from "./components/teacherSchedule/classSchedule/classSchedule";
import classes from "./App.module.scss";

const App = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);
  const userRole = useSelector((state) => state.auth.userRole);
  const toastType = useSelector((state) => state.toast.type);
  const toastMessage = useSelector((state) => state.toast.message);
  const toastPosition = useSelector((state) => state.toast.position);
  const usersObject = useSelector((state) => state.auth.userInformation);
  const userInformation = JSON.parse(usersObject ? usersObject : false);

  const isAbleToAccessRouteAdmin = () => {
    if (userInformation && userInformation.role === userRole.admin) return true;
    return false;
  };

  const isAbleToAccessRouteTeacher = () => {
    if (userInformation && userInformation.role === userRole.teacher)
      return true;
    return false;
  };

  const isAbleToAccessRouteStudent = () => {
    if (userInformation && userInformation.role === userRole.students)
      return true;
    return false;
  };

  return (
    <main className={classes.mainContainer}>
      <MainNavbar />
      {!isLoading && (
        <div className={classes.toastContainer}>
          <NotifiactionBar
            type={toastType}
            message={toastMessage}
            position={toastPosition}
          />
        </div>
      )}
      <div className={classes.routsContainer}>
        {isLoading && (
          <div className={classes.loaderContainer}>
            <Loader type="loader" />
          </div>
        )}

        <Switch>
          <PrivateRoute
            path={"/admin"}
            component={AdminPage}
            isAbleToAccessRoute={isAbleToAccessRouteAdmin}
            redirectPath={"/admin"}
          />
          <PrivateRoute
            path={"/usersRole"}
            component={Users}
            isAbleToAccessRoute={isAbleToAccessRouteAdmin}
            redirectPath={"/"}
          />
          <PrivateRoute
            path={"/addStudents"}
            component={AddStudents}
            isAbleToAccessRoute={isAbleToAccessRouteAdmin}
            redirectPath={"/"}
          />
          <PrivateRoute
            path={"/addUser"}
            component={AddUsers}
            isAbleToAccessRoute={isAbleToAccessRouteAdmin}
            redirectPath={"/"}
          />
          <PrivateRoute
            path={"/teacherClasses"}
            component={TeacherClasses}
            isAbleToAccessRoute={isAbleToAccessRouteAdmin}
            redirectPath={"/"}
          />
          <PrivateRoute
            path={"/classes"}
            component={Classes}
            isAbleToAccessRoute={isAbleToAccessRouteAdmin}
            redirectPath={"/"}
          />
          <PrivateRoute
            path={"/teacher"}
            component={Teachers}
            isAbleToAccessRoute={isAbleToAccessRouteTeacher}
            redirectPath={"/teacher"}
          />
          <PrivateRoute
            path={"/manageSchedule"}
            component={ManageSchedule}
            isAbleToAccessRoute={isAbleToAccessRouteTeacher}
            redirectPath={"/"}
          />
          <PrivateRoute
            path={"/classSchedule"}
            component={ClassSchedule}
            isAbleToAccessRoute={isAbleToAccessRouteTeacher}
            redirectPath={"/"}
          />
          <PrivateRoute
            path={"/student"}
            component={Students}
            isAbleToAccessRoute={isAbleToAccessRouteStudent}
            redirectPath={"/student"}
          />
          <PrivateRoute
            path={"/classesTime"}
            component={StudentClasses}
            isAbleToAccessRoute={isAbleToAccessRouteStudent}
            redirectPath={"/"}
          />
          <Route path="/login">
            {userInformation && <Redirect to="/home" />}
            {!userInformation && <SigninPageForm />}
          </Route>
          <Route path="/signup">
            {userInformation && <Redirect to="/home" />}
            {!userInformation && <SignupPageForm />}
          </Route>
          <Route path="/home" exact>
            {userInformation.role === "Teachers" ? (
              <Teachers />
            ) : userInformation.role === "Students" ? (
              <Students />
              ) : userInformation.role === "Guest" ? (
                <GuestPage />
                ) : userInformation.role === "Administration" ? (
              <AdminPage />
              ) : (
                <HomePage />
                )}
          </Route>
          {/* <Route path="/about" >
            <About />
          </Route> */}
          <Route path="*">
            <Redirect to="/home" />
          </Route>
        </Switch>
      </div>
    </main>
  );
};

export default App;
