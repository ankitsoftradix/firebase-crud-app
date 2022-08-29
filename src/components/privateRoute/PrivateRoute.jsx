import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import _ from "lodash";

const PrivateRoute = ({ children }) => {
  const [authUser, setAuthUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setAuthUser(currentUser);
    });
  }, []);

  return (
    <>
      {authUser == null ? (
        <Navigate to="/login" />
      ) : _.isEmpty(authUser) ? (
        <></>
      ) : (
        children
      )}
    </>
  );
};

export default PrivateRoute;
