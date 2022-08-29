import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./Dashboard.module.scss";

const Dashboard = ({ children }) => {
  return (
    <div className={styles.dashboardWrap}>
      <div className={styles.sidebarWrap}>
        <Sidebar />
      </div>
      <div className={styles.bodyWrap}>{children}</div>
    </div>
  );
};

export default Dashboard;
