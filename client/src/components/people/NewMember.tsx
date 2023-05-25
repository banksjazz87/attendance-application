import React, { useEffect, useState } from "react";
import { Attendee } from "../../types/interfaces.ts";
import { AttendantFormLayout } from "../../variables/newAttendantForm.ts";
import { AttendanceInputs } from "../../types/interfaces.ts";
import postData from "../../functions/api/post.ts";
import { APIResponse, UpdateAttendant, NewMemberProps } from "../../types/interfaces.ts";

export default function NewMember({ currentTable }: NewMemberProps): JSX.Element {
  const initAttendants: Attendee = {
    firstName: "",
    lastName: "",
    age: "",
    memberType: "",
  };

  const initAddAttendant: UpdateAttendant = {
    firstName: "",
    lastName: "",
    attendantId: -1,
    table: "",
    presentValue: 0,
  };

  const [allAttendants, setAllAttendants] = useState<Attendee[]>([initAttendants]);
  const [newAttendant, setNewAttendant] = useState<Attendee>(initAttendants);
  const [addedAttendant, setAddedAttendant] = useState<UpdateAttendant>(initAddAttendant);

  useEffect((): void => {
    fetch("/all-attendants")
      .then((data) => data.json())
      .then((final) => {
        setAllAttendants(final.data);
        console.log(allAttendants);
      });
  }, []);

  useEffect((): void => {
    if (currentTable) {
      setAddedAttendant({ ...addedAttendant, table: currentTable });
    }
  }, [currentTable, addedAttendant]);

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAttendant({ ...newAttendant, [e.target.id]: e.target.value });
  };

  const radioAgeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAttendant({ ...newAttendant, age: e.target.value });
  };

  const radioMemberChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAttendant({ ...newAttendant, memberType: e.target.value });
  };

  const nameMatches = allAttendants.filter((x: Attendee, y: number): Attendee | null => {
    if (x.firstName.toLowerCase() === newAttendant.firstName.toLowerCase() && x.lastName.toLowerCase() === newAttendant.lastName.toLowerCase()) {
      return x;
    } else {
      return null;
    }
  });

  const nameFields: JSX.Element[] = AttendantFormLayout.name.map((x: AttendanceInputs, y: number): JSX.Element => {
    return (
      <div
        className="input_wrapper"
        key={`name_field_${y}`}
      >
        <label htmlFor={x.id}>{x.label}</label>
        <input
          placeholder={x.placeholder}
          type={x.type}
          id={x.id}
          name={x.name}
          onChange={nameHandler}
        />
      </div>
    );
  });

  const ageFields: JSX.Element[] = AttendantFormLayout.ageGroup.map((x: AttendanceInputs, y: number): JSX.Element => {
    return (
      <div
        className="input_wrapper"
        key={`name_field_${y}`}
      >
        <label htmlFor={x.id}>{x.label}</label>
        <input
          placeholder={x.placeholder}
          type={x.type}
          id={x.id}
          name={x.name}
          value={x.value}
          onChange={radioAgeChange}
        />
      </div>
    );
  });

  const memberFields: JSX.Element[] = AttendantFormLayout.memberStatus.map((x: AttendanceInputs, y: number): JSX.Element => {
    return (
      <div
        className="input_wrapper"
        key={`name_field_${y}`}
      >
        <label htmlFor={x.id}>{x.label}</label>
        <input
          placeholder={x.placeholder}
          type={x.type}
          id={x.id}
          name={x.name}
          value={x.value}
          onChange={radioMemberChange}
        />
      </div>
    );
  });

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (nameMatches.length > 0) {
      alert(`${newAttendant.firstName} ${newAttendant.lastName} is already in the database`);
    } else {
      postData("/new-attendant", newAttendant).then((data: APIResponse) => {
        if (data.message === "Success") {
          //get the new attendants information.
          fetch(`/get-attendant/${newAttendant.firstName}/${newAttendant.lastName}`)
            .then((data: Response): Promise<APIResponse> => {
              return data.json();
            })
            .then((final: APIResponse): void => {
              console.log(final);
            });
          /* (document.getElementById("new_member_form") as HTMLFormElement).reset();
          window.location.reload();*/
        } else {
          alert(`The following error has occurred ${data.data}`);
        }
      });
    }
  };

  return (
    <form
      method="post"
      action="/new-attendant"
      id="new_member_form"
      onSubmit={submitHandler}
    >
      <h2>Attendant's Name</h2>
      <div className="name_fields_wrapper fields_wrapper">{nameFields}</div>

      <h2>Attendant's Age Group</h2>
      <div className="age_fields_wrapper fields_wrapper">{ageFields}</div>

      <h2>Attendant's Member Status</h2>
      <div className="member_fields_wrapper fields_wrapper">{memberFields}</div>

      <input
        type="submit"
        value="Submit"
      />
    </form>
  );
}
