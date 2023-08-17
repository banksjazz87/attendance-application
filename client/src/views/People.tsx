import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import NewMember from "../components/people/NewMember.tsx";
import { InitAttendee } from "../variables/initAttendee.ts";
import AllPeople from "../components/people/AllPeople.tsx";
import { Attendee, APIPeople, APITotalRows } from "../types/interfaces.ts";
import DeleteAlert from "../components/global/DeleteAlert.tsx";
import EditMember from "../components/people/EditMember.tsx";
import "../assets/styles/views/people.scss";
import TextAndIconButton from "../components/global/TextAndIconButton.tsx";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function People() {
  const [people, setPeople] = useState<Attendee[]>([InitAttendee]);
  const [userToDelete, setUserToDelete] = useState<Attendee>(InitAttendee);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [showEditUser, setShowEditUser] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<Attendee>(InitAttendee);
  const [showAddMember, setShowAddMember] = useState<boolean>(false);
  const [totalDbRows, setTotalDbRows] = useState<number>(0);
  const [currentOffset, setCurrentOffset] = useState<number>(0);
  const [partialName, setPartialName] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);

  const offSetIncrement: number = 10;

  //Used to get the number of rows from the table.
  useEffect((): void => {
    fetch(`/row-count/Attendants`)
      .then((data: Response): Promise<APITotalRows> => {
        return data.json();
      })
      .then((final: APITotalRows): void => {
        if (final.message === "success") {
          setTotalDbRows(final.data[0].total);
        }
      });
  }, [totalDbRows]);

  useEffect((): void => {
    if (partialName.length > 0) {
      setSearching(true);
      console.log(partialName);
      fetch(`/people/search/Attendants/${partialName}`)
        .then((data: Response): Promise<APIPeople> => {
          return data.json();
        })
        .then((final: APIPeople): void => {
          if (final.message === 'success') {
            setPeople(final.data)
          }
        });

    } else {
      setSearching(false);
    fetch(`/table-return-few/Attendants/${offSetIncrement}/${currentOffset}/lastName/ASC`)
      .then((data: Response): Promise<APIPeople> => {
        return data.json();
      })
      .then((final: APIPeople): void => {
        if (final.message === "success") {
          setPeople(final.data);
        }
      });
    }
  }, [currentOffset, partialName]);

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

  const displayAddMember = (): void => {
    if (showAddMember) {
      setShowAddMember(false);
    } else {
      setShowAddMember(true);
    }
  };

  const updatePartialName = (string: string): void => {
    setPartialName(string);
  }

  return (
    <div id="people_page_wrapper">
      <Navbar />
      <div className="header_wrapper">
        <h1>People</h1>
      </div>
      <div id="people_content_wrapper">
        <TextAndIconButton
          show={true}
          text="Add New Member"
          iconName={faUserPlus}
          clickHandler={() => displayAddMember()}
        />
        <NewMember
          show={showAddMember}
          showHandler={displayAddMember}
        />
        <AllPeople
          allPeople={people}
          deletePersonHandler={deleteUserHandler}
          editPersonHandler={editUserHandler}
          totalRows={totalDbRows}
          updateOffsetHandler={(num: number): void => {
            setCurrentOffset(num);
          }}
          offSetIncrement={offSetIncrement}
          updatePartial={updatePartialName}
          activeSearch={searching}
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
