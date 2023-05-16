import React from "react";

export default function NewOrExisting(): JSX.Element {
  return (
    <div id="new_or_existing_wrapper">
      <p>Would you like to:</p>
      <div className="button_wrapper">
        <button type="button">Select a Group</button>
        <button type="button">Create New Group</button>
      </div>
    </div>
  );
}
