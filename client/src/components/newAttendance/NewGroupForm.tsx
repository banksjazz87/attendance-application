import React from "react";
import { GroupProps } from "../../types/interfaces.ts";

export default function NewGroupForm({groupSelected}: GroupProps): JSX.Element {
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (groupSelected) {
      groupSelected(e.target.value);
    }
  };

  return (
    <div id="new_group_wrapper">
      <label id="new_group" htmlFor="new_group">
        Group Name
      </label>
      <input type="text" id="new_group" onChange={changeHandler} />
    </div>
  );
}
