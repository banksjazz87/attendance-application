import React, { useState } from "react";
import postData from "../../functions/api/post.ts";
import {User, UserProps} from "../../types/interfaces.ts";


export default function LoginForm({showForm, logIn}: UserProps) {
  const [login, setLogin] = useState<User>({ name: "", password: "" });

  const inputChange = (input: string, field: string): void => {
    setLogin({ ...login, [field]: input });
  };

  return (
    <form
      style={showForm ? {display: ""} : {display: 'none'}}
      onSubmit={(e: React.FormEvent): void => {
        e.preventDefault();
        postData("/login", login).then((data) => {
          if (data.message === 'valid') {
            logIn();
          } else {
            alert("Invalid User, please tyr again");
          }
        });
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
  );
}
