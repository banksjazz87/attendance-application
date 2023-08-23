import React, { useEffect, useState } from "react";
import { GroupDropDownProps } from "../../types/interfaces";
import { Group } from "../../types/interfaces";
import "../../assets/styles/components/global/groupDropDown.scss";

export default function GroupDropDown({ groupSelected, getGroups, currentGroups, attendanceGroupSelected }: GroupDropDownProps): JSX.Element {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect((): void => {
    fetch("/groups")
      .then((data: Response): any => {
        return data.json();
      })
      .then((final: any): void => {
        const newArr = final.data;
        setGroups(newArr);

        if (getGroups) {
          getGroups(newArr);
        }
      });
  }, []);

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {

    sessionStorage.removeItem('currentAttendancePage'); 
    console.log('removed');


    if (groupSelected) {
      groupSelected(currentGroups, e.target.value);
    } else if (attendanceGroupSelected) {
      attendanceGroupSelected(groups, e.target.value);
    }
  };

  const dropDownItems = (): JSX.Element[] | undefined => {
    const options = groups.map((x: Group, y: number): JSX.Element => {
      return (
        <option
          key={`group_${x.id}`}
          id={`group_${y}`}
          value={x.displayName}
        >
          {x.displayName}
        </option>
      );
    });

    if (groups.length > 0) {
      return options;
    }
  };

  return (
    <div className="input_wrapper">
      <label htmlFor="group_dropdown">Select a Group</label>
      <select
        id="group_dropdown"
        name="group_dropdown"
        onChange={changeHandler}
      >
        <option id="placeholder">Please select an option</option>
        {dropDownItems()}
      </select>
    </div>
  );
}
