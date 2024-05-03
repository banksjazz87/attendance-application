import React, { useEffect, useState } from "react";
import { VisitorShortFields, ValuesAndClass } from "../../types/interfaces.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faFile } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../../components/global/SearchBar.tsx";
import PaginationButtons from "../global/PaginationButtons.tsx";
import "../../assets/styles/components/visitors/allVisitors.scss";
import DateMethods from "../../functions/dateMethods.ts";

interface AllVisitorProps {
	allVisitors: VisitorShortFields[];
	totalRows: number;
	updateOffsetHandler: Function;
	offSetIncrement: number;
	updatePartial: Function;
	activeSearch: boolean;
	visitorSelector: Function;
}

export default function AllVisitors({ allVisitors, totalRows, updateOffsetHandler, offSetIncrement, updatePartial, activeSearch, visitorSelector }: AllVisitorProps) {
	const [currentWindowWidth, setCurrentWindowWidth] = useState<number>(window.innerWidth);

  //watching for a window resize, and updating the currentWindowWidth
	useEffect((): void => {
		window.addEventListener("resize", (ev: UIEvent): void => {
			setCurrentWindowWidth(window.innerWidth);
		});
	}, [currentWindowWidth]);

	//Headers that should be displayed for non-mobile screen sizes.
	const lgScreenHeaders: ValuesAndClass[] = [
		{ value: "Last Name", class: "last_name_header" },
		{ value: "First Name", class: "first_name_header" },
		{ value: "Submitted", class: "entry_date_header" },
		{ value: "Phone", class: "phone_header" },
		{ value: "Form", class: "form_header" },
	];

	//Headers to be displayed for mobile devices.
	const mobileHeaders: ValuesAndClass[] = [
		{ value: "Name", class: "first_last_name_header" },
		{ value: "Submitted", class: "entry_date_header" },
		{ value: "Phone", class: "phone_header" },
		{ value: "Form", class: "form_header" },
	];

	/**
	 *
	 * @param arr array of the type of Values and Class.
	 * @returns array of JSX elements
	 * @description displays the appropriate headers.
	 */
	const displayHeaders = (arr: ValuesAndClass[]): JSX.Element[] => {
		const returnHeaders = arr.map((x: ValuesAndClass, y: number): JSX.Element => {
			return (
				<th
					className={x.class}
					key={`header_${y}`}
				>
					{x.value}
				</th>
			);
		});

		return returnHeaders;
	};


  //This is used to display on non-mobile devices.
	const visitorFields: JSX.Element[] = allVisitors.map((x: VisitorShortFields, y: number): JSX.Element => {
		const dateSubmitted = x.dateCreated ? DateMethods.formatMysqlDate(x.dateCreated) : "";
		return (
			<tr key={`row_${y}`}>
				<td>{x.lastName}</td>
				<td>{x.firstName}</td>
				<td>{dateSubmitted}</td>
				<td>
					<a href={`tel:${x.phone}`}>
						<FontAwesomeIcon icon={faPhone} />
					</a>
				</td>
				<td>
					<button
						type="button"
						onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
							visitorSelector(x.id);
						}}
					>
						<FontAwesomeIcon icon={faFile} />
					</button>
				</td>
			</tr>
		);
	});


  //This is used as the display for the mobile devices.
	const mobileVisitorFields: JSX.Element[] = allVisitors.map((x: VisitorShortFields, y: number): JSX.Element => {
		const dateSubmitted = x.dateCreated ? DateMethods.formatMysqlDate(x.dateCreated) : "";
		return (
			<tr key={`row_${y}`}>
				<td>{`${x.lastName}, ${x.firstName}`}</td>
				<td>{dateSubmitted}</td>
				<td>
					<a href={`tel:${x.phone}`}>
						<FontAwesomeIcon icon={faPhone} />
					</a>
				</td>
				<td>
					<button
						type="button"
						onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
							visitorSelector(x.id);
						}}
					>
						<FontAwesomeIcon icon={faFile} />
					</button>
				</td>
			</tr>
		);
	});

	/**
	 *
	 * @returns JSX element
	 * @description Displays the table view while no search is active in the search bar.
	 */
	const allVisitorFields = (): JSX.Element => {
		return (
			<div id="all_visitors_table_wrapper">
				<h2>All Visitors</h2>
				<SearchBar updatePartial={updatePartial} />
				<table>
					<thead>
						<tr>{currentWindowWidth > 1024 ? displayHeaders(lgScreenHeaders) : displayHeaders(mobileHeaders)}</tr>
					</thead>
					<tbody>{currentWindowWidth > 1024 ? visitorFields : mobileVisitorFields}</tbody>
				</table>
				<PaginationButtons
					totalRows={totalRows}
					updateOffset={updateOffsetHandler}
					offSetIncrement={offSetIncrement}
					sessionPageProperty={"visitorPage"}
				/>
			</div>
		);
	};

	/**
	 *
	 * @returns JSX element
	 * @description displays a limited view where no person is found from the search bar.
	 */
	const activeSearchNoVisitorFound = (): JSX.Element => {
		return (
			<div id="all_visitors_table_wrapper">
				<h2>All Attendants</h2>
				<SearchBar updatePartial={updatePartial} />
			</div>
		);
	};

	/**
	 *
	 * @returns JSX Element
	 * @description just shows the search bar without a table, this is used when no results are present.
	 */
	const searchBarNoTable = (): JSX.Element => {
		return (
			<div id="all_visitors_table_wrapper">
				<h2>All Attendants</h2>
				<SearchBar updatePartial={updatePartial} />
				<PaginationButtons
					totalRows={totalRows}
					updateOffset={updateOffsetHandler}
					offSetIncrement={offSetIncrement}
					sessionPageProperty={"visitorPage"}
				/>
			</div>
		);
	};

	if (allVisitors.length > 0 && !activeSearch) {
		return allVisitorFields();
	} else if (activeSearch && allVisitors.length < 1) {
		return activeSearchNoVisitorFound();
	} else if (activeSearch && allVisitors.length > 0) {
		return allVisitorFields();
	} else {
		return searchBarNoTable();
	}
}
