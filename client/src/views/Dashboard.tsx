import React, {useState} from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import {Group} from "../types/interfaces.ts";

export default function Dashboard() {

  const [selectedGroup, setSelectedGroup] = useState<string>('');

  const updateGroup = (arr: Group[], value: string): void => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].displayName === value) {
        setSelectedGroup(arr[i].name);
      }
    }
  }

  return (
    <div>
      <Navbar />
      <div className="header_wrapper">
        <h1>Dashboard</h1>
      </div>
      <GroupDropDown 
        attendanceGroupSelected={updateGroup}
      />
      <p>{`The selected group is ${selectedGroup}`}</p>
    </div>
  );
}
