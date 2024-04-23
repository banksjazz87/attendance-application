import React from "react";
import { VisitorShortFields } from "../../types/interfaces.ts";
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
}

export default function AllVisitors({ allVisitors, totalRows, updateOffsetHandler, offSetIncrement, updatePartial, activeSearch }: AllVisitorProps) {

	const visitorFields: JSX.Element[] = allVisitors.map((x: VisitorShortFields, y: number): JSX.Element => {

        const dateSubmitted = x.dateCreated ? DateMethods.formatMysqlDate(x.dateCreated) : '';
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
					<button type="button">
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
                <SearchBar updatePartial={updatePartial}/>
				<table>
					<thead>
						<tr>
							<th>Last Name</th>
							<th>First Name</th>
							<th>Entry Date</th>
							<th>Phone</th>
							<th>Form</th>
						</tr>
					</thead>
					<tbody>{visitorFields}</tbody>
				</table>
                <PaginationButtons 
                    totalRows={totalRows}
                    updateOffset={updateOffsetHandler}
                    offSetIncrement={offSetIncrement}
                    sessionPageProperty={'visitorPage'}
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
  }



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
