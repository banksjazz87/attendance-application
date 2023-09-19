import React, { useState } from "react";
import Navbar from "../components/global/Navbar.tsx";
import LoginForm from "../components/login/LoginForm.tsx";
import "../assets/styles/views/login.scss";
import LoadingBar from "../components/global/LoadingBar.tsx";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const logInSuccess = (): void => setLoggedIn(true);

  return (
    <div id="login_wrapper">
      <Navbar />
      <div className="header_wrapper">
        <h1>Login </h1>
      </div>
      <div id="login_content_wrapper">
        <LoginForm
          showForm={loggedIn ? false : true}
          logIn={logInSuccess}
        />
        <LoadingBar />
      </div>
    </div>
  );
}
