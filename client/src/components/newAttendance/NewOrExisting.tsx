import React from "react";
import "../../assets/styles/components/newAttendance/newOrExisting.scss";

interface NewOrExistingProps {
  newHandler: Function;
  existingHandler: Function;
}
export default function NewOrExisting({ newHandler, existingHandler }: NewOrExistingProps): JSX.Element {
  const newClickHandler = (e: React.MouseEvent<HTMLElement>): void => {
    newHandler();
  };

  const existingClickHandler = (e: React.MouseEvent<HTMLElement>): void => {
    existingHandler();
  };

  return (
    <div id="new_or_existing_wrapper">
      <p>Would you like to:</p>
      <div className="button_wrapper">
        <button
          type="button"
          onClick={existingClickHandler}
        >
          Select Group
        </button>
        <button
          type="button"
          onClick={newClickHandler}
        >
          Create Group
        </button>
      </div>
    </div>
  );
}
