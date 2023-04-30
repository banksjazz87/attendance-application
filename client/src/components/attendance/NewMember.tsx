import React, { useEffect, useState } from "react";
import { Attendee } from "../../types/interfaces.ts";

export default function NewMember(): JSX.Element {
  const [allAttendants, setAllAttendants] = useState<Attendee[]>([{
    firstName: "", 
    lastName: "", 
    adult: 0,
    child: 0,
    youth: 0,
    member: 0, 
    visitor: 0,
  }]);

  const [newAttendant, setNewAttendant] = useState<Attendee>({
    firstName: "",
    lastName: "", 
    adult: 0,
    child: 0,
    youth: 0,
    member: 0,
    visitor: 0
  });

  /*useEffect((): void => {
    fetch("/all-attendants")
      .then((data) => data.json())
      .then((final: Attendee[]) => {
        setAllAttendants(final);
        console.log(final);
      });
  }, []);*/

  const firstNameHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAttendant({...newAttendant, firstName: e.target.value});
  }

  const lastNameHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAttendant({...newAttendant, lastName: e.target.value});
  }

  const radioClick = (e: React.FormEvent<HTMLInputElement>): void => {
    alert('Clicked');
  }

  
  
  return (
    <form id="new_member_form">
      <div className="input_wrapper">
        <label htmlFor="first_name">First Name</label>
        <input
          placeholder="First Name"
          type="text"
          id="first_name"
          name="first_name"
          onChange={firstNameHandler}
        />
      </div>
      <div className="input_wrapper">
        <label htmlFor="last_name">Last Name</label>
        <input
          placeholder="Last Name"
          type="text"
          id="last_name"
          name="last_name"
          onChange={lastNameHandler}
        />
      </div>
      <div className="input_wrapper button_group">
        <label htmlFor="child">Child</label>
        <input id="child" type="radio" name="age_group" value="child" onClick={radioClick}/>
        <label htmlFor="youth">Youth</label>
        <input id="youth" type="radio" name="age_group" value="youth" />
        <label htmlFor="adult">Adult</label>
        <input id="adult" type="radio" name="age_group" value="adult" />
      </div>
      <div className="input_wrapper button_group">
        <label htmlFor="member">Member</label>
        <input type="radio" id="member" name="member_status" value="member" />
        <label htmlFor="visitor">Visitor</label>
        <input id="visitor" type="radio" name="member_status" value="visitor" />
      </div>
      <input type="submit" value="Submit" />
    </form>
  );
}
