import React, { useState } from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import { Group } from "../types/interfaces.ts";

export default function Search() {
  const [groupTable, setGroupTable] = useState<Group>({
    name: "",
    age_group: "",
    displayName: "",
  });

  const dropDownChangeHandler = (arr: Group[], value: string): void => {
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].displayName === value) {
        index = i;
      }
    }

    setGroupTable({
      ...groupTable,
      name: arr[index]["name"],
      age_group: arr[index]["age_group"],
      displayName: value,
    });

    console.log(groupTable);
  };

  return (
    <div>
      <Navbar />
      <h1>This Will be the search page. </h1>
      <form
        method="GET"
        action="/all/attendance-sheets/parent/"
        onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
          e.preventDefault();
        }}
      >
        <GroupDropDown attendanceGroupSelected={dropDownChangeHandler} />
        <input
          type="submit"
          value="submit"
        />
      </form>
    </div>
  );
}
