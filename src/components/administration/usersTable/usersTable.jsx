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
  const [disable, setDisable] = useState(true);
  const [usersRoleOriginal, setUsersRoleOriginal] = useState([]);
  const [majorOriginal, setMajorOriginal] = useState([]);
  const [changeValues, setChangeValues] = useState([]);
  const [changeMajor, setChangeMajor] = useState([]);
  const [roleValue, setRoleValue] = useState();
  const [changeValue, setChangeValue] = useState();

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
      dispatch(
        toastActions.toast({
          type: "",
          message: "",
          position: "",
        })
      );
    });
  }, [dispatch]);

  useEffect(() => {
    if (usersRoleOriginal.length === 0 && majorOriginal.length === 0)
      setDisable(true);
    else setDisable(false);
  }, [usersRoleOriginal.length, majorOriginal.length]);

  const handleClickEditRole = useCallback(
    (rowIndex, change) => {
      setRoleValue(change.value);
      setUsersRoleOriginal(
        usersRoleOriginal.filter((user) => {
          return user.id !== rowIndex.row.original.id;
        })
      );
      if (rowIndex.row.original.role !== change.value) {
        setUsersRoleOriginal((oldArray) => [
          rowIndex.row.original,
          ...oldArray,
        ]);
        setChangeValues((oldArray) => [change.value, ...oldArray]);
      }
    },
    [usersRoleOriginal]
  );

  const handleClickEditMajor = useCallback(
    (rowIndex, change) => {
      setChangeValue(change.value);
      setMajorOriginal(
        majorOriginal.filter((user) => {
          return user.id !== rowIndex.row.original.id;
        })
      );
      if (rowIndex.row.original.major !== change.value) {
        setMajorOriginal((oldArray) => [rowIndex.row.original, ...oldArray]);
        setChangeMajor((oldArray) => [change.value, ...oldArray]);
      }
    },
    [majorOriginal]
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
          <>
         { setRoleValue(cellObj.row.original.role)}
          <Select
            onChange={(change) => handleClickEditRole(cellObj, change)}
            options={[
              { value: userRole.students, label: userRole.students },
              { value: userRole.teacher, label: userRole.teacher },
              { value: userRole.admin, label: userRole.admin },
            ]}
            placeholder={roleValue}
          />
          </>
        ),
      },
      {
        Header: "Users Major",
        accessor: "MajorEditing",
        Cell: (cellObj) => (
          <>
          {setChangeValue(cellObj.row.original.major)}
          <Select
            onChange={(change) => handleClickEditMajor(cellObj, change)}
            options={[
              { value: teachersMajor.Math, label: teachersMajor.Math },
              { value: teachersMajor.Arabic, label: teachersMajor.Arabic },
              { value: teachersMajor.English, label: teachersMajor.English },
              { value: teachersMajor.Art, label: teachersMajor.Art },
              { value: teachersMajor.Piology, label: teachersMajor.Piology },
            ]}
            placeholder={changeValue}
            isDisabled={cellObj.row.original.role !== userRole.teacher}
          />
          </>
        ),
      },
    ],
    [
      handleClickEditRole,
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

  const saveButtonHanler = async () => {
    let index = 0,
      majorIndex = 0;
    dispatch(loadingActions.setIsLoading(true));
    await usersRoleOriginal.map(async (userOriginal) => {
      const db = Firebase.firestore();
      await db.collection("users").doc(userOriginal.id).update({
        role: changeValues[index],
      });
      return index++;
    });

    await majorOriginal.map(async (majorOriginal) => {
      const db = Firebase.firestore();
      await db.collection("users").doc(majorOriginal.id).update({
        major: changeMajor[index],
      });
      return majorIndex++;
    });
    dispatch(loadingActions.setIsLoading(false));
    dispatch(
      toastActions.toast({
        type: "success",
        message: "Successfully Modifying",
        position: "top",
      })
    );
    setUsersRoleOriginal([]);
    setMajorOriginal([]);
    setChangeValues([]);
    setChangeMajor([]);
  };

  return (
    <>
      <BackgroundLogo title="Users Table" />
      <section className={classes.usersSection}>
        <div className={classes.headerContainer}>
          <div className={classes.actions}>
            <button
              className={classes.saveButton}
              disabled={disable}
              onClick={saveButtonHanler}
            >
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
