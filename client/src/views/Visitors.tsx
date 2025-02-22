import React, { useState, useEffect } from "react";
import { APITotalRows, VisitorShortFields, APIVisitorInit, AllVisitorData, AllVisitorAPIData, ChildrenSpouseApiResponse, ChildrenSpouseData} from "../types/interfaces.ts";
import { initShortVisitor } from "../variables/initShortVisitor.ts";
import Navbar from "../components/global/Navbar.tsx";
import "../assets/styles/views/people.scss";
import AllVisitors from "../components/visitors/AllVisitors.tsx";
import VisitorModal from "../components/visitors/VisitorModal.tsx";
import "../assets/styles/views/visitors.scss";
import { initVisitorData } from "../variables/initVisitorData";
import DeleteAlert from "../components/global/DeleteAlert.tsx";
import SuccessMessage from "../components/global/SuccessMessage.tsx";
import FormDeleteModal from "../components/visitors/FormDeleteModal.tsx";
import LoadingBar from "../components/global/LoadingBar.tsx";


export default function Vistors(): JSX.Element {
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
	const [deleteFamilyData, setDeleteFamilyData] = useState<ChildrenSpouseData>({
		attendantIds: [{ id: -1 }],
		childIds: [{ childId: -1 }],
		spouseIds: [{ spouseId: -1 }]
	});
	const [showFormDeleteModal, setShowFormDeleteModal] = useState<boolean>(false);
	const [deleteAllFields, setDeleteAllFields] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [dataUpdated, setUpdatedData] = useState<boolean>(false);

	//Set the initial offset for the pagination.
	const offSetIncrement: number = 10;

	/**
	 * 
	 * @param increment number
	 * @param offset number
	 * @returns Promise<void>
	 * @description This updates the visitors data point, which is displayed as a table.
	 */
	const getVisitorTable = async (increment: number, offset: number): Promise<void> => {
		const table: Response = await fetch(`/table-return-few/Visitor_Forms/${increment}/${offset}/dateCreated/DESC`);
		const tableJSON: APIVisitorInit = await table.json();

		try {
			if (tableJSON.message === "success") {
				setVisitors(tableJSON.data);
			} else {
				console.error(tableJSON.error ? tableJSON.error : "An error occurred.");
			}
		} catch (e) {
			console.error("Error occurred with the /table-return-few/ endpoint ", e);
		}
	};

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
			getVisitorTable(offSetIncrement, currentOffset);
		}
	}, [currentOffset, partialName]);


	//Update the visitor table after the table has been udpated.
	useEffect((): void => {
		if (dataUpdated) {
			getVisitorTable(offSetIncrement, currentOffset)
				.then(data => {
					setUpdatedData(false);
					setIsLoading(false);
				});
		}
	}, [dataUpdated, isLoading, currentOffset]);
	

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


	//Update the family data when the user to delete has been updated.
	useEffect((): void => {
		const userId: number = userToDelete.id;

		if (userId !== -1) {
			fetch(`/children-spouse-ids/${userToDelete.id}`)
				.then((data: Response): Promise<ChildrenSpouseApiResponse> => {
					return data.json();
				})
				.then((final: ChildrenSpouseApiResponse): void => {
					if (final.message === 'success') {

						const familyData: ChildrenSpouseData  = final.data;
						setDeleteFamilyData({
							...deleteFamilyData,
							attendantIds: familyData.attendantIds,
							childIds: familyData.childIds,
							spouseIds: familyData.spouseIds,
						});
					} else {
						console.log('an error occurred ', final);
					}
				})
		}
	}, [userToDelete]);


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
		// setShowDeleteAlert(true);
		setShowFormDeleteModal(true);
		setUserToDelete(obj);
	};

	//Used to update the success message text.
	const updateSuccessMessageText = (str: string): void => {
		setSuccessMessageText(str);
	};


	//Used to extract the family ids
	const getIdValues = (obj: Object[], key: string): string[] => {
		const values = obj.map((x: Object) => {
			let id = x[key as keyof Object].toString();
			return id;
		});
		return values;
	}

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

				<FormDeleteModal
					show={showFormDeleteModal}
					hideHandler={() => setShowFormDeleteModal(false)}
					deleteAllHandler={() => {
						setDeleteAllFields(true);
						setShowDeleteAlert(true);
						setShowFormDeleteModal(false);
					}}
					deleteFormOnlyHandler={() => {
						setDeleteAllFields(false);
						setShowDeleteAlert(true);
						setShowFormDeleteModal(false);
					}}
					userName={`${userToDelete.firstName} ${userToDelete.lastName}`}
				/>

				<DeleteAlert
					message={`Are sure that you would like to remove ${userToDelete.firstName} ${userToDelete.lastName} from the database?`}
					url={deleteAllFields ? `/remove-all-visitor-data/` : "/remove-visitor-form-data/"}
					show={showDeleteAlert}
					deleteUser={userToDelete}
					hideHandler={(): void => setShowDeleteAlert(false)}
					triggerSuccessMessage={(): void => setShowSuccessMessage(true)}
					updateSuccessMessage={updateSuccessMessageText}
					deleteBody={{
						userId: [userToDelete.id],
						familyIds: getIdValues(deleteFamilyData.attendantIds, "id"),
						childIds: getIdValues(deleteFamilyData.childIds, "childId"),
						spouseIds: getIdValues(deleteFamilyData.spouseIds, "spouseId"),
					}}
					updateLoadingStatus={(): void => setIsLoading(!isLoading)}
					updateTheData={(): void => setUpdatedData(true) }
				/>

				<SuccessMessage
					message={successMessageText}
					show={showSuccessMessage}
					closeMessage={(): void => setShowSuccessMessage(false)}
				/>

				<VisitorModal
					showModal={showFormModal}
					hideModal={(): void => setShowFormModal(false)}
					formData={selectedVisitorData}
				/>

				<LoadingBar show={isLoading} />
			</div>
		</div>
	);
}
