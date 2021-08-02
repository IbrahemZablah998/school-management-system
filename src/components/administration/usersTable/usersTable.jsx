import React, { useEffect, useMemo, useState, useCallback } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { loadingActions } from "../../../store/loading";
import { toastActions } from "../../../store/notification";
import Firebase from "../../../database/config";
import Table from "../../common/Tables/table";
import BackgroundLogo from "../../common/backgroundLogo/backgroundLogo.jsx";
import Footer from "../../common/footer/footer";
import classes from "./usersTable.module.scss";

const Users = () => {
  const [users, setUsers] = useState([]);
  const userRole = useSelector((state) => state.auth.userRole);
  const teachersMajor = useSelector((state) => state.auth.teachersMajor);
  const dispatch = useDispatch();
  const currentUserRole = useSelector((state) => state.auth.userInformation);
  const userInformation = JSON.parse(currentUserRole ? currentUserRole : false);

  const usersExceptCurrent = users.filter((user) => {
    return user.id !== userInformation.token;
  });

  useEffect(() => {
    dispatch(loadingActions.setIsLoading(true));
    const db = Firebase.firestore();
    return db.collection("users").onSnapshot((snapshot) => {
      const postData = [];
      snapshot.forEach((doc) => postData.push({ ...doc.data(), id: doc.id }));
      setUsers(postData);
      dispatch(loadingActions.setIsLoading(false));
    });
  }, [dispatch]);

  const handleClickEditRow = useCallback(
    (rowIndex, change) => {
      dispatch(loadingActions.setIsLoading(true));
      const db = Firebase.firestore();
      db.collection("users")
        .doc(rowIndex.row.original.id)
        .update({
          role: change.value,
        })
        .then(() => {
          dispatch(loadingActions.setIsLoading(false));
          dispatch(
            toastActions.toast({
              type: "success",
              message: "Successfully Modifying",
              position: "top",
            })
          );
        });
    },
    [dispatch]
  );

  const handleClickEditMajor = useCallback(
    (rowIndex, change) => {
      const db = Firebase.firestore();
      db.collection("users")
        .doc(rowIndex.row.original.id)
        .update({
          major: change.value,
        })
        .then(() => {
          dispatch(
            toastActions.toast({
              type: "success",
              message: "Successfully Modifying Major",
              position: "top",
            })
          );
        });
    },
    [dispatch]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "userName",
      },
      {
        Header: "Email",
        accessor: "uid",
      },
      {
        Header: "Users Role",
        accessor: "RoleEditing",
        Cell: (cellObj) => (
          <Select
            onChange={(change) => handleClickEditRow(cellObj, change)}
            options={[
              { value: userRole.students, label: userRole.students },
              { value: userRole.teacher, label: userRole.teacher },
              { value: userRole.admin, label: userRole.admin },
            ]}
            placeholder={cellObj.row.original.role}
          />
        ),
      },
      {
        Header: "Users Major",
        accessor: "MajorEditing",
        Cell: (cellObj) => (
          <Select
            onChange={(change) => handleClickEditMajor(cellObj, change)}
            options={[
              { value: teachersMajor.Math, label: teachersMajor.Math },
              { value: teachersMajor.Arabic, label: teachersMajor.Arabic },
              { value: teachersMajor.English, label: teachersMajor.English },
              { value: teachersMajor.Art, label: teachersMajor.Art },
              { value: teachersMajor.Piology, label: teachersMajor.Piology },
            ]}
            placeholder={cellObj.row.original.major}
            isDisabled={cellObj.row.original.role !== userRole.teacher}
          />
        ),
      },
    ],
    [
      handleClickEditRow,
      handleClickEditMajor,
      userRole.admin,
      userRole.students,
      userRole.teacher,
      teachersMajor.Piology,
      teachersMajor.Math,
      teachersMajor.English,
      teachersMajor.Art,
      teachersMajor.Arabic,
    ]
  );

  const saveButtonHanler = () => { };

  return (
    <>
      <BackgroundLogo title="Users Table" />
      <section className={classes.usersSection}>
        <div className={classes.headerContainer}>
          <div className={classes.actions}>
            <button className={classes.saveButton} onClick={saveButtonHanler}>
              Save
            </button>
          </div>
          <Table columns={columns} data={usersExceptCurrent} />
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Users;
