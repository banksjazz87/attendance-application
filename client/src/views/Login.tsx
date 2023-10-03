import React, { useState } from "react";
import Navbar from "../components/global/Navbar.tsx";
import LoginForm from "../components/login/LoginForm.tsx";
import LoadingBar from "../components/global/LoadingBar.tsx";
import "../assets/styles/views/login.scss";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
          updateLoadingStatus={(): void => isLoading ? setIsLoading(false) : setIsLoading(true)}
        />
        <LoadingBar 
          show={isLoading}
        />
      </div>
    </div>
  );
}
