import React, { useEffect, useState } from "react";
import { Attendee } from "../../types/interfaces.ts";
import {AttendantFormLayout} from "../../variables/newAttendantForm.ts";
import {AttendanceInputs} from "../../types/interfaces.ts";

export default function NewMember(): JSX.Element {
  const [allAttendants, setAllAttendants] = useState<Attendee[]>([
    {
      firstName: "",
      lastName: "",
      adult: 0,
      child: 0,
      youth: 0,
      member: 0,
      visitor: 0,
    },
  ]);

  const [newAttendant, setNewAttendant] = useState<Attendee>({
    firstName: "",
    lastName: "",
    adult: 0,
    child: 0,
    youth: 0,
    member: 0,
    visitor: 0,
  });

  /*useEffect((): void => {
    fetch("/all-attendants")
      .then((data) => data.json())
      .then((final) => {
        setFirstLast(final.data);
        console.log(allAttendants);
      });
  }, []);*/

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAttendant({ ...newAttendant, [e.target.id]: e.target.value });
  };

  const radioAgeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAttendant({ ...newAttendant, adult: 0, child: 0, youth: 0 });
    setNewAttendant({ ...newAttendant, [e.target.id]: 1 });
  };

  const radioMemberChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAttendant({ ...newAttendant, member: 0, visitor: 0 });
    setNewAttendant({ ...newAttendant, [e.target.id]: 1 });
  };

  const setFirstLast = (array: Attendee[]): void[] => {
    
    let addFirstLast = array.map((x: Attendee, y: number): void => {
    let copyOfArray = array.slice();
    let firstLastName = `${x.firstName}${x.lastName}`;

    copyOfArray[y].firstLast = firstLastName.toLowerCase();

    return setAllAttendants(copyOfArray);
  });

    return addFirstLast;
}

const nameFields: JSX.Element[] = AttendantFormLayout.name.map((x: AttendanceInputs, y: number): JSX.Element => {
  return (
    <div className="input_wrapper" key={`name_field_${y}`}>
      <label htmlFor={x.id}>{x.label}</label>
      <input placeholder={x.placeholder} type={x.type} id={x.id} name={x.name} onChange={nameHandler} />
    </div>
  )
});

const ageFields: JSX.Element[] = AttendantFormLayout.ageGroup.map((x: AttendanceInputs, y: number): JSX.Element => {
  return (
    <div className="input_wrapper" key={`name_field_${y}`}>
      <label htmlFor={x.id}>{x.label}</label>
      <input placeholder={x.placeholder} type={x.type} id={x.id} name={x.name} onChange={radioAgeChange} />
    </div>
  )
});

const memberFields: JSX.Element[] = AttendantFormLayout.memberStatus.map((x: AttendanceInputs, y: number): JSX.Element => {
  return (
    <div className="input_wrapper" key={`name_field_${y}`}>
      <label htmlFor={x.id}>{x.label}</label>
      <input placeholder={x.placeholder} type={x.type} id={x.id} name={x.name} onChange={radioMemberChange} />
    </div>
  )
});


  
  return (
    <form
      id="new_member_form"
      onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log(newAttendant);
        console.log(allAttendants);
      }}
    >
      <div className="name_fields_wrapper fields_wrapper">
        {nameFields}
      </div>

      <div className="age_fields_wrapper fields_wrapper">
        {ageFields}
      </div>

      <div className="member_fields_wrapper fields_wrapper">
        {memberFields}
      </div>

      <input type="submit" value="Submit" />
    </form>
  );
}
