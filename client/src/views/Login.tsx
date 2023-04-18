import React, {useState} from "react";
import Navbar from "../components/global/Navbar.tsx";
import LoginForm from "../components/login/LoginForm.tsx";


export default function Login() {
  
  const [loggedIn, setLoggedIn] = useState(false);
  const logInSuccess = (): void => setLoggedIn(true);

  return (
    <div>
      <Navbar />
      <h1>This Will be the login page. </h1>
        <LoginForm
          showForm={loggedIn ? false : true}
          logIn={logInSuccess}
         />
    </div>
  );
}
