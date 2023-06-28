import React, { useEffect, useState } from "react";
import { AllPeopleProps, Attendee } from "../../types/interfaces.ts";
import "../../assets/styles/components/people/allPeople.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrashCan, faUserCheck, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { ValuesAndClass } from "../../types/interfaces.ts";
import PaginationButtons from "../global/PaginationButtons.tsx";

export default function AllPeople({ allPeople, deletePersonHandler, editPersonHandler, totalRows }: AllPeopleProps): JSX.Element {
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

  const returnAllPeopleLgScreen = allPeople?.map((x: Attendee, y: number): JSX.Element => {
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
              editPersonHandler(allPeople[y]);
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
              deletePersonHandler(allPeople[y]);
            }}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </td>
      </tr>
    );
  });

  const returnAllPeopleMobile = allPeople?.map((x: Attendee, y: number): JSX.Element => {
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
              editPersonHandler(allPeople[y]);
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
              deletePersonHandler(allPeople[y]);
            }}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </td>
      </tr>
    );
  });

  if (allPeople) {
    return (
      <div id="all_people_table_wrapper">
        <h2>All Attendants</h2>
        <table id="all_people_table">
          <tbody>
            <tr>{currentWindowWidth > 1024 ? displayHeaders(lgScreenHeaders) : displayHeaders(mobileHeaders)}</tr>
            {currentWindowWidth > 1024 ? returnAllPeopleLgScreen : returnAllPeopleMobile}
          </tbody>
        </table>
        <PaginationButtons totalRows={totalRows} />
      </div>
    );
  } else {
    return <h1>Fetching</h1>;
  }
}
