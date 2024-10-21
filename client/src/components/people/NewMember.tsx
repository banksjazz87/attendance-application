import React, { useEffect, useState } from "react";
import { Attendee } from "../../types/interfaces.ts";
import { AttendantFormLayout } from "../../variables/newAttendantForm.ts";
import { AttendanceInputs } from "../../types/interfaces.ts";
import postData from "../../functions/api/post.ts";
import { APIResponse, APIAttendanceSheet, UpdateAttendant, NewMemberProps } from "../../types/interfaces.ts";
import "../../assets/styles/components/people/newMember.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export default function NewMember({ currentTable, show, showHandler, masterTable, triggerSuccessMessage, updateSuccessMessage, currentAttendanceColumn, updateLoadingStatus, updateData }: NewMemberProps): JSX.Element {
  const initAttendants: Attendee = {
    firstName: "",
    lastName: "",
    age: "",
    memberType: "",
    active: 1, 
    visitorInActive: 0
  };

  const [allAttendants, setAllAttendants] = useState<Attendee[]>([initAttendants]);
  const [newAttendant, setNewAttendant] = useState<Attendee>(initAttendants);

  //Get all of the attendants.
  useEffect((): void => {
    fetch("/all-attendants")
      .then((data) => data.json())
      .then((final) => {
        setAllAttendants(final.data);
      });
  }, []);


  //Set a new attendant's name.
  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAttendant({ ...newAttendant, [e.target.id]: e.target.value });
  };


  //Set a new attendant's age.
  const radioAgeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAttendant({ ...newAttendant, age: e.target.value });
  };


  //Set a new attendant's member type.
  const radioMemberChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewAttendant({ ...newAttendant, memberType: e.target.value });
  };


  //Returns an array of a match, or null.  If there's a match, the match is returned.
  const nameMatches = allAttendants.filter((x: Attendee, y: number): Attendee | null => {
    if (x.firstName.toLowerCase() === newAttendant.firstName.toLowerCase() && x.lastName.toLowerCase() === newAttendant.lastName.toLowerCase()) {
      return x;
    } else {
      return null;
    }
  });


  //Display the name fields for the new member.
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


  //Display the age fields for the new member.
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


  //Display the member fields for the new member.
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


  /**
   * 
   * @param obj object type of UpdateAttendant
   * @returns void
   * @description make a post request to add a new member.
   */
  const postNewAttendant = (obj: UpdateAttendant): void => {
    updateLoadingStatus();

    postData("/attendance/insert/attendant", obj).then((data: APIResponse): void => {
      if (data.message === "success") {
        (document.getElementById("new_member_form") as HTMLFormElement).reset();
        updateLoadingStatus();
        updateData();
        showHandler();
      } else {
        updateLoadingStatus();
        alert(`${data.data}`);
      }
    });
  }


  /**
   * 
   * @param obj object type of APIAttendanceSheet
   * @returns void
   * @description checks for a success message and updates the UI accordingly.
   */
  const addNewAttendantToSheet = (obj: APIAttendanceSheet): void => {
   if (obj && obj.message === "success") {
      let neededData: UpdateAttendant = {
        firstName: obj.data[0].firstName,
        lastName: obj.data[0].lastName,
        age: obj.data[0].age,
        attendantId: obj.data[0].id,
        memberType: obj.data[0].memberType,
        table: currentTable,
        attendanceColumn: currentAttendanceColumn
      }
      postNewAttendant(neededData);
    } else {
      alert(obj.data);
    }
  };


  /**
   * 
   * @param obj object type of APIResponse
   * @returns void
   * @description adds the new attendant to the currently displayed sheet.
   */
  const getAttendantDataAndSetIt = (obj: APIResponse): void => {
    if (obj.message === "Success") {
      fetch(`/get-attendant/${newAttendant.firstName}/${newAttendant.lastName}`)
        .then((data: Response): Promise<APIAttendanceSheet> => {
          return data.json();
        })
        .then((final: APIAttendanceSheet): void => {
          addNewAttendantToSheet(final);
        });
    } else {
      alert(obj.data);
    }
  };

 
  /**
   * 
   * @param e Form submit event
   * @returns void
   * @description Checks to see if the attendant already exists and alerts if that's the case, otherwise gets the information from the database and updates the UI.
   */
  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (nameMatches.length > 0) {
      alert(`${newAttendant.firstName} ${newAttendant.lastName} is already in the database`);
    } else {
      postData("/new-attendant", newAttendant).then((data: APIResponse) => {
        if (!masterTable) {
          triggerSuccessMessage();
          updateSuccessMessage(`${newAttendant.firstName} ${newAttendant.lastName} has been added.`);
          getAttendantDataAndSetIt(data);
        } else {
          updateLoadingStatus();
          updateData();
          showHandler();
          triggerSuccessMessage();
          updateSuccessMessage(`${newAttendant.firstName} ${newAttendant.lastName} has been added to the master table.`);
        }
        
      });
    }
  };

  return (
    <div
      className="full_height_popout"
      style={show ? { display: "" } : { display: "none" }}
    >
      <div id="new_attendant_form_wrapper">
        <button
          className="close_btn"
          onClick={(e: React.MouseEvent<HTMLButtonElement>): void => showHandler()}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
        <form
          method="post"
          action="/new-attendant"
          id="new_member_form"
          onSubmit={submitHandler}
          style={show ? { display: "" } : { display: "none" }}
        >
          <h2>Add New Member</h2>
          <div className="form_inner_wrapper">
            <h3>Name</h3>
            <div className="name_fields_wrapper fields_wrapper">{nameFields}</div>

            <h3>Age Group</h3>
            <div className="age_fields_wrapper fields_wrapper">{ageFields}</div>

            <h3>Member Status</h3>
            <div className="member_fields_wrapper fields_wrapper">{memberFields}</div>

            <input
              type="submit"
              value="Submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
