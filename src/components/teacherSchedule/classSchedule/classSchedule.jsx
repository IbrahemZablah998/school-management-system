import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../common/Tables/table";
import BackgroundLogo from "../../common/backgroundLogo/backgroundLogo";
import Footer from "../../common/footer/footer";
import { loadingActions } from "../../../store/loading";
import { toastActions } from "../../../store/notification";
import Firebase from "../../../database/config";
import classes from "./classSchedule.module.scss";

const ClassSchedule = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const currentUserRole = useSelector((state) => state.auth.userInformation);
  const userInformation = JSON.parse(currentUserRole ? currentUserRole : false);

  const usersExceptCurrent = users.filter((user) => {
    return user.token === userInformation.token;
  });

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
    return db.collection("teachers").onSnapshot((snapshot) => {
      const postData = [];
      snapshot.forEach((doc) => postData.push({ ...doc.data() }));
      setUsers(postData);
      dispatch(loadingActions.setIsLoading(false));
    });
  }, [dispatch]);

  const columns = useMemo(
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
        Header: "Time From",
        accessor: "timeFrom",
        Cell: ({ cell: { value } }) => value || "-",
      },
      {
        Header: "Time To",
        accessor: "timeTo",
        Cell: ({ cell: { value } }) => value || "-",
      },
    ],
    []
  );

  return (
    <>
      <BackgroundLogo title="Class Schedule" />
      <section className={classes.sectionContainer}>
       
        <div className={classes.headerClassesTime}>
          <Table columns={columns} data={usersExceptCurrent} />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ClassSchedule;
