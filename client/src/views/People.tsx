import React, {useState, useEffect} from "react";
import Navbar from "../components/global/Navbar.tsx";
import NewMember from "../components/people/NewMember.tsx";
import AllPeople from "../components/people/AllPeople.tsx";
import {Attendee} from "../types/interfaces.ts";
import {APIPeople} from "../types/interfaces.ts";
import DeleteAlert from "../components/global/DeleteAlert.tsx";

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
        id: 0
    }
    const [people, setPeople] = useState<Attendee[]>([initAttendant]);

    const [userToDelete, setUserToDelete] = useState<Attendee>(initAttendant);

    const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);


    const deleteUserHandler = (obj: Attendee): void => {
        setShowDeleteAlert(true);
        setUserToDelete(obj);
    }

    const hideDeleteHandler = (): void => {
        setShowDeleteAlert(false);
    }

    useEffect((): void => {
        fetch('/all-attendants')
            .then((data: Response): Promise<APIPeople> => {
                return data.json();
            })
            .then((final: APIPeople): void => {
                if (final.message === "Success") {
                    setPeople(final.data)
                }
            });
    }, []);

    return (
        <div id="people_page_wrapper">
            <Navbar />
            <h1>This is where the user will be able to create, read, update and delete People</h1>
            <NewMember />
            <AllPeople
                allPeople={people}
                deletePersonHandler={deleteUserHandler} 
            />
            <DeleteAlert
                message={`Are sure that you would like to remove ${userToDelete.firstName} ${userToDelete.lastName} from the database?`} 
                url={`/remove-person/${userToDelete.firstName}/${userToDelete.lastName}/${userToDelete.id}`}
                show={showDeleteAlert}
                deleteUser={userToDelete}
                hideHandler={hideDeleteHandler}
            />
        </div>
    );
}