import React from "react";
import { DeleteProps, DeleteResponse } from "../../types/interfaces.ts";
import deleteData from "../../functions/api/delete.ts";


export default function DeleteAlert({message, hideHandler, url, show,deleteUser,}: DeleteProps) {

  const deletePerson = (
    event: React.PointerEvent<HTMLButtonElement>,
  ): void => {
    if (deleteUser) {
      deleteData(url).then((data: DeleteResponse): void => {
        if (data.message === "failure") {
            alert(data.error);
        } else {
            alert(data.message);
            window.location.reload();
        }
      });
    }
  };

  const hideAlert = (e: React.PointerEvent<HTMLButtonElement>): void => {
    hideHandler();
  }

  return (
    <div id="delete_alert" style={show ? { display: "" } : { display: "none" }}>
      <p>{message}</p>
      <div className="button_wrapper">
        <button type="button" onClick={deletePerson}>Yes</button>
        <button
          type="button"
          onClick={hideAlert}
        >
          No
        </button>
      </div>
    </div>
  );
}
