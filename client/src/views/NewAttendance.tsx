import React, { useState } from "react";
import Navbar from "../components/global/Navbar.tsx";
import Form from "../components/newAttendance/Form.tsx";
import NewOrExisting from "../components/newAttendance/NewOrExisting.tsx";

interface ShowFormOptions {
  formNeeded: "New" | "Existing";
}

export default function NewAttendance() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formOption, setFormOption] = useState<ShowFormOptions>({ formNeeded: "Existing" });

  const showExisting = (): void => {
    setShowForm(true);
    setFormOption({ ...formOption, formNeeded: "Existing" });
  };

  const showNew = (): void => {
    setShowForm(true);
    setFormOption({ ...formOption, formNeeded: "New" });
  };

  return (
    <div>
      <Navbar />
      <div className="header_wrapper">
        <h1>New Attendance</h1>
      </div>
      <NewOrExisting
        newHandler={showNew}
        existingHandler={showExisting}
      />
      <Form
        show={showForm}
        formToShow={formOption.formNeeded}
      />
    </div>
  );
}
