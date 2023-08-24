import React from "react";
import { GroupProps } from "../../types/interfaces.ts";
import GroupDropDown from "../../components/global/GroupDropDown.tsx";
import "../../assets/styles/components/attendance/dropDownForm.scss";

export default function DropDownForm({ clickHandler, groupHandler, name, groupSelectedHandler, show, resetOffset }: GroupProps) {
  
  const updateOffset = (): void => {
    if (resetOffset) {
      resetOffset();
      sessionStorage.setItem('currentAttendancePage', '1');
      console.log(sessionStorage.getItem('currentAttendancePage'));
    }
  }
  
  const submitHandler = (e: React.FormEvent): void => {
    e.preventDefault();
    if (clickHandler && groupHandler) {
      clickHandler();
      groupHandler(name);
      updateOffset();
    }
  };

  return (
    <div
      id="group_dropdown_wrapper"
      style={show ? { display: "" } : { display: "none" }}
    >
      <div className="inner_form_wrapper">
        <form onSubmit={submitHandler}>
          <GroupDropDown 
          attendanceGroupSelected={groupSelectedHandler} 
          resetOffset={resetOffset}
          />
          <input
            type="submit"
            value="Submit"
          />
        </form>
      </div>
    </div>
  );
}
