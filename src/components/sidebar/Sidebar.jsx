import React from "react";
import styles from "./Sidebar.module.scss";
import { BiLogOut } from "react-icons/bi";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };
  return (
    <div className={styles.sidebarWrap}>
      <div className={styles.header}>
        <img src={require("../../assest/firebase_logo.png")} alt="logo" />
        <span>Firebase</span>
      </div>
      <div className={styles.footer}>
        <BiLogOut />
        <span onClick={logout}>Log Out</span>
      </div>
    </div>
  );
};

export default Sidebar;
