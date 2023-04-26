import React from "react";
import { GroupProps } from "../../types/interfaces.ts";

export default function NewGroupForm({
  groupSelected,
  ageHandler
}: GroupProps): JSX.Element {
  const groupAge = ["All", "Adults", "Youth", "Children"];

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (groupSelected) {
      groupSelected(e.target.value);
    }
  };

  const selectAgeHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    if (ageHandler) {
      ageHandler(e.target.value); 
    }
  }

  const groupOptions = groupAge.map((x: string, y: number): JSX.Element => {
    return (
      <option key={`groupNames_${y}`} value={x}>
        {x}
      </option>
    );
  });

  return (
    <div id="new_group_wrapper">
      <label id="new_group" htmlFor="new_group">
        Group Name
      </label>
      <input type="text" id="new_group" onChange={changeHandler} />
      <label htmlFor="group_age_select">Select Age group.</label>
      <select id="group_age_select" onChange={selectAgeHandler}>
        {groupOptions}
        </select>
    </div>
  );
}
