import React, { useState } from "react";
import Navbar from "../components/global/Navbar.tsx";
import LoginForm from "../components/login/LoginForm.tsx";
import "../assets/styles/views/login.scss";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);
  const logInSuccess = (): void => setLoggedIn(true);

  return (
    <div id="login_wrapper">
      <Navbar />
      <div id="login_content_wrapper">
        <h1>This Will be the login page. </h1>
        <LoginForm
          showForm={loggedIn ? false : true}
          logIn={logInSuccess}
        />
      </div>
    </div>
  );
}
