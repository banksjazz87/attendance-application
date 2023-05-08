import React from "react";
import { AttendantFormLayout } from "../../variables/newAttendantForm.ts";
import { AttendanceInputs, Attendee, APIResponse } from "../../types/interfaces.ts";
import putData from "../../functions/api/put.ts";

interface EditMemberProps {
  show: boolean;
  editUser: Attendee;
  hideHandler: Function;
  updateName: Function;
  updateAge: Function;
  updateMember: Function;
}

export default function EditMember({show, editUser, hideHandler, updateName, updateAge, updateMember}: EditMemberProps): JSX.Element {

  const updateAgeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateAge(e.target.id);
  }

  const updateMemberHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateMember(e.target.id);
  }

  const updateSubmitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    putData('/update-attendant', editUser)
        .then((data: APIResponse): void => {
            if (data.message === "Success") {
                hideHandler();
                window.location.reload();
            } else {
                alert(data.error)
            }
        });
  }

  const returnNameFields: JSX.Element[] = AttendantFormLayout.name.map(
    (x: AttendanceInputs, y: number): JSX.Element => {
        const key = x.id as string;
      return (

        <div className="input_wrapper" key={`name_field_${y}`}>
          <label htmlFor={x.id}>{x.label}</label>
          <input
            placeholder={x.placeholder}
            type={x.type}
            id={x.id}
            name={x.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              updateName(e.target.value, x.id);
            }}
            value={editUser[key as keyof Attendee]}
          />
        </div>
      );
    }
  );

  const returnAgeFields: JSX.Element[] = AttendantFormLayout.ageGroup.map(
    (x: AttendanceInputs, y: number): JSX.Element => {
      const key = x.id as string;

      if (editUser[key as keyof Attendee] === 1) {
        return (
          <div className="input_wrapper" key={`name_field_${y}`}>
            <label htmlFor={x.id}>{x.label}</label>
            <input
              placeholder={x.placeholder}
              type={x.type}
              id={x.id}
              name={x.name}
              onChange={updateAgeHandler}
              checked
            />
          </div>
        );
      } else {
        return (
          <div className="input_wrapper" key={`name_field_${y}`}>
            <label htmlFor={x.id}>{x.label}</label>
            <input
              placeholder={x.placeholder}
              type={x.type}
              id={x.id}
              name={x.name}
              onChange={updateAgeHandler}
            />
          </div>
        );
      }
    }
  );

  const returnMemberFields: JSX.Element[] =
    AttendantFormLayout.memberStatus.map((x: AttendanceInputs, y: number) => {
      const key = x.id as string;

      if (editUser[key as keyof Attendee] === 1) {
        return (
          <div className="input_wrapper" key={`name_field_${y}`}>
            <label htmlFor={x.id}>{x.label}</label>
            <input
              placeholder={x.placeholder}
              type={x.type}
              id={x.id}
              name={x.name}
              onChange={updateMemberHandler}
              checked
            />
          </div>
        );
      } else {
        return (
          <div className="input_wrapper" key={`name_field_${y}`}>
            <label htmlFor={x.id}>{x.label}</label>
            <input
              placeholder={x.placeholder}
              type={x.type}
              id={x.id}
              name={x.name}
              onChange={updateMemberHandler}
            />
          </div>
        );
      }
    });

  return (
    <form
      id="edit_member_form"
      method="post"
      action="/update-attendant"
      style={show ? { display: "" } : { display: "none" }}
      onSubmit={updateSubmitHandler}
    >
      {returnNameFields}
      {returnAgeFields}
      {returnMemberFields}
      <input type="submit" value="Submit" />
    </form>
  );
}
