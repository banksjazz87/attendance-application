import React, { useEffect, useState } from "react";
import { Attendee } from "../../types/interfaces.ts";

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

  useEffect((): void => {
    fetch("/all-attendants")
      .then((data) => data.json())
      .then((final) => {
        setFirstLast(final.data);
        console.log(allAttendants);
      });
  }, []);

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
  
  return (
    <form
      id="new_member_form"
      onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log(newAttendant);
        console.log(allAttendants);
      }}
    >
      <div className="input_wrapper">
        <label htmlFor="firstName">First Name</label>
        <input
          placeholder="First Name"
          type="text"
          id="firstName"
          name="firstName"
          onChange={nameHandler}
        />
      </div>
      <div className="input_wrapper">
        <label htmlFor="lastName">Last Name</label>
        <input
          placeholder="Last Name"
          type="text"
          id="lastName"
          name="lastNname"
          onChange={nameHandler}
        />
      </div>
      <div className="input_wrapper button_group">
        <label htmlFor="child">Child</label>
        <input
          id="child"
          type="radio"
          name="age_group"
          value="child"
          onChange={radioAgeChange}
        />
        <label htmlFor="youth">Youth</label>
        <input
          id="youth"
          type="radio"
          name="age_group"
          value="youth"
          onChange={radioAgeChange}
        />
        <label htmlFor="adult">Adult</label>
        <input
          id="adult"
          type="radio"
          name="age_group"
          value="adult"
          onChange={radioAgeChange}
        />
      </div>
      <div className="input_wrapper button_group">
        <label htmlFor="member">Member</label>
        <input
          type="radio"
          id="member"
          name="member_status"
          value="member"
          onChange={radioMemberChange}
        />
        <label htmlFor="visitor">Visitor</label>
        <input
          id="visitor"
          type="radio"
          name="member_status"
          value="visitor"
          onChange={radioMemberChange}
        />
      </div>

      <input type="submit" value="Submit" />
    </form>
  );
}
