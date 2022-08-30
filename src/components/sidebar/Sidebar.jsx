import React, { useEffect } from "react";
import styles from "./Sidebar.module.scss";
import { BiLogOut } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthUser } from "../../features/user/userSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const authUser = useSelector(getAuthUser);
  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    console.log("authUser ==> ", authUser);
  }, [authUser]);

  return (
    <div className={styles.sidebarWrap}>
      <div className={styles.topWrap}>
        <div className={styles.header}>
          <img src={require("../../assest/firebase_logo.png")} alt="logo" />
          <span>Firebase</span>
        </div>
      </div>
      <div className={styles.bottomWrap}>
        <div className={styles.authUser}>
          <FiUser />
          <span>{authUser.email}</span>
        </div>
        <div className={styles.footer} style={{ cursor: "pointer" }}>
          <BiLogOut />
          <span onClick={logout}>Log Out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
