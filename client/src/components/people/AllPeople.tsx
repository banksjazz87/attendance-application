import React from "react";
import { AllPeopleProps, Attendee } from "../../types/interfaces.ts";

export default function AllPeople({ allPeople, deletePersonHandler, editPersonHandler }: AllPeopleProps): JSX.Element {

  const tableHeaders: string[] = [
    "Last Name",
    "First Name",
    "Age Group",
    "Member Status",
    "Edit",
    "Delete",
  ];

  const returnHeaders = tableHeaders.map(
    (x: string, y: number): JSX.Element => {
      return <th key={`header_${y}`}>{x}</th>;
    }
  );

  
  const returnallPeople = allPeople?.map(
    (x: Attendee, y: number): JSX.Element => {
      return (
        <tr key={`row_${y}`}>
          <td>{x.lastName}</td>
          <td>{x.firstName}</td>
          <td>{x.age}</td>
          <td>{x.memberType}</td>
          <td>
            <button
              type="button"
              onClick={(e: React.PointerEvent<HTMLButtonElement>): void => {
                editPersonHandler(allPeople[y]);
              }}
            >
              Edit
            </button>
          </td>
          <td>
            <button
              type="button"
              onClick={(e: React.PointerEvent<HTMLButtonElement>): void => {
                deletePersonHandler(allPeople[y]);
              }}
            >
              X
            </button>
          </td>
        </tr>
      );
    }
  );

  if (allPeople) {
    return (
      <table>
        <tbody>
          <tr>{returnHeaders}</tr>
          {returnallPeople}
        </tbody>
      </table>
    );
  } else {
    return <h1>Fetching</h1>;
  }
}
