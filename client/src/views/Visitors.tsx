import React, {useState, useEffect} from "react";
import {Attendee, APITotalRows, APIPeople, VisitorShortFields, APIVisitorInit} from "../types/interfaces.ts";
import { InitAttendee } from "../variables/initAttendee.ts";
import Navbar from "../components/global/Navbar.tsx";
import "../assets/styles/views/people.scss";
import AllVisitors from "../components/visitors/AllVisitors.tsx";


export default function Vistors() {
    const [people, setPeople] = useState<Attendee[]>([InitAttendee]);
	const [totalDbRows, setTotalDbRows] = useState<number>(0);
	const [currentOffset, setCurrentOffset] = useState<number>(0);
	const [partialName, setPartialName] = useState<string>("");
	const [searching, setSearching] = useState<boolean>(false);

  //Set the initial offset for the pagination.
	const offSetIncrement: number = 10;


    //Get the total number of rows found
    useEffect((): void => {
        fetch(`/row-count/Visitor_Forms`)
            .then((data: Response): Promise<APITotalRows> => {
                return data.json();
            })
            .then((final: APITotalRows): void => {
                if (final.message === 'success') {
                    setTotalDbRows(final.data[0].total);
                } else {
                    console.error(final.message);
                }
            })
    }, [totalDbRows]);


    //Only get the current offset from the table.
    useEffect((): void => {
        fetch(`all-visitors/${offSetIncrement}/${currentOffset}`)
            .then((data: Response): Promise<APIVisitorInit> => {
                return data.json();
            })
                .then((final: APIVisitorInit): void => {
                    if (final.message === 'success') {
                        console.log(final);
                    }else {
                        alert(final.error);
                    }
                });
    }, []);

	// //Used to get the number of rows from the table.
	// useEffect((): void => {
	// 	fetch(`/all-visitors/${offSetIncrement}/${currentOffset}`)
	// 		.then((data: Response): Promise<APITotalRows> => {
	// 			return data.json();
	// 		})
	// 		.then((final: APITotalRows): void => {
	// 			if (final.message === "success") {
	// 				setTotalDbRows(final.data[0].total);
	// 			}
	// 		});
	// }, [totalDbRows]);

	// //Used to check if there is a current partial name search.
	// useEffect((): void => {
	// 	if (partialName.length > 0) {
	// 		setSearching(true);
	// 		fetch(`/people/search/Attendants/${partialName}`)
	// 			.then((data: Response): Promise<APIPeople> => {
	// 				return data.json();
	// 			})
	// 			.then((final: APIPeople): void => {
	// 				if (final.message === "success") {
	// 					setPeople(final.data);
	// 				}
	// 			});
	// 	} else {
	// 		setSearching(false);
	// 		fetch(`/table-return-few/Attendants/${offSetIncrement}/${currentOffset}/lastName/ASC`)
	// 			.then((data: Response): Promise<APIPeople> => {
	// 				return data.json();
	// 			})
	// 			.then((final: APIPeople): void => {
	// 				if (final.message === "success") {
	// 					setPeople(final.data);
	// 				}
	// 			});
	// 	}
	// }, [currentOffset, partialName]);

	
	//Used to update the partialName state in the search bar.
	const updatePartialName = (string: string): void => {
		setPartialName(string);
	};

	return (
		<div id="people_page_wrapper">
			<Navbar />
			<div className="header_wrapper">
				<h1>Visitors</h1>
			</div>
			<div id="people_content_wrapper">

                <p>{`The total count for this table is ${totalDbRows}`}</p>
				{/* <AllPeople
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
				<EditMember
					show={showEditUser}
					editUser={userToEdit}
					hideHandler={hideEditUser}
					updateName={updateEditName}
					updateAge={updateEditAge}
					updateMember={updateEditMember}
					updateActiveStatus={updateEditMemberStatus}
					triggerSuccessMessage={() => setShowSuccessMessage(true)}
					updateSuccessMessage={updateSuccessMessageText}
				/> */}

                {/* <AllVisitors 
                    allPeople={people}
					totalRows={totalDbRows}
					updateOffsetHandler={(num: number): void => {
						setCurrentOffset(num);
					}}
					offSetIncrement={0}
					updatePartial={updatePartialName}
					activeSearch={searching}
                
                /> */}
			</div>
		</div>
	);
}