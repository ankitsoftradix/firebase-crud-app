import React, { useState } from "react";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAuthUser } from "../../features/user/userSlice";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async () => {
    try {
      const userData = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      const userRef = doc(db, "users", userData.user.uid);
      const docSnap = await getDoc(userRef);
      console.log("docSnap ==> ", docSnap.data());

      dispatch(updateAuthUser({ ...userData.user, type: docSnap.data().type }));
      navigate("/dashboard");
    } catch (error) {
      console.log("error ==> ", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainWrap}>
        <div className={styles.title}>Sign In</div>
        <div className={styles.emailName}>Email address</div>
        <input
          type="text"
          placeholder="Enter email"
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
        />
        <div className={styles.passwordName}>Password</div>
        <input
          type="text"
          placeholder="Enter password"
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
        />
        <button onClick={login} className={styles.submitBtn}>
          Submit
        </button>
        <div className={styles.signUpDiv}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.signUpLink}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
