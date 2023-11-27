import React from "react";
import { GroupProps } from "../../types/interfaces.ts";
import "../../assets/styles/components/newAttendance/newGroupForm.scss";

export default function NewGroupForm({ groupSelected, ageHandler }: GroupProps): JSX.Element {
  const groupAge = ["Select One", "All", "Adult", "Youth", "Child"];


  /**
   * 
   * @param e change event on an input element.
   * @returns void
   * @description updates the group selected state.
   */
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (groupSelected) {
      groupSelected(e.target.value);
    }
  };


  /**
   * 
   * @param e change event on a select field
   * @returns void
   * @description updates the target age of the group.
   */
  const selectAgeHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    if (ageHandler) {
      ageHandler(e.target.value);
    }
  };

  //Display the group ages that can be chosen.
  const groupOptions = groupAge.map((x: string, y: number): JSX.Element => {
    return (
      <option
        key={`groupNames_${y}`}
        value={x === "Select One" ? "" : x}
      >
        {x}
      </option>
    );
  });

  return (
    <div id="new_group_wrapper">
      <div className="input_wrapper">
        <label
          id="new_group"
          htmlFor="new_group"
        >
          Group Name
        </label>
        <input
          type="text"
          id="new_group"
          onChange={changeHandler}
        />
      </div>
      <div className="input_wrapper">
        <label htmlFor="group_age_select">Select Age</label>
        <select
          id="group_age_select"
          onChange={selectAgeHandler}
        >
          {groupOptions}
        </select>
      </div>
    </div>
  );
}
