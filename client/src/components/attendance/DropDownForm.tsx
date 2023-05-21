import React from "react";
import { GroupProps } from "../../types/interfaces.ts";
import GroupDropDown from "../../components/global/GroupDropDown.tsx";

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
      <p>Select a group</p>
      <form onSubmit={submitHandler}>
        <GroupDropDown attendanceGroupSelected={groupSelectedHandler} />
        <input
          type="submit"
          value="Submit"
        />
      </form>
    </div>
  );
}
