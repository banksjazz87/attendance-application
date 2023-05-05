import React from "react";
import { Attendee } from "../../types/interfaces.ts";
import deleteData from "../../functions/api/delete.ts";

interface DeleteProps {
  message: string;
  url: string;
  show: boolean;
  deleteUser: Attendee;
  hideHandler: Function;
}

export default function DeleteAlert({message, hideHandler, url, show,deleteUser,}: DeleteProps) {

  const deletePerson = (
    event: React.PointerEvent<HTMLButtonElement>,
  ): void => {
    if (deleteUser) {
      deleteData(url).then((data: Response): void => {
        console.log(data);
      });
    }
  };

  return (
    <div id="delete_alert" style={show ? { display: "" } : { display: "none" }}>
      <p>{message}</p>
      <div className="button_wrapper">
        <button type="button" onClick={deletePerson}>Yes</button>
        <button
          type="button"
          onClick={(e: React.PointerEvent<HTMLButtonElement>): void => {
            e.preventDefault();
            hideHandler();
          }}
        >
          No
        </button>
      </div>
    </div>
  );
}
