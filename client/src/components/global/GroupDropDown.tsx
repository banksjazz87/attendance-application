import React from "react";
import {GroupProps} from "../../types/interfaces";

export default function GroupDropDown({groupSelected}: GroupProps) {
  //This array is just for developing.
  const groups: string[] = [
    "Sunday Service",
    "Sunday School",
    "Hilltop Kids (Sunday)",
    "Hilltop Kids (Midweek)",
    "Ignite Youth",
  ];

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    if (groupSelected) {
        groupSelected(e.target.value);
    }
  }

  const dropDownItems: JSX.Element[] = groups.map((x: string, y: number) => {
    return (
      <option key={`group_${y}`} id={`group_${y}`} value={x}>
        {x}
      </option>
    );
  });

 
  return (
    <select id="group_dropdown" 
        onChange={changeHandler}>
      <option id="placeholder">Please select an option</option>
      {dropDownItems}
    </select>
  );
}
