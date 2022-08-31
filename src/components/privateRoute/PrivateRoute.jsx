import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../../firebase-config";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { getAuthUser, updateAuthUser } from "../../features/user/userSlice";
import { doc, getDoc } from "firebase/firestore";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const authUser = useSelector(getAuthUser);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      const userRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userRef);
      dispatch(updateAuthUser({ ...currentUser, type: docSnap.data().type }));
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
