import React from "react";
import { DeleteProps, DeleteResponse } from "../../types/interfaces.ts";
import deleteData from "../../functions/api/delete.ts";
import "../../assets/styles/components/global/deleteAlert.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export default function DeleteAlert({ message, hideHandler, url, show, deleteUser }: DeleteProps) {
  const deletePerson = (event: React.PointerEvent<HTMLButtonElement>): void => {
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
  };

  return (
    <div
      className="delete_alert_wrapper"
      style={show ? { display: "" } : { display: "none" }}
    >
      <div className="delete_alert">
        <button
          className="close_btn"
          onClick={hideAlert}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
        <p>{message}</p>
        <div className="button_wrapper">
          <button
            type="button"
            onClick={deletePerson}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={hideAlert}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
