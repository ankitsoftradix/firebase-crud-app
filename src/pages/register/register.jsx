import React, { useState } from "react";
import styles from "./Register.module.scss";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAuthUser } from "../../features/user/userSlice";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const register = async () => {
    try {
      const userData = await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password
      );
      let adminCollectionRef = await doc(db, `users/${userData.user.uid}`);
      await setDoc(adminCollectionRef, {
        email: userData.user.email,
        id: userData.user.uid,
        type: 2,
        username: registerData.name,
        active: true,
      });
      dispatch(updateAuthUser(userData.user));
      navigate("/dashboard");
    } catch (error) {
      console.log("error ==> ", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainWrap}>
        <div className={styles.title}>Sign Up</div>
        <div className={styles.userName}>Name</div>
        <input
          type="text"
          placeholder="Enter name"
          onChange={(e) =>
            setRegisterData({ ...registerData, name: e.target.value })
          }
        />
        <div className={styles.emailName}>Email address</div>
        <input
          type="text"
          placeholder="Enter email"
          onChange={(e) =>
            setRegisterData({ ...registerData, email: e.target.value })
          }
        />
        <div className={styles.passwordName}>Password</div>
        <input
          type="text"
          placeholder="Enter password"
          onChange={(e) =>
            setRegisterData({ ...registerData, password: e.target.value })
          }
        />
        <button onClick={register} className={styles.submitBtn}>
          Submit
        </button>
        <div className={styles.signUpDiv}>
          Already have an account?{" "}
          <Link to="/" className={styles.signUpLink}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
