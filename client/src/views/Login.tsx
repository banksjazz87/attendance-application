import React, { useState } from "react";
import Navbar from "../components/Navbar.tsx";
import postData from "../functions/api/post.ts";

interface User {
  name: string;
  password: string;
}

export default function Login() {
  const [login, setLogin] = useState<User>({ name: "", password: "" });

  const inputChange = (input: string, field: string): void => {
    setLogin({ ...login, [field]: input });
  };

  return (
    <div>
      <Navbar />
      <h1>This Will be the login page. </h1>
      <form
        onSubmit={(e: React.FormEvent): void => {
          e.preventDefault();
          postData('/login', login)
          .then(data => 
              data.message === 'valid' ? alert('Valid User') : alert('Invalid User, please try again.'));
        }}
      >
        <div className="input_pair">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            onChange={(e): void => inputChange(e.target.value, "name")}
          />
        </div>
        <div className="input_pair">
          <label htmlFor="user_password">Password</label>
          <input
            id="user_password"
            name="user_password"
            type="password"
            onChange={(e): void => inputChange(e.target.value, "password")}
          />
        </div>
        <div className="input_pair">
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}
