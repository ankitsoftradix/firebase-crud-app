import React, { useEffect, useState } from "react";
import RightSidebar from "../../components/rightSidebar/RightSidebar";
import Dashboard from "../dashboard/Dashboard";
import styles from "./UserListing.module.scss";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  addDoc,
  collection,
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
  const [isEdit, setIsEdit] = useState({
    check: false,
    data: { username: "", email: "", status: "", id: "" },
  });
  const createSubCollection = async (values, errors) => {
    if (!userList.filter((item) => item.email === values.email).length > 0) {
      setShowSidebar(false);
      if (isEdit.check) {
        const userDoc = doc(
          db,
          "admins",
          authUser.uid,
          "users",
          isEdit.data.id
        );
        const updatedUser = await updateDoc(userDoc, isEdit.data);
        console.log("updatedUser ==> ", updatedUser);
      } else {
        await addDoc(usersRef, values);
      }
    } else {
      errors.setErrors({ email: "Email is already exists" });
    }
  };

  useEffect(() => {
    onSnapshot(usersRef, (snapshot) => {
      setUserList(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  // useEffect(() => {
  //   console.log("userList ==> ", userList);
  // }, [userList]);

  return (
    <Dashboard>
      <div className={styles.mainWrap}>
        <div className={styles.topDiv}>
          <span>All Users</span>
          <input type="text" placeholder="Search users" />
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
              {userList.map((user) => (
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
                    <button className={styles.deleteUser}>Delete</button>
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
