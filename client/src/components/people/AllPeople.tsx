import React, { useEffect, useState } from "react";
import { AllPeopleProps, Attendee } from "../../types/interfaces.ts";
import "../../assets/styles/components/people/allPeople.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrashCan, faUserCheck, faUserMinus, faCheck, faMinus} from "@fortawesome/free-solid-svg-icons";
import { ValuesAndClass } from "../../types/interfaces.ts";
import PaginationButtons from "../global/PaginationButtons.tsx";
import SearchBar from "../global/SearchBar.tsx";


export default function AllPeople({ allPeople, deletePersonHandler, editPersonHandler, totalRows, updateOffsetHandler, offSetIncrement, updatePartial, activeSearch }: AllPeopleProps): JSX.Element {
  const [currentWindowWidth, setCurrentWindowWidth] = useState<number>(window.innerWidth);
 

  //Update the state of the current width of the window based on a resize event.
  useEffect((): void => {
    window.addEventListener("resize", (ev: UIEvent): void => {
      setCurrentWindowWidth(window.innerWidth);
    });
  }, [currentWindowWidth]);


  //Headers that should be displayed for non-mobile screen sizes.
  const lgScreenHeaders: ValuesAndClass[] = [
    { value: "Last Name", class: "last_name_header" },
    { value: "First Name", class: "first_name_header" },
    { value: "Age Group", class: "age_group_header" },
    { value: "Member", class: "member_status_header" },
    { value: "Active", class: "active_attendant_header" },
    { value: "Edit", class: "edit_header" },
    { value: "Delete", class: "delete_header" },
  ];


  //Headers to be displayed for mobile devices.
  const mobileHeaders: ValuesAndClass[] = [
    { value: "Name", class: "name_header" },
    { value: "Age", class: "age_group_header_header" },
    { value: "Member", class: "member_status_header" },
    { value: "Edit", class: "edit_header" },
    { value: "Delete", class: "delete_header" },
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


  /**
   * 
   * @param arr array of the type of Attendee
   * @returns array of JSX elements
   * @description returns all of the people for large screen devices, and displays all of the data points.
   */
  const returnAllPeopleLgScreen = (arr: Attendee[]) => {
    const returnRows = arr.map((x: Attendee, y: number): JSX.Element => {

      if (x.visitorInActive === 0) {
        return (
					<tr key={`row_${y}`}>
						<td>{x.lastName}</td>
						<td>{x.firstName}</td>
						<td>{x.age}</td>
						<td className="align_center">
							<FontAwesomeIcon
								className="user_check"
								icon={x.memberType === "member" ? faUserCheck : faUserMinus}
							/>
						</td>
						<td className="align_center">
							<FontAwesomeIcon
								className="user_active"
								icon={x.active === 0 ? faMinus : faCheck}
							/>
						</td>
						<td className="align_center">
							<button
								type="button"
								onClick={(e: React.PointerEvent<HTMLButtonElement>): void => {
									editPersonHandler(arr[y]);
								}}
							>
								<FontAwesomeIcon icon={faPencil} />
							</button>
						</td>
						<td className="align_center">
							<button
								type="button"
								className="trash_can"
								onClick={(e: React.PointerEvent<HTMLButtonElement>): void => {
									deletePersonHandler(arr[y]);
								}}
							>
								<FontAwesomeIcon icon={faTrashCan} />
							</button>
						</td>
					</tr>
				);
      } else {
        return (
          <div></div>
        );
      }
      
    });

    return returnRows;
  };


  /**
   * 
   * @param arr array of the type of Attendee
   * @returns array of JSX elements
   * @description returns all of the people for mobile screen devices, and displays less data points than the large screen.
   */
  const returnAllPeopleMobile = (arr: Attendee[]) => {
    const returnRows = arr.map((x: Attendee, y: number): JSX.Element => {

      if (x.visitorInActive === 0) {
        return (
					<tr key={`row_${y}`}>
						<td>{`${x.lastName}, ${x.firstName}`}</td>
						<td>{x.age}</td>
						<td className="align_center">
							<FontAwesomeIcon
								className="user_check"
								icon={x.memberType === "member" ? faUserCheck : faUserMinus}
							/>
						</td>
						<td className="align_center">
							<button
								type="button"
								onClick={(e: React.PointerEvent<HTMLButtonElement>): void => {
									editPersonHandler(arr[y]);
								}}
							>
								<FontAwesomeIcon icon={faPencil} />
							</button>
						</td>
						<td className="align_center">
							<button
								type="button"
								className="trash_can"
								onClick={(e: React.PointerEvent<HTMLButtonElement>): void => {
									deletePersonHandler(arr[y]);
								}}
							>
								<FontAwesomeIcon icon={faTrashCan} />
							</button>
						</td>
					</tr>
				);
      } else {
        return (
          <div></div>
        );
      }
      
    });

    return returnRows;
  };


  /**
   * 
   * @returns JSX element
   * @description Displays the table view while no search is active in the search bar.
   */
  const allPeopleNoSearch = (): JSX.Element => {
    return (
      <div id="all_people_table_wrapper">
        <h2>All Attendants</h2>
        <SearchBar updatePartial={updatePartial} />
        <table id="all_people_table">
          <tbody>
            <tr>{currentWindowWidth > 1024 ? displayHeaders(lgScreenHeaders) : displayHeaders(mobileHeaders)}</tr>
            {currentWindowWidth > 1024 ? returnAllPeopleLgScreen(allPeople) : returnAllPeopleMobile(allPeople)}
          </tbody>
        </table>
        <PaginationButtons
          totalRows={totalRows}
          updateOffset={updateOffsetHandler}
          offSetIncrement={offSetIncrement}
          sessionPageProperty={"personPage"}
        />
      </div>
    );
  };


  /**
   * 
   * @returns JSX element
   * @description displays a limited view where no person is found from the search bar.
   */
  const activeSearchNoPersonFound = (): JSX.Element => {
    return (
      <div id="all_people_table_wrapper">
        <h2>All Attendants</h2>
        <SearchBar updatePartial={updatePartial} />
      </div>
    );
  };


  /**
   * 
   * @returns JSX element
   * @description UI to be displayed if people are found from the search query.
   */
  const activeSearchPeopleFound = (): JSX.Element => {
    return (
      <div id="all_people_table_wrapper">
        <h2>All Attendants</h2>
        <SearchBar updatePartial={updatePartial} />
        <table id="all_people_table">
          <tbody>
            <tr>{currentWindowWidth > 1024 ? displayHeaders(lgScreenHeaders) : displayHeaders(mobileHeaders)}</tr>
            {currentWindowWidth > 1024 ? returnAllPeopleLgScreen(allPeople) : returnAllPeopleMobile(allPeople)}
          </tbody>
        </table>
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
      <div id="all_people_table_wrapper">
        <h2>All Attendants</h2>
        <SearchBar updatePartial={updatePartial} />
        <PaginationButtons
          totalRows={totalRows}
          updateOffset={updateOffsetHandler}
          offSetIncrement={offSetIncrement}
          sessionPageProperty={"personPage"}
        />
      </div>
    );
  }

  if (allPeople.length > 0 && !activeSearch) {
    return allPeopleNoSearch();
  } else if (activeSearch && allPeople.length < 1) {
    return activeSearchNoPersonFound();
  } else if (activeSearch && allPeople.length > 0) {
    return activeSearchPeopleFound();
  } else {
    return searchBarNoTable();
  }
}
