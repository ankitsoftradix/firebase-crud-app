import React from "react";
import Dashboard from "../dashboard/Dashboard";
import styles from "./UserListing.module.scss";

const UserListing = () => {
  return (
    <Dashboard>
      <div className={styles.mainWrap}>
        <div className={styles.topDiv}>
          <span>All Users</span>
          <input type="text" placeholder="Search users" />
          <button>Add User</button>
        </div>
        <div className={styles.bottomDiv}></div>
      </div>
    </Dashboard>
  );
};

export default UserListing;
