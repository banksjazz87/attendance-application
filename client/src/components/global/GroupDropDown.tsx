import React, { useState, useEffect } from "react";

interface Group {
    name: string;
}

export default function GroupDropDown() {
  const groups: string[] = [
    "Sunday Service",
    "Sunday School",
    "Hilltop Kids (Sunday)",
    "Hilltop Kids (Midweek)",
    "Ignite Youth",
  ];

  const [group, setGroup] = useState<Group>({name: ''});


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
      <form onSubmit={(e: React.FormEvent): void => {
        e.preventDefault();
        console.log(group);
      }}>
        <select id="group_dropdown"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => setGroup({...group, name: e.target.value})}>
          <option id="placeholder">Please select an option</option>
          {dropDownItems}
        </select>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
