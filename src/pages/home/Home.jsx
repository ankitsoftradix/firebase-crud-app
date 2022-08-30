import React from "react";
import Dashboard from "../dashboard/Dashboard";
import styles from "./Home.module.scss";

const Home = () => {
  return (
    <Dashboard>
      <div className={styles.homeWrap}>Welcome to firebase dashboard</div>
    </Dashboard>
  );
};

export default Home;
