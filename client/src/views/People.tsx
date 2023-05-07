import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import NewMember from "../components/people/NewMember.tsx";
import AllPeople from "../components/people/AllPeople.tsx";
import { Attendee, APIPeople } from "../types/interfaces.ts";
import DeleteAlert from "../components/global/DeleteAlert.tsx";
import EditMember from "../components/people/EditMember.tsx";

export default function People() {
  const initAttendant: Attendee = {
    firstName: "",
    lastName: "",
    adult: 0,
    child: 0,
    youth: 0,
    member: 0,
    visitor: 0,
    present: 0,
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

  const updateEditAge = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserToEdit({ ...userToEdit, child: 0, youth: 0, adult: 0 });
    setUserToEdit({ ...userToEdit, [e.target.id]: 1 });
  };

  const updateEditMember = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserToEdit({ ...userToEdit, member: 0, visitor: 0 });
    setUserToEdit({ ...userToEdit, [e.target.id]: 1 });
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
      <h1>
        This is where the user will be able to create, read, update and delete
        People
      </h1>
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
  );
}
