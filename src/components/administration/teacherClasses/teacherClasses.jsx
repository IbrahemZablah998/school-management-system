import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadingActions } from "../../../store/loading";
import { toastActions } from "../../../store/notification";
import Firebase from "../../../database/config";
import Table from "../../common/Tables/table";
import BackgroundLogo from "../../common/backgroundLogo/backgroundLogo";
import Footer from "../../common/footer/footer";
import classes from "./teacherClasses.module.scss";

const TeacherClasses = () => {
  const [teachers, setTeachers] = useState([]);
  const [teacherNameHandler, setTeacherNameHandler] = useState();
  const [viewSheet, setViewSheet] = useState(false);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const dispatch = useDispatch();

  dispatch(
    toastActions.toast({
      type: "",
      message: "",
      position: "",
    })
  );

  useEffect(() => {
    dispatch(loadingActions.setIsLoading(true));
    const db = Firebase.firestore();
    const teacherLectures = [];
    return db.collection("teachers").onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        if (
          doc.data().token ===
          teachers.find(
            (teacherName) => teacherName.userName === teacherNameHandler
          )?.token
        ) {
          teacherLectures.push({ ...doc.data() });
        }
      });
      setTeacherClasses(teacherLectures);
      dispatch(loadingActions.setIsLoading(false));
    });
  }, [teacherNameHandler, teachers, dispatch]);

  useEffect(() => {
    dispatch(loadingActions.setIsLoading(true));
    const db = Firebase.firestore();
    return db.collection("teachersInfo").onSnapshot((snapshot) => {
      const postData = [];
      snapshot.forEach((doc) => {
        postData.push({ ...doc.data() });
      });
      setTeachers(postData);
      dispatch(loadingActions.setIsLoading(false));
    });
  }, [dispatch]);

  const columns = React.useMemo(
    () => [
      {
        Header: "ClassRoom",
        accessor: "class",
        Cell: ({ cell: { value } }) => value || "-",
      },
      {
        Header: "Days",
        accessor: "day",
        Cell: ({ cell: { value } }) => value || "-",
      },
      {
        Header: "Start it time",
        accessor: "timeFrom",
        Cell: ({ cell: { value } }) => value || "-",
      },
      {
        Header: "End it time",
        accessor: "timeTo",
        Cell: ({ cell: { value } }) => value || "-",
      },
    ],
    []
  );

  const onSelectTeacherNameHandler = (event) => {
    setTeacherNameHandler(event.target.value);
    setViewSheet(event.target.value ? true : false);
  };

  return (
    <>
      {teacherNameHandler ? (
        <BackgroundLogo
          title={
            "Teacher Email: " +
            teachers.find(
              (teacherInfo) => teacherInfo.userName === teacherNameHandler
            )?.uid
          }
          major={
            "Major: " +
            teachers.find(
              (teacherInfo) => teacherInfo.userName === teacherNameHandler
            )?.major
          }
        />
      ) : (
        <BackgroundLogo title={"Teacher Classes Time "} />
      )}
      <section className={classes.sectionConatainer}>
        <div className={classes.classesTime}>
          <div className={classes.teachers}>
            <div className={classes.labelName}>Teacher Name</div>
            <select
              required
              className={classes.selectTeachersName}
              onChange={onSelectTeacherNameHandler}
            >
              <option></option>
              {teachers.map((user, index) => {
                return (
                  <option value={user.userName} key={index}>
                    {user.userName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        {viewSheet && (
          <div className={classes.headerClassesTime}>
            <Table columns={columns} data={teacherClasses} />
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default TeacherClasses;
