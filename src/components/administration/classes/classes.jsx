import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadingActions } from "../../../store/loading";
import { toastActions } from "../../../store/notification";
import Firebase from "../../../database/config";
import Table from "../../common/Tables/table";
import BackgroundLogo from "../../common/backgroundLogo/backgroundLogo";
import Footer from "../../common/footer/footer";
import classes from "../teacherClasses/teacherClasses.module.scss";

const Classes = () => {
  const [classesNum, setClasses] = useState([]);
  const [classNumberHandler, setClassNumberHandler] = useState();
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
    return db.collection("users").onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        if (
          classesNum.find((classesNum) => classesNum.token === doc.data().token)
        ) {
          teacherLectures.push({ ...doc.data() });
        }
      });
      setTeacherClasses(teacherLectures);
      dispatch(loadingActions.setIsLoading(false));
    });
  }, [classNumberHandler, classesNum, dispatch]);

  useEffect(() => {
    dispatch(loadingActions.setIsLoading(true));
    const db = Firebase.firestore();
    return db.collection("classes").onSnapshot((snapshot) => {
      const postData = [];
      snapshot.forEach((doc) => {
        if (doc.data().classNumber === classNumberHandler)
          postData.push({ ...doc.data() });
      });
      setClasses(postData);
      dispatch(loadingActions.setIsLoading(false));
    });
  }, [dispatch, classNumberHandler]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Student Name",
        accessor: "userName",
        Cell: ({ cell: { value } }) => value || "-",
      },
      {
        Header: "Email",
        accessor: "uid",
        Cell: ({ cell: { value } }) => value || "-",
      },
    ],
    []
  );

  const onSelectclassNumberHandler = (event) => {
    setClassNumberHandler(event.target.value);
    setViewSheet(event.target.value ? true : false);
  };

  return (
    <>
      <BackgroundLogo title={"Class Students "} />
      <section className={classes.sectionConatainer}>
        <div className={classes.classesTime}>
          <div className={classes.teachers}>
            <div className={classes.labelName}>Class Number</div>
            <select
              required
              className={classes.selectTeachersName}
              onChange={onSelectclassNumberHandler}
            >
              <option></option>
              {["1st", "2nd", "3rd", "4th", "5th"].map((user, index) => {
                return (
                  <option value={user} key={index}>
                    {user}
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

export default Classes;
