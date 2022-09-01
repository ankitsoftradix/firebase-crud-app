import React, { useState } from "react";
import styles from "./Register.module.scss";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAuthUser } from "../../features/user/userSlice";
import { doc, setDoc } from "firebase/firestore";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const ValidateSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Enter a valid name"),
    email: Yup.string().email("Invalid email").required("Enter a valid email"),
    password: Yup.string()
      .min(6, "Too Short!")
      .max(50, "Too Long!")
      .required("Password is required"),
  });

  const register = async (values, errors) => {
    setLoading(true);
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
      dispatch(updateAuthUser(userData.user));
      navigate("/dashboard");
    } catch (error) {
      console.log("error ==> ", error.message);
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainWrap}>
        <div className={styles.title}>Register</div>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          validationSchema={ValidateSchema}
          onSubmit={(values, errors) => {
            register(values);
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

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
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
        <div className={styles.signUpDiv}>
          Already have an account?{" "}
          <Link to="/login" className={styles.signUpLink}>
            Login
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
