import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import postData from "../../functions/api/post.ts";
import { User, UserProps } from "../../types/interfaces.ts";
import "../../assets/styles/components/login/loginForm.scss";

export default function LoginForm({ showForm, logIn, updateLoadingStatus }: UserProps) {
  const navigate = useNavigate();
  const [login, setLogin] = useState<User>({ name: "", password: "" });


  /**
   * 
   * @param input string
   * @param field string
   * @return void
   * @description updates the login state.
   */
  const inputChange = (input: string, field: string): void => {
    setLogin({ ...login, [field]: input });
  };

  /**
   * 
   * @param e form submit event
   * @return void
   * @description checks for a valid user, if the user is valid navigate to the /new-attendance page otherwise send an alert to try again.
   */
  const submitHandler = (e: React.FormEvent): void => {
    e.preventDefault();
    updateLoadingStatus();
    postData("/login", login).then((data) => {
      if (data.message === "valid") {
        logIn();
        updateLoadingStatus();
        navigate("/new-attendance", { replace: true });
      } else {
        updateLoadingStatus();
        alert("Invalid User, please try again");
      }
    });
  }

  return (
    <form
      id="login_form"
      method="POST"
      action="/login"
      style={showForm ? { display: "" } : { display: "none" }}
      onSubmit={submitHandler}
    >
      <div className="input_pair">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          placeholder="User Name"
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
          placeholder="Password"
          onChange={(e): void => inputChange(e.target.value, "password")}
        />
      </div>
      <div className="input_pair">
        <input
          type="submit"
          value="Submit"
          className="submit_btn"
        />
      </div>
    </form>
  );
}
