import React, { useState } from "react";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAuthUser } from "../../features/user/userSlice";
import { doc, getDoc } from "firebase/firestore";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ValidateSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Enter a valid email"),
    password: Yup.string()
      .min(6, "Too Short!")
      .max(50, "Too Long!")
      .required("Password is required"),
  });

  const login = async (values, errors) => {
    try {
      const userData = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const userRef = doc(db, "users", userData.user.uid);
      const docSnap = await getDoc(userRef);
      console.log("docSnap ==> ", docSnap.data());

      dispatch(updateAuthUser({ ...userData.user, type: docSnap.data().type }));
      navigate("/dashboard");
    } catch (error) {
      console.log("error ==> ", error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainWrap}>
        <div className={styles.title}>Sign In</div>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={ValidateSchema}
          onSubmit={(values, errors) => {
            login(values, errors);
          }}
        >
          {({ errors, touched, handleChange, handleBlur, values }) => (
            <Form>
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

              <button type="submit" className={styles.submitBtn}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
        <div className={styles.signUpDiv}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.signUpLink}>
            Create an account
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
