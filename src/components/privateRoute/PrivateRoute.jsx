import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { getAuthUser, updateAuthUser } from "../../features/user/userSlice";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const authUser = useSelector(getAuthUser);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      dispatch(updateAuthUser(currentUser));
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
