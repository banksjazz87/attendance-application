import React, { useState, useEffect } from "react";
import { APITotalRows, VisitorShortFields, APIVisitorInit, AllVisitorData, AllVisitorAPIData } from "../types/interfaces.ts";
import { initShortVisitor } from "../variables/initShortVisitor.ts";
import Navbar from "../components/global/Navbar.tsx";
import "../assets/styles/views/people.scss";
import AllVisitors from "../components/visitors/AllVisitors.tsx";
import VisitorModal from "../components/visitors/VisitorModal.tsx";
import "../assets/styles/views/visitors.scss";
import { initVisitorData } from "../variables/initVisitorData";
import DeleteAlert from "../components/global/DeleteAlert.tsx";
import SuccessMessage from "../components/global/SuccessMessage.tsx";

export default function Vistors() {
	const [visitors, setVisitors] = useState<VisitorShortFields[]>([initShortVisitor]);
	const [totalDbRows, setTotalDbRows] = useState<number>(0);
	const [currentOffset, setCurrentOffset] = useState<number>(0);
	const [partialName, setPartialName] = useState<string>("");
	const [searching, setSearching] = useState<boolean>(false);
	const [selectedVisitorId, setSelectedVisitorId] = useState<number>(-1);
	const [selectedVisitorData, setSelectedVisitorData] = useState<AllVisitorData>(initVisitorData);
	const [showFormModal, setShowFormModal] = useState<boolean>(false);
	const [userToDelete, setUserToDelete] = useState<VisitorShortFields>(initShortVisitor);
	const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
	const [successMessageText, setSuccessMessageText] = useState<string>("TESTING");

	//Set the initial offset for the pagination.
	const offSetIncrement: number = 10;

	//Get the total number of rows found
	useEffect((): void => {
		fetch(`/row-count/Visitor_Forms`)
			.then((data: Response): Promise<APITotalRows> => {
				return data.json();
			})
			.then((final: APITotalRows): void => {
				if (final.message === "success") {
					setTotalDbRows(final.data[0].total);
				} else {
					console.error(final.error ? final.error : "An error occurred.");
				}
			});
	}, [totalDbRows]);

	//Used to check if there is a current partial name search.
	useEffect((): void => {
		if (partialName.length > 0) {
			setSearching(true);
			fetch(`/people/search/Visitor_Forms/${partialName}`)
				.then((data: Response): Promise<APIVisitorInit> => {
					return data.json();
				})
				.then((final: APIVisitorInit): void => {
					if (final.message === "success") {
						setVisitors(final.data);
					} else {
						console.error(final.error ? final.error : "An error occurred.");
					}
				});
		} else {
			setSearching(false);
			fetch(`/table-return-few/Visitor_Forms/${offSetIncrement}/${currentOffset}/dateCreated/DESC`)
				.then((data: Response): Promise<APIVisitorInit> => {
					return data.json();
				})
				.then((final: APIVisitorInit): void => {
					if (final.message === "success") {
						setVisitors(final.data);
					} else {
						console.error(final.error ? final.error : "an error occurred");
					}
				});
		}
	}, [currentOffset, partialName]);

	//Used to get the current selected visitor id.
	useEffect((): void => {
		if (selectedVisitorId !== -1) {
			fetch(`/all-visitor-data/${selectedVisitorId}`)
				.then((data: Response): Promise<AllVisitorAPIData> => {
					return data.json();
				})
				.then((final: AllVisitorAPIData): void => {
					if (final.message === "success") {
						setSelectedVisitorData({ ...selectedVisitorData, form: final.data.form, children: final.data.children, interests: final.data.interests, spouse: final.data.spouse });
						setShowFormModal(true);
					} else {
						console.error(final.error ? "This failed " + final.error : "An error occurred.");
					}
				});
		}
	}, [selectedVisitorId]);

	//Used to update the partialName state in the search bar.
	const updatePartialName = (string: string): void => {
		setPartialName(string);
	};

	//Used to get the id of the current user.
	const updateSelectedVisitor = (id: number): void => {
		if (id === selectedVisitorId) {
			setShowFormModal(true);
		} else {
			setSelectedVisitorId(id);
		}
	};

	//Used to delete an attendant.
	const deleteUserHandler = (obj: VisitorShortFields): void => {
		setShowDeleteAlert(true);
		setUserToDelete(obj);
	};

	//Used to update the success message text.
	const updateSuccessMessageText = (str: string): void => {
		setSuccessMessageText(str);
	};

	return (
		<div id="visitor_page_wrapper">
			<Navbar />
			<div className="header_wrapper">
				<h1>Visitors</h1>
			</div>
			<div id="visitor_content_wrapper">
				<AllVisitors
					allVisitors={visitors}
					totalRows={totalDbRows}
					updateOffsetHandler={(num: number): void => {
						setCurrentOffset(num);
					}}
					offSetIncrement={offSetIncrement}
					updatePartial={updatePartialName}
					activeSearch={searching}
					visitorSelector={updateSelectedVisitor}
					deletePersonHandler={deleteUserHandler}
				/>

				<DeleteAlert
					message={`Are sure that you would like to remove ${userToDelete.firstName} ${userToDelete.lastName} from the database?`}
					url={`/remove-person/${userToDelete.firstName}/${userToDelete.lastName}/${userToDelete.id}`}
					show={showDeleteAlert}
					deleteUser={userToDelete}
					hideHandler={(): void => setShowDeleteAlert(false)}
					triggerSuccessMessage={() => setShowSuccessMessage(true)}
					updateSuccessMessage={updateSuccessMessageText}
				/>

				<SuccessMessage
					message={successMessageText}
					show={showSuccessMessage}
					closeMessage={() => setShowSuccessMessage(false)}
				/>

				<VisitorModal
					showModal={showFormModal}
					hideModal={(): void => setShowFormModal(false)}
					formData={selectedVisitorData}
				/>
			</div>
		</div>
	);
}
