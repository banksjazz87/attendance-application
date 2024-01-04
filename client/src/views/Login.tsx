import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import LoginForm from "../components/login/LoginForm.tsx";
import LoadingBar from "../components/global/LoadingBar.tsx";
import WelcomeUser from "../components/login/WelcomeUser.tsx";
import "../assets/styles/views/login.scss";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const logInSuccess = (): void => setLoggedIn(true);


  const getCookie = (cookieName: string): string => {
    let name = cookieName + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookie = decodedCookie.split(';');

    for (let i = 0; i < cookie.length; i++) {
      let current = cookie[i];

      while (current.charAt(0) === ' ') {
        current = current.substring(1);
      }
      if (current.indexOf(name) === 0) {
        return current.substring(name.length, current.length);
      }
    }
    return "";
  }

  useEffect((): void => {
    const cookieAccount = getCookie('account');
    setCurrentUser(cookieAccount);

    if (cookieAccount.length > 0) {
      setLoggedIn(true);
    }
  }, []);

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
        <WelcomeUser 
          userName={currentUser}
        />
        <LoadingBar 
          show={isLoading}
        />
      </div>
    </div>
  );
}
