import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/components/global/paginationButtons.scss";

interface PaginationButtonsProps {
	totalRows: number;
	updateOffset: Function;
	offSetIncrement: number;
	sessionPageProperty: string;
}

export default function PaginationButtons({ totalRows, updateOffset, offSetIncrement, sessionPageProperty }: PaginationButtonsProps): JSX.Element {
	const [currentPage, setCurrentPage] = useState<number>(sessionStorage.getItem(sessionPageProperty) ? parseInt(sessionStorage.getItem(sessionPageProperty) as string) : 1);
	const [pagesNeeded, setPagesNeeded] = useState<number>(1);

	//Get the number of pages needed based on the current total rows and the off set increment.
	useEffect((): void => {
		const pages = Math.ceil(totalRows / offSetIncrement);
		setPagesNeeded(pages);
	}, [totalRows, offSetIncrement]);

	//Used to update the offset, also updates the session storage.
	useEffect((): void => {
		updateOffset((currentPage - 1) * offSetIncrement);
		sessionStorage.setItem(sessionPageProperty, currentPage.toString());
	}, [currentPage, offSetIncrement, updateOffset, sessionPageProperty]);

	//Increment handler for the pagination.
	const incrementHandler = (): void => {
		if (currentPage < pagesNeeded) {
			setCurrentPage(currentPage + 1);
		}
	};

	//Decrement handler for the pagination.
	const decrementHandler = (): void => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<div className="pagination_button_wrapper">
			<div className="button_group">
				<button
					type="button"
					onClick={decrementHandler}
				>
					<FontAwesomeIcon icon={faAngleLeft} />
				</button>

				<p>{`Page ${currentPage} of ${pagesNeeded}`}</p>

				<button
					type="button"
					onClick={incrementHandler}
				>
					<FontAwesomeIcon icon={faAngleRight} />
				</button>
			</div>
		</div>
	);
}
