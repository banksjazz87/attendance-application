import React, { useState, useEffect } from "react";
import {Group, GroupProps} from "../../types/interfaces.ts";

export default function GroupDropDown({ clickHandler, groupHandler}: GroupProps) {
  //This array is just for developing.
  const groups: string[] = [
    "Sunday Service",
    "Sunday School",
    "Hilltop Kids (Sunday)",
    "Hilltop Kids (Midweek)",
    "Ignite Youth",
  ];

  const [group, setGroup] = useState<Group>({ name: "" });

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setGroup({ ...group, name: e.target.value });
  };

  const submitHandler = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log(group);
    if (clickHandler && groupHandler) {
      clickHandler();
      groupHandler(group.name);
    }
  };

  const dropDownItems: JSX.Element[] = groups.map((x: string, y: number) => {
    return (
      <option key={`group_${y}`} id={`group_${y}`} value={x}>
        {x}
      </option>
    );
  });

  return (
    <div id="group_dropdown_wrapper">
      <p>Select a group</p>
      <form onSubmit={submitHandler}>
        <select id="group_dropdown" onChange={changeHandler}>
          <option id="placeholder">Please select an option</option>
          {dropDownItems}
        </select>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
