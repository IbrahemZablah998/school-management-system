import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Firebase from "../../database/config";
import { loadingActions } from "../../store/loading";
import Table from "../../components/common/Tables/table";
import BackgroundLogo from "../../components/common/backgroundLogo/backgroundLogo";
import Footer from "../../components/common/footer/footer";
import classes from "./studentsPage.module.scss";

const Students = () => {
  const usersObject = useSelector((state) => state.auth.userInformation);
  const userInformation = JSON.parse(usersObject ? usersObject : false);
  const [information, setInformations] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingActions.setIsLoading(true));
    const db = Firebase.firestore();
    async function fetchData() {
      const postData = [];
      const getRequestTeachersInfo = await db.collection("teachersInfo");
      const getRequestTeachers = await db.collection("teachers");

      await db
        .collection("classes")
        .doc(userInformation.token)
        .get()
        .then((classes) => {
          getRequestTeachers
            .where("class", "==", classes.data().classNumber)
            .get()
            .then((teachersClasses) => {
              teachersClasses.forEach((teachersClass) => {
                getRequestTeachersInfo.onSnapshot((teachersInfo) => {
                  teachersInfo.forEach((teacherInfo) => {
                    if (
                      teacherInfo.data().token === teachersClass.data().token
                    ) {
                      postData.push(
                        Object.assign(teacherInfo.data(), teachersClass.data())
                      );
                    }
                  });
                });
              });
            });
        });
      setInformations(postData);
      dispatch(loadingActions.setIsLoading(false));
    }
    fetchData();
  }, [dispatch, userInformation.token]);

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
      {
        Header: "Teacher Name",
        accessor: "userName",
        Cell: ({ cell: { value } }) => value || "-",
      },
      {
        Header: "Major Teacher",
        accessor: "major",
        Cell: ({ cell: { value } }) => value || "-",
      },
    ],
    []
  );

  return (
    <>
      <BackgroundLogo title="Students Classes Time" />
      <section className={classes.sectionContainer}>
        <div className={classes.headerInformation}>
          <Table columns={columns} data={information} />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Students;
