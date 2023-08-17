import React, { useEffect, useState } from "react";
import { AllPeopleProps, Attendee } from "../../types/interfaces.ts";
import "../../assets/styles/components/people/allPeople.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrashCan, faUserCheck, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { ValuesAndClass } from "../../types/interfaces.ts";
import PaginationButtons from "../global/PaginationButtons.tsx";
import SearchBar from "../global/SearchBar.tsx";

export default function AllPeople({ allPeople, deletePersonHandler, editPersonHandler, totalRows, updateOffsetHandler, offSetIncrement, updatePartial, activeSearch }: AllPeopleProps): JSX.Element {
  const [currentWindowWidth, setCurrentWindowWidth] = useState<number>(window.innerWidth);

  useEffect((): void => {
    window.addEventListener("resize", (ev: UIEvent): void => {
      setCurrentWindowWidth(window.innerWidth);
    });
  }, [currentWindowWidth]);

  const lgScreenHeaders: ValuesAndClass[] = [
    { value: "Last Name", class: "last_name_header" },
    { value: "First Name", class: "first_name_headerheader" },
    { value: "Age Group", class: "age_group_header_header" },
    { value: "Member Status", class: "member_status_header" },
    { value: "Edit", class: "edit_header" },
    { value: "Delete", class: "delete_header" },
  ];

  const mobileHeaders: ValuesAndClass[] = [
    { value: "Name", class: "name_header" },
    { value: "Age", class: "age_group_header_header" },
    { value: "Member", class: "member_status_header" },
    { value: "Edit", class: "edit_header" },
    { value: "Delete", class: "delete_header" },
  ];

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

  const returnAllPeopleLgScreen = (arr: Attendee[]) => {
    const returnRows = arr.map((x: Attendee, y: number): JSX.Element => {
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
    });

    return returnRows;
  };

  const returnAllPeopleMobile = (arr: Attendee[]) => {
    const returnRows = arr.map((x: Attendee, y: number): JSX.Element => {
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
    });

    return returnRows;
  };

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

  const activeSearchNoPersonFound = (): JSX.Element => {
    return (
      <div id="all_people_table_wrapper">
        <h2>All Attendants</h2>
        <SearchBar updatePartial={updatePartial} />
      </div>
    );
  };

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

  if (allPeople.length > 1 && !activeSearch) {
    return allPeopleNoSearch();
  } else if (activeSearch && allPeople.length < 1) {
    return activeSearchNoPersonFound();
  } else if (activeSearch && allPeople.length > 0) {
    return activeSearchPeopleFound();
  } else {
    return <h1>Fetching</h1>;
  }
}
