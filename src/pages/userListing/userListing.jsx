import React, { useEffect, useRef, useState } from "react";
import RightSidebar from "../../components/rightSidebar/RightSidebar";
import Dashboard from "../dashboard/Dashboard";
import styles from "./UserListing.module.scss";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import { useSelector } from "react-redux";
import { getAuthUser } from "../../features/user/userSlice";

const UserListing = () => {
  const ValidateSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Enter a valid name"),
    email: Yup.string().email("Invalid email").required("Enter a valid email"),
    status: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Status is required"),
  });
  const authUser = useSelector(getAuthUser);
  const usersRef = collection(db, "admins", authUser.uid, "users");
  const [showSidebar, setShowSidebar] = useState(false);
  const [userList, setUserList] = useState([]);
  const [showUsers, setShowUsers] = useState([]);
  const inputRef = useRef();
  const [isEdit, setIsEdit] = useState({
    check: false,
    data: { username: "", email: "", status: "", id: "" },
  });

  const createSubCollection = async (values, errors) => {
    if (
      isEdit.check &&
      !userList.filter(
        (item) => item.email === values.email && item.id !== isEdit.data.id
      ).length > 0
    ) {
      setShowSidebar(false);
      const userDoc = doc(db, "admins", authUser.uid, "users", isEdit.data.id);
      await updateDoc(userDoc, values);
    } else if (
      !isEdit.check &&
      !userList.filter((item) => item.email === values.email).length > 0
    ) {
      setShowSidebar(false);
      await addDoc(usersRef, values);
    } else {
      errors.setErrors({ email: "Email is already exists" });
    }
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "admins", authUser.uid, "users", id);
    await deleteDoc(userDoc);
  };

  const handleShowUser = (value) => {
    if (value === "") {
      setShowUsers(userList);
    } else {
      const newList = userList.filter((user) =>
        user.username.toLowerCase().includes(value.toLowerCase())
      );
      setShowUsers(newList);
    }
  };

  useEffect(() => {
    onSnapshot(usersRef, (snapshot) => {
      setUserList(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      if (inputRef.current.value === "") {
        setShowUsers(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      } else {
        const newList = snapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((user) =>
            user.username
              .toLowerCase()
              .includes(inputRef.current.value.toLowerCase())
          );
        setShowUsers(newList);
      }
    });
  }, []);

  return (
    <Dashboard>
      <div className={styles.mainWrap}>
        <div className={styles.topDiv}>
          <span>All Users</span>
          <input
            type="text"
            placeholder="Search users"
            onChange={(e) => handleShowUser(e.target.value)}
            ref={inputRef}
          />
          <button
            onClick={() => {
              setIsEdit({
                check: false,
                data: { username: "", email: "", status: "", id: "" },
              });
              setShowSidebar(true);
            }}
          >
            Add User
          </button>
        </div>
        <div className={styles.bottomDiv}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th style={{ textAlign: "center", paddingRight: "14px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {showUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.status}</td>
                  <td>
                    <button
                      className={styles.editUser}
                      onClick={() => {
                        setIsEdit({
                          check: true,
                          data: {
                            username: user.username,
                            email: user.email,
                            status: user.status,
                            id: user.id,
                          },
                        });
                        setShowSidebar(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteUser}
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <RightSidebar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          title={isEdit.check ? "Edit User" : "Add User"}
        >
          <div className={styles.sideBarWrap}>
            <Formik
              initialValues={{
                username: isEdit.data.username,
                email: isEdit.data.email,
                status: isEdit.data.status,
              }}
              validationSchema={ValidateSchema}
              onSubmit={(values, errors) => {
                createSubCollection(values, errors);
              }}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form>
                  <div className={styles.fieldWrap}>
                    <div className={styles.fieldName}>Name</div>
                    <input
                      type="text"
                      name="username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      placeholder="Enter name"
                    />
                    {errors.username && touched.username && (
                      <div className={styles.error}>{errors.username}</div>
                    )}
                  </div>
                  <div className={styles.fieldWrap}>
                    <div className={styles.fieldName}>Email</div>
                    <input
                      type="text"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      placeholder="Enter email"
                    />
                    {errors.email && touched.email && (
                      <div className={styles.error}>{errors.email}</div>
                    )}
                  </div>
                  <div className={styles.fieldWrap}>
                    <div className={styles.fieldName}>Status</div>
                    <input
                      type="text"
                      name="status"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.status}
                      placeholder="Enter status"
                    />
                    {errors.status && touched.status && (
                      <div className={styles.error}>{errors.status}</div>
                    )}
                  </div>
                  <button type="submit" className={styles.submitBtn}>
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </RightSidebar>
      </div>
    </Dashboard>
  );
};

export default UserListing;
