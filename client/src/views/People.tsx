import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import NewMember from "../components/people/NewMember.tsx";
import AllPeople from "../components/people/AllPeople.tsx";
import { Attendee, APIPeople } from "../types/interfaces.ts";
import DeleteAlert from "../components/global/DeleteAlert.tsx";
import EditMember from "../components/people/EditMember.tsx";
import "../assets/styles/views/people.scss";

export default function People() {
  const initAttendant: Attendee = {
    firstName: "",
    lastName: "",
    age: "",
    memberType: "",
    id: 0,
  };

  const [people, setPeople] = useState<Attendee[]>([initAttendant]);
  const [userToDelete, setUserToDelete] = useState<Attendee>(initAttendant);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [showEditUser, setShowEditUser] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<Attendee>(initAttendant);

  const deleteUserHandler = (obj: Attendee): void => {
    setShowDeleteAlert(true);
    setUserToDelete(obj);
  };

  const hideDeleteHandler = (): void => {
    setShowDeleteAlert(false);
  };

  const hideEditUser = (): void => {
    setShowEditUser(false);
  };

  const editUserHandler = (obj: Attendee): void => {
    setShowEditUser(true);
    setUserToEdit(obj);
  };

  const updateEditName = (value: string, field: string): void => {
    setUserToEdit({ ...userToEdit, [field]: value });
  };

  const updateEditAge = (elementValue: string): void => {
    setUserToEdit({ ...userToEdit, age: elementValue });
  };

  const updateEditMember = (elementValue: string): void => {
    setUserToEdit({ ...userToEdit, memberType: elementValue });
  };

  useEffect((): void => {
    fetch("/all-attendants")
      .then((data: Response): Promise<APIPeople> => {
        return data.json();
      })
      .then((final: APIPeople): void => {
        if (final.message === "Success") {
          setPeople(final.data);
        }
      });
  }, []);

  return (
    <div id="people_page_wrapper">
      <Navbar />
      <div className="header_wrapper">
        <h1>People</h1>
      </div>
      <div id="people_content_wrapper">
        <NewMember />
        <AllPeople
          allPeople={people}
          deletePersonHandler={deleteUserHandler}
          editPersonHandler={editUserHandler}
        />
        <DeleteAlert
          message={`Are sure that you would like to remove ${userToDelete.firstName} ${userToDelete.lastName} from the database?`}
          url={`/remove-person/${userToDelete.firstName}/${userToDelete.lastName}/${userToDelete.id}`}
          show={showDeleteAlert}
          deleteUser={userToDelete}
          hideHandler={hideDeleteHandler}
        />
        <EditMember
          show={showEditUser}
          editUser={userToEdit}
          hideHandler={hideEditUser}
          updateName={updateEditName}
          updateAge={updateEditAge}
          updateMember={updateEditMember}
        />
      </div>
    </div>
  );
}
