import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import Slide from "react-reveal/Slide";
import Firebase from "../../../database/config";
import BackgroundLogo from "../../common/backgroundLogo/backgroundLogo";
import Footer from "../../common/footer/footer";
import { loadingActions } from "../../../store/loading";
import { toastActions } from "../../../store/notification";
import classes from "./addStudents.module.scss";

const AddStudents = () => {
  const database = Firebase.firestore();
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState();
  const [classNumber, setClassNumber] = useState();
  const dispatch = useDispatch();

  const successAddingStudent = () => {
    dispatch(loadingActions.setIsLoading(false));
    dispatch(
      toastActions.toast({
        type: "success",
        message: "Add student classroom Successfully",
        position: "top",
      })
    );
  };

  const errorAddingStudent = (error) => {
    dispatch(loadingActions.setIsLoading(false));
    dispatch(
      toastActions.toast({
        type: "failure",
        message: error,
        position: "top",
      })
    );
  };

  const onAddingStudentsToClasses = (event) => {
    event.preventDefault();
    dispatch(loadingActions.setIsLoading(true));
    if (studentName && classNumber) {
      database
        .collection("classes")
        .doc(studentName.value)
        .set({
          studentName: studentName.label,
          classNumber: classNumber.label,
        })
        .then(successAddingStudent)
        .catch(errorAddingStudent);
    }
  };

  useEffect(() => {
    const db = Firebase.firestore();
    return db.collection("users").onSnapshot((snapshot) => {
      const postData = [];
      snapshot.forEach((doc) => {
        if (doc.data().role === "Students") {
          postData.push(doc.data());
        }
      });
      setStudents(postData);
    });
  }, []);

  const options = students.map((student) => {
    return { value: student.token, label: student.userName };
  });

  return (
    <>
      <BackgroundLogo title={"Add Students To Classes"} />
      <section className={classes.sectionContainer}>
        <Slide left>
          <p className={classes.instruction}>Adding Students To Classes</p>
        </Slide>
        <form onSubmit={onAddingStudentsToClasses}>
          <Select
            className={classes.selectStudentsClasses}
            onChange={(state) => setStudentName(state)}
            options={options}
            placeholder={"Students Name"}
            required
          />
          <Select
            className={classes.selectStudentsClasses}
            onChange={(state) => setClassNumber(state)}
            options={[
              { value: "1st", label: "1st" },
              { value: "2st", label: "2st" },
              { value: "3st", label: "3st" },
              { value: "4st", label: "4st" },
            ]}
            placeholder={"Classes Name"}
            required
          />
          <div className={classes.actionsContainerAddingStudents}>
            <button className={classes.addingStudentsToClasses}>
              Add Student
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default AddStudents;
