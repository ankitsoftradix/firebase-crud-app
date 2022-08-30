import React from "react";
import styles from "./Sidebar.module.scss";
import { BiLogOut } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthUser } from "../../features/user/userSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const authUser = useSelector(getAuthUser);
  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className={styles.sidebarWrap}>
      <div className={styles.topWrap}>
        <Link className={styles.header} to="/dashboard">
          <img src={require("../../assest/firebase_logo.png")} alt="logo" />
          <span>Firebase</span>
        </Link>

        <Link className={styles.users} to="/users">
          <FiUsers />
          <span>Users</span>
        </Link>
      </div>
      <div className={styles.bottomWrap}>
        <div className={styles.authUser}>
          <FaUserAlt />
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
