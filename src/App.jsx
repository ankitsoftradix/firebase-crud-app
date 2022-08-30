import React from "react";
import Login from "./pages/login/Login";
import "./scss/App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register/Register";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Home from "./pages/home/Home";
import UserListing from "./pages/userListing/UserListing";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UserListing />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
