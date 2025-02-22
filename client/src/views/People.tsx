import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import SuccessMessage from "../components/global/SuccessMessage.tsx";
import NewMember from "../components/people/NewMember.tsx";
import { InitAttendee } from "../variables/initAttendee.ts";
import AllPeople from "../components/people/AllPeople.tsx";
import { Attendee, APIPeople, APITotalRows, APIResponse } from "../types/interfaces.ts";
import DeleteAlert from "../components/global/DeleteAlert.tsx";
import EditMember from "../components/people/EditMember.tsx";
import "../assets/styles/views/people.scss";
import TextAndIconButton from "../components/global/TextAndIconButton.tsx";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import LoadingBar from "../components/global/LoadingBar.tsx";

export default function People() {

	const [people, setPeople] = useState<Attendee[]>([InitAttendee]);
	const [userToDelete, setUserToDelete] = useState<Attendee>(InitAttendee);
	const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
	const [showEditUser, setShowEditUser] = useState<boolean>(false);
	const [userToEdit, setUserToEdit] = useState<Attendee>(InitAttendee);
	const [showAddMember, setShowAddMember] = useState<boolean>(false);
	const [totalDbRows, setTotalDbRows] = useState<number>(0);
	const [currentOffset, setCurrentOffset] = useState<number>(0);
	const [partialName, setPartialName] = useState<string>("");
	const [searching, setSearching] = useState<boolean>(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
	const [successMessageText, setSuccessMessageText] = useState<string>("TESTING");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [dataUpdated, setUpdatedData] = useState<boolean>(false);
	const [deleteUserURL, setDeleteUserURL] = useState<string>(`/remove-person/${userToDelete.firstName}/${userToDelete.lastName}/${userToDelete.id}`);
	const [isMasterVisitor, setIsMasterVisitor] = useState<boolean>(false);

	//Urls that will be used to delete the user, we're using different urls based on if they're visitors or not and also if they're master visitors.
	const removePersonURL: string = `/remove-person/${userToDelete.firstName}/${userToDelete.lastName}/${userToDelete.id}`;
	const removeVisitorURL: string = `/remove-non-master-visitor-from-attendance/${userToDelete.id}/${userToDelete.firstName}/${userToDelete.lastName}`;
	const updateMasterVisitorURL: string = `/set-master-visitor-to-inactive/`;

	//Set the initial offset for the pagination.
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

	/**
	 *
	 * @param offSet number, pass in the state for offSetIncrement within the useEffect
	 * @param currentOffset number, pass in the state for the currentOffset with the useEffect
	 * @returns Promise<void>
	 * @description used to get the people data
	 */
	const getPeopleData = async (offSet: number, currentOffset: number): Promise<void> => {
		const tableData: Response = await fetch(`/table-return-few/Attendants/${offSet}/${currentOffset}/lastName/ASC`);
		const tableJSON: APIPeople = await tableData.json();

		try {
			if (tableJSON.message === "success") {
				setPeople(tableJSON.data);
				setSearching(false);
			} else {
				setSearching(false);
				alert("/table-return-few error " + tableJSON.error);
			}
		} catch (e) {
			console.warn("Error with the /table-return-few", e);
		}
	};

	//Used to check if there is a current partial name search.
	useEffect((): void => {
		if (partialName.length > 0) {
			setSearching(true);
			fetch(`/people/search/Attendants/${partialName}`)
				.then((data: Response): Promise<APIPeople> => {
					return data.json();
				})
				.then((final: APIPeople): void => {
					if (final.message === "success") {
						setPeople(final.data);
					}
				});
		} else {
			setSearching(false);
			getPeopleData(offSetIncrement, currentOffset);
		}
	}, [currentOffset, partialName]);

	//Using this to refresh the content after updating a person.
	useEffect((): void => {
		if (dataUpdated) {
			setSearching(false);
			getPeopleData(offSetIncrement, currentOffset).then((data: void) => {
				setUpdatedData(false);
				setTimeout((): void => {
					setIsLoading(false);
				}, 200);
			});
		}
	}, [dataUpdated, offSetIncrement, currentOffset]);

	const isVisitor = async (table: string, id: string): Promise<boolean | undefined> => {
		const data: Response = await fetch(`/get-visitor-by-id/${table}/${id}`);
		const final: APIResponse = await data.json();

		try {
			if (final.message !== "failure") {
				if (final.data.length > 0) {
					return true;
				} else {
					return false;
				}
			}
		} catch (e: any) {
			console.log("An error occurred: ", e);
		}
	};

	//Check to see if the selected user to delete is a visitor, and if so, which kind.  We will update the delete URL once we establish what kind of Attendant they are.
	useEffect((): void => {
		if (userToDelete.id && userToDelete.id !== 0) {
			const stringOfId: string = userToDelete.id.toString();
			setIsMasterVisitor(false);

			Promise.all([
				isVisitor("Visitor_Children", stringOfId),
				isVisitor("Visitor_Spouse", stringOfId),
				isVisitor("Visitor_Forms", stringOfId)
			])
				.then((data: [boolean | undefined, boolean | undefined, boolean | undefined]): void => {
					const trueIndex: number = data.indexOf(true);
					
					if (trueIndex > -1 && trueIndex === 2) {
						//This is the master user, we're just going to update they're status, so that the form data persists.
						setIsMasterVisitor(true);
						setDeleteUserURL(updateMasterVisitorURL);

					} else if (trueIndex > -1) {
						//Non master visitor
						setDeleteUserURL(removeVisitorURL);
						
					} else {
						//Normal attendant, that has no visitor form data.
						setDeleteUserURL(removePersonURL);
					}
				})
				.catch((err: APIResponse): void => {
					console.warn("An error occurrred ", err.error);
				});
		}
	}, [userToDelete]);

	//Used to delete an attendant.
	const deleteUserHandler = (obj: Attendee): void => {
		setShowDeleteAlert(true);
		setUserToDelete(obj);
	};

	//Used to hide the delete alert.
	const hideDeleteHandler = (): void => {
		setShowDeleteAlert(false);
	};

	//Used to hide the edit form.
	const hideEditUser = (): void => {
		setShowEditUser(false);
	};

	//Used to edit a user, shows the edit form and updates the user to the selected attendant.
	const editUserHandler = (obj: Attendee): void => {
		setShowEditUser(true);
		setUserToEdit(obj);
	};

	//Used to edit the name of an attendant.
	const updateEditName = (value: string, field: string): void => {
		setUserToEdit({ ...userToEdit, [field]: value });
	};

	//Used to edit the age of an attendant.
	const updateEditAge = (elementValue: string): void => {
		setUserToEdit({ ...userToEdit, age: elementValue });
	};

	//Used to update an attendant's member type.
	const updateEditMember = (elementValue: string): void => {
		setUserToEdit({ ...userToEdit, memberType: elementValue });
	};

	//Used to update an attendant's active status.
	const updateEditMemberStatus = (elementValue: string): void => {
		setUserToEdit({ ...userToEdit, active: parseInt(elementValue) });
	};

	//Displays the option to add a member.
	const displayAddMember = (): void => {
		if (showAddMember) {
			setShowAddMember(false);
		} else {
			setShowAddMember(true);
		}
	};

	//Used to update the partialName state in the search bar.
	const updatePartialName = (string: string): void => {
		setPartialName(string);
	};

	//Used to update the success message text.
	const updateSuccessMessageText = (str: string): void => {
		setSuccessMessageText(str);
	};

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
					clickHandler={(): void => displayAddMember()}
					classes="single_btn add_new_member_btn"
				/>
				<NewMember
					show={showAddMember}
					showHandler={(): void => setShowAddMember(false)}
					currentTable={"Attendants"}
					masterTable={true}
					triggerSuccessMessage={(): void => setShowSuccessMessage(true)}
					updateSuccessMessage={updateSuccessMessageText}
					updateLoadingStatus={(): void => setIsLoading(!isLoading)}
					updateTheData={(): void => setUpdatedData(true)}
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
					url={deleteUserURL}
					show={showDeleteAlert}
					deleteUser={userToDelete}
					hideHandler={hideDeleteHandler}
					triggerSuccessMessage={(): void => setShowSuccessMessage(true)}
					updateSuccessMessage={updateSuccessMessageText}
					deleteBody={{}}
					updateLoadingStatus={(): void => setIsLoading(!isLoading)}
					updateTheData={(): void => setUpdatedData(true)}
					isMasterVisitor={isMasterVisitor}
				/>
				<EditMember
					show={showEditUser}
					editUser={userToEdit}
					hideHandler={hideEditUser}
					updateName={updateEditName}
					updateAge={updateEditAge}
					updateMember={updateEditMember}
					updateActiveStatus={updateEditMemberStatus}
					triggerSuccessMessage={(): void => setShowSuccessMessage(true)}
					updateSuccessMessage={updateSuccessMessageText}
					updateLoadingStatus={(): void => setIsLoading(!isLoading)}
					updateTheData={(): void => setUpdatedData(true)}
				/>
				<SuccessMessage
					message={successMessageText}
					show={showSuccessMessage}
					closeMessage={(): void => setShowSuccessMessage(false)}
				/>

				<LoadingBar show={isLoading} />
			</div>
		</div>
	);
}
