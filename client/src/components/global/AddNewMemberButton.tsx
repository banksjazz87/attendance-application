import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/components/global/addNewMemberButton.scss";

interface AddNewMemberButtonProps {
  show: boolean;
  clickHandler: Function;
}
export default function AddNewMemberButton({ show, clickHandler }: AddNewMemberButtonProps) {
  const btnClickHandler = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    clickHandler();
  };
  return (
    <button
      style={show ? { display: "" } : { display: "none" }}
      type="button"
      onClick={btnClickHandler}
      className="add_new_member_btn"
    >
      Add New Member
      <FontAwesomeIcon
        className="add_member_icon"
        icon={faUserPlus}
      />
    </button>
  );
}
