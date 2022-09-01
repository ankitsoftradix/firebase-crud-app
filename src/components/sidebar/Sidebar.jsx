import React from "react";
import styles from "./Sidebar.module.scss";
import { GoHome } from "react-icons/go";
import { FiUsers } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthUser } from "../../features/user/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";

const sidebarNavItems = [
  {
    display: "Dashboard",
    icon: <GoHome />,
    to: "/dashboard",
    section: "",
  },
  {
    display: "Users",
    icon: <FiUsers />,
    to: "/users",
    section: "",
  },
  {
    display: "Posts",
    icon: <HiOutlinePhotograph />,
    to: "/posts",
    section: "",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const authUser = useSelector(getAuthUser);
  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };
  return (
    <div className={styles.sidebar}>
      <div className={styles.menu}>
        <div className={styles.logo}>Firebase</div>
        {sidebarNavItems.map((item, index) => (
          <Link to={item.to} key={index}>
            <div className={styles.item}>
              <div className={styles.icon}>{item.icon}</div>
              <div className={styles.text}>{item.display}</div>
            </div>
          </Link>
        ))}
        <div className={styles.item} onClick={logout}>
          <div className={styles.icon}>
            <BiLogOut />
          </div>
          <div className={styles.text}>Log Out</div>
        </div>
      </div>
      <div className={styles.bottomMenu}>
        <div className={styles.item}>
          <div className={styles.icon}>
            <FaRegUserCircle />
          </div>
          <div className={styles.text}>{authUser.email}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
