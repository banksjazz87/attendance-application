import React, { useState, useEffect } from "react";
import { Attendee, AttendanceProps, UpdateAttendant, APIResponse } from "../../types/interfaces.tsx";
import putData from "../../functions/api/put.ts";
import deleteData from "../../functions/api/delete.ts";
import MathMethods from "../../functions/math.ts";
import "../../assets/styles/components/attendance/attendanceSheet.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle, faTrashCan } from "@fortawesome/free-solid-svg-icons";

//For Development
//import { attendantData } from "../../variables/dummyAttendant.ts";

export default function AttendanceSheet({ show, title, attendanceData, parentTitle, tableName }: AttendanceProps) {
  //The below is for production
  const [memberData, setMemberData] = useState<Attendee[]>(attendanceData);

  //The below is for development
  //const [memberData, setMemberData] = useState<Attendee[]>(attendantData);
  let initWidth: number = window.innerWidth;
  const [screenSize, setScreenSize] = useState<number>(initWidth);

  //The below is for production
  useEffect((): void => {
    setMemberData(attendanceData);
  }, [attendanceData]);

  //Used to check the current screen size
  useEffect((): void => {
    document.addEventListener("DOMContentLoaded", (e: Event): void => {
      setScreenSize(window.innerWidth);
    });

    window.addEventListener("resize", (e: UIEvent): void => {
      setScreenSize(window.innerWidth);
    });
  }, [screenSize]);

  const checkedHandler = (index: number): void => {
    const copy: Attendee[] = memberData.slice();

    let currentObj: UpdateAttendant = {
      firstName: copy[index].firstName,
      lastName: copy[index].lastName,
      attendantId: copy[index].id,
      table: tableName,
      presentValue: 0,
    };

    if (copy[index].present === 0) {
      copy[index].present = 1;
      setMemberData(copy);
      currentObj.presentValue = 1;

      putData("/attendance/update-table", currentObj).then((data: APIResponse): void => {
        if (data.message === "success") {
          alert(`${currentObj.firstName} ${currentObj.lastName} has been marked present`);
        } else {
          alert(data.data);
        }
      });
    } else {
      copy[index].present = 0;
      setMemberData(copy);
      currentObj.presentValue = 0;

      putData("/attendance/update-table", currentObj).then((data: APIResponse): void => {
        if (data.message === "success") {
          alert(`${currentObj.firstName} ${currentObj.lastName} has been marked NOT present`);
        } else {
          alert(data.data);
        }
      });
    }
  };

  const removeAttendee = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number): void => {
    let selectedAtt = memberData[index];
    deleteData(`/attendance-sheet/remove-person/${selectedAtt.firstName}/${selectedAtt.lastName}/${selectedAtt.id}/${tableName}`).then((data: APIResponse): void => {
      if (data.message === "success") {
        alert(`${selectedAtt.firstName} ${selectedAtt.lastName} has been deleted`);
        window.location.reload();
      } else {
        alert(`${data.data}`);
      }
    });
  };

  const checkedOrNot = (value: number | undefined, index: number): JSX.Element => {
    if (value === 0) {
      return (
        <button
          type="button"
          className="present_click"
          onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
            checkedHandler(index);
          }}
        >
          <FontAwesomeIcon
            className="circle"
            icon={faCircle}
          />
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="present_click"
          onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
            checkedHandler(index);
          }}
        >
          <FontAwesomeIcon
            className="check"
            icon={faCheck}
          />
        </button>
      );
    }
  };

  const dataPointsLgScreen = memberData.map((x: Attendee, y: number): JSX.Element => {
    return (
      <tr
        key={`attendant_row_${y}`}
        id={`attendant_row_${y}`}
        className={MathMethods.checkForEven(y) ? "" : "dark_row"}
      >
        <td className="number_id">{`${y + 1}.`}</td>
        <td>{x.lastName}</td>
        <td>{x.firstName}</td>
        <td>{checkedOrNot(x.present, y)}</td>
        <td>
          <button
            type="button"
            className="trash_btn"
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
              removeAttendee(event, y);
            }}
          >
            <FontAwesomeIcon
              className="trash_can"
              icon={faTrashCan}
            />
          </button>
        </td>
      </tr>
    );
  });

  const dataPointsMobile = memberData.map((x: Attendee, y: number): JSX.Element => {
    return (
      <tr
        key={`attendant_row_${y}`}
        id={`attendant_row_${y}`}
        className={MathMethods.checkForEven(y) ? "" : "dark_row"}
      >
        <td className="number_id">{`${y + 1}.`}</td>
        <td>{`${x.lastName}, ${x.firstName}`}</td>
        <td>{checkedOrNot(x.present, y)}</td>
        <td>
          <button
            type="button"
            className="trash_btn"
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
              removeAttendee(event, y);
            }}
          >
            <FontAwesomeIcon
              className="trash_can"
              icon={faTrashCan}
            />
          </button>
        </td>
      </tr>
    );
  });

  const headersLgScreen = ["", "Last Name", "First Name", "Present", "Delete"];
  const headersMobileScreen = ["", "Name", "Present", "Delete"];

  const returnHeaders = (arr: string[]): JSX.Element[] => {
    const displayHeaders = arr.map((x: string, y: number): JSX.Element => {
      return <th key={`header_${y}`}>{x}</th>;
    });
    return displayHeaders;
  };

  //FOR PRODUCTION change the below divs style={show ? { display: "" } : { display: "" }} for production. Remove conditionals from h2 and h3.
  return (
    <div
      className="attendance_table_wrapper"
      style={show ? { display: "" } : { display: "none" }}
    >
      <h2>{parentTitle}</h2>
      <h3>{title}</h3>
      <table>
        <tbody>
          <tr>{screenSize > 767 ? returnHeaders(headersLgScreen) : returnHeaders(headersMobileScreen)}</tr>
          {screenSize > 767 ? dataPointsLgScreen : dataPointsMobile}
        </tbody>
      </table>
    </div>
  );
}
