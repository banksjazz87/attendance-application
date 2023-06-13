import React from "react";
import { GroupProps } from "../../types/interfaces.ts";
import GroupDropDown from "../../components/global/GroupDropDown.tsx";
import "../../assets/styles/components/attendance/dropDownForm.scss";

export default function DropDownForm({ clickHandler, groupHandler, name, groupSelectedHandler }: GroupProps) {
  const submitHandler = (e: React.FormEvent): void => {
    e.preventDefault();
    if (clickHandler && groupHandler) {
      clickHandler();
      groupHandler(name);
    }
  };

  return (
    <div id="group_dropdown_wrapper">
      <div className="inner_form_wrapper">
        <form onSubmit={submitHandler}>
          <GroupDropDown attendanceGroupSelected={groupSelectedHandler} />
          <input
            type="submit"
            value="Submit"
          />
        </form>
      </div>
    </div>
  );
}
