import React from "react";
import { AttendantFormLayout } from "../../variables/newAttendantForm.ts";
import { AttendanceInputs, Attendee, APIResponse } from "../../types/interfaces.ts";
import putData from "../../functions/api/put.ts";
import "../../assets/styles/components/people/editMember.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface EditMemberProps {
  show: boolean;
  editUser: Attendee;
  hideHandler: Function;
  updateName: Function;
  updateAge: Function;
  updateMember: Function;
}

export default function EditMember({ show, editUser, hideHandler, updateName, updateAge, updateMember }: EditMemberProps): JSX.Element {
  const updateAgeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log("This is the age value", e.target.value);
    updateAge(e.target.value);
  };

  const updateMemberHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log("This is the member value", e.target.value);
    updateMember(e.target.value);
  };

  const updateSubmitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    putData("/update-attendant", editUser).then((data: APIResponse): void => {
      if (data.message === "Success") {
        hideHandler();
        window.location.reload();
      } else {
        alert(data.error);
      }
    });
  };

  const returnNameFields: JSX.Element[] = AttendantFormLayout.name.map((x: AttendanceInputs, y: number): JSX.Element => {
    const key = x.id as string;
    return (
      <div
        className="input_wrapper"
        key={`name_field_${y}`}
      >
        <label htmlFor={x.id}>{x.label}</label>
        <input
          placeholder={x.placeholder}
          type={x.type}
          id={`edit_${x.id}`}
          name={`edit_${x.name}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            updateName(e.target.value, x.id);
          }}
          value={editUser[key as keyof Attendee]}
        />
      </div>
    );
  });

  const returnAgeFields: JSX.Element[] = AttendantFormLayout.ageGroup.map((x: AttendanceInputs, y: number): JSX.Element => {
    if (editUser.age === x.value) {
      return (
        <div
          className="input_wrapper"
          key={`name_field_${y}`}
        >
          <label htmlFor={x.id}>{x.label}</label>
          <input
            placeholder={x.placeholder}
            type={x.type}
            id={`edit_${x.id}`}
            name={`edit_${x.name}`}
            value={x.value}
            onChange={updateAgeHandler}
            checked
          />
        </div>
      );
    } else {
      return (
        <div
          className="input_wrapper"
          key={`name_field_${y}`}
        >
          <label htmlFor={x.id}>{x.label}</label>
          <input
            placeholder={x.placeholder}
            type={x.type}
            id={`edit_${x.id}`}
            name={`edit_${x.name}`}
            value={x.value}
            onChange={updateAgeHandler}
          />
        </div>
      );
    }
  });

  const returnMemberFields: JSX.Element[] = AttendantFormLayout.memberStatus.map((x: AttendanceInputs, y: number) => {
    if (editUser.memberType === x.value) {
      return (
        <div
          className="input_wrapper"
          key={`name_field_${y}`}
        >
          <label htmlFor={x.id}>{x.label}</label>
          <input
            placeholder={x.placeholder}
            type={x.type}
            id={`edit_${x.id}`}
            name={`edit_${x.name}`}
            value={x.value}
            onChange={updateMemberHandler}
            checked
          />
        </div>
      );
    } else {
      return (
        <div
          className="input_wrapper"
          key={`name_field_${y}`}
        >
          <label htmlFor={x.id}>{x.label}</label>
          <input
            placeholder={x.placeholder}
            type={x.type}
            id={`edit_${x.id}`}
            name={`edit_${x.name}`}
            value={x.value}
            onChange={updateMemberHandler}
          />
        </div>
      );
    }
  });

  return (
    <div
      className="full_height_popout"
      style={show ? { display: "" } : { display: "none" }}
    >
      <div id="edit_member_form_wrapper">
        <button
          className="close_btn"
          onClick={(e: React.MouseEvent<HTMLButtonElement>): void => hideHandler()}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
        <form
          id="edit_member_form"
          method="post"
          action="/update-attendant"
          onSubmit={updateSubmitHandler}
        >
          <div className="header_fields_wrapper">
            <h2>{`Edit ${editUser.firstName} ${editUser.lastName}`}</h2>
            <h3>Name</h3>
            <div className="name_fields_wrapper fields_wrapper">{returnNameFields}</div>
          </div>

          <div className="header_fields_wrapper">
            <h3>Age Group</h3>
            <div className="age_fields_wrapper fields_wrapper">{returnAgeFields}</div>
          </div>

          <div className="header_fields_wrapper">
            <h3>Member Status</h3>
            <div className="member_fields_wrapper fields_wrapper">{returnMemberFields}</div>
          </div>

          <input
            type="submit"
            value="Submit"
          />
        </form>
      </div>
    </div>
  );
}
