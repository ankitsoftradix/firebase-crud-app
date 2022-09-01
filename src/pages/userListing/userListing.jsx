import React, { useEffect, useRef, useState } from "react";
import RightSidebar from "../../components/rightSidebar/RightSidebar";
import Dashboard from "../dashboard/Dashboard";
import styles from "./UserListing.module.scss";
import { Formik, Form } from "formik";
import ReactForm from "react-bootstrap/Form";
import * as Yup from "yup";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { useSelector } from "react-redux";
import { getAuthUser } from "../../features/user/userSlice";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";

const UserListing = () => {
  const [isEdit, setIsEdit] = useState({
    check: false,
    data: { username: "", email: "", password: "", id: "" },
  });
  const ValidateSchema = Yup.object().shape(
    isEdit.check
      ? {
          username: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .required("Enter a valid name"),
          email: Yup.string()
            .email("Invalid email")
            .required("Enter a valid email"),
        }
      : {
          username: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .required("Enter a valid name"),
          email: Yup.string()
            .email("Invalid email")
            .required("Enter a valid email"),
          password: Yup.string()
            .min(6, "Too Short!")
            .max(50, "Too Long!")
            .required("Password is required"),
        }
  );
  const authUser = useSelector(getAuthUser);
  const usersRef = collection(db, "users");
  const [showSidebar, setShowSidebar] = useState(false);
  const [userList, setUserList] = useState([]);
  const [showUsers, setShowUsers] = useState([]);
  const inputRef = useRef();
  const [loading, setLoading] = useState(false);

  const createSubCollection = async (values, errors) => {
    setLoading(true);
    if (
      isEdit.check &&
      !userList.filter(
        (item) => item.email === values.email && item.id !== isEdit.data.id
      ).length > 0
    ) {
      const userDoc = doc(db, "users", isEdit.data.id);
      await updateDoc(userDoc, {
        username: values.username,
        email: values.email,
      });
      toast.success("User updated successfully");
      setShowSidebar(false);
    } else if (
      !isEdit.check &&
      !userList.filter((item) => item.email === values.email).length > 0
    ) {
      try {
        const userData = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        let adminCollectionRef = await doc(db, `users/${userData.user.uid}`);
        await setDoc(adminCollectionRef, {
          email: userData.user.email,
          id: userData.user.uid,
          type: 2,
          username: values.username,
          active: true,
        });
        toast.success("User added successfully");
        setShowSidebar(false);
      } catch (error) {
        console.log("error ==> ", error.message);
        toast.error(error.message);
      }
    } else {
      errors.setErrors({ email: "Email is already exists" });
    }
    setLoading(false);
  };

  const removeUser = async (id) => {
    const userDoc = doc(db, "users", id);
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
      setUserList(snapshot.docs.map((doc) => ({ ...doc.data() })));
      if (inputRef.current.value === "") {
        setShowUsers(snapshot.docs.map((doc) => ({ ...doc.data() })));
      } else {
        const newList = snapshot.docs
          .map((doc) => ({ ...doc.data() }))
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
                data: { username: "", email: "", password: "", id: "" },
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
                  <td>
                    {/* <ReactForm.Check type="switch" id="custom-switch" /> */}
                    <ReactForm.Check
                      type="switch"
                      checked={user.active}
                      onChange={() =>
                        updateDoc(doc(db, "users", user.id), {
                          active: !user.active,
                        })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className={styles.editUser}
                      onClick={() => {
                        setIsEdit({
                          check: true,
                          data: {
                            username: user.username,
                            email: user.email,
                            password: user.password,
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
                      onClick={() => removeUser(user.id)}
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
                password: isEdit.data.password,
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
                  {!isEdit.check && (
                    <div className={styles.fieldWrap}>
                      <div className={styles.fieldName}>Password</div>
                      <input
                        type="text"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        placeholder="Enter password"
                      />
                      {errors.password && touched.password && (
                        <div className={styles.error}>{errors.password}</div>
                      )}
                    </div>
                  )}

                  <button type="submit" className={styles.submitBtn}>
                    Submit
                    {loading && (
                      <RotatingLines
                        strokeColor="white"
                        strokeWidth="5"
                        animationDuration="0.75"
                        width="20"
                        visible={true}
                      />
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </RightSidebar>
      </div>
      <ToastContainer />
    </Dashboard>
  );
};

export default UserListing;
