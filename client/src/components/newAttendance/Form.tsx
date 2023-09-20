import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import GroupDropDown from "../../components/global/GroupDropDown.tsx";
import AttendanceTitle from "../../components/newAttendance/AttendanceTitle.tsx";
import NewGroupForm from "../../components/newAttendance/NewGroupForm.tsx";
import { Group } from "../../types/interfaces.ts";
import { currentDate } from "../../variables/date.ts";
import postData from "../../functions/api/post.ts";
import { APIResponse, FormProps, APINewTable, NewAttendance, ApiResponse } from "../../types/interfaces.ts";
import "../../assets/styles/components/newAttendance/form.scss";

export default function Form({ show, formToShow, startLoading, endLoading }: FormProps): JSX.Element {

  const navigate = useNavigate();

  const [form, setForm] = useState<NewAttendance>({
    title: currentDate,
    group: "",
    ageGroup: "",
    groupDisplayName: "",
  });

  //Using this to get all of the group names to compare against to determine if a new table needs to be created.
  const [allGroups, setAllGroups] = useState<Group[]>([]);

  //Used to get all of the current group names in the database.
  const setGroups = (arr: Group[]): void => {
    setAllGroups(arr);
  };

  //Change handler for the select element for selecting a group.
  const groupChange = (arr: Group[], value: string): void => {
    let index: number = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].displayName === value) {
        index = i;
      }
    }
    setForm({
      ...form,
      groupDisplayName: value,
      group: arr[index]["name"],
      ageGroup: arr[index]["age_group"],
    });
  };

  const titleChange = (value: string): void => {
    setForm({ ...form, title: value });
  };

  const searchForGroup = (value: string, arr: Group[]): boolean => {
    let final = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].displayName === value) {
        final = true;
      }
    }
    return final;
  };

  const setGroupAge = (value: string): void => {
    setForm({ ...form, ageGroup: value });
  };

  const setNewGroupName = (value: string): void => {
    setForm({ ...form, groupDisplayName: value, group: value });
  };

  /**
   *
   * @param obj with a a type of APIResponse
   * @returns Void
   * @description This function is used to throw an alert if a non success message was retrieved by an API endpoint.
   */
  const checkForSuccess = (obj: APIResponse): void => {
    if (obj.message !== "success") {
      alert(`Failure, ${obj.error}`);
    }
  };

  /**
   *
   * @param obj
   * @description takes the response from the '/new-attendance/create endpoint and uses the newTable field to then create a new attendance sheet.
   */
  const neededAttendants = (obj: APINewTable): void => {
    let NeededInfo = {
      createdTableName: obj.newTable,
      allForm: form,
    };

    if (form.ageGroup === "All") {
      postData("/new-attendance/insert/all", NeededInfo).then((data: APIResponse): void => {
        checkForSuccess(data);
      });
    } else {
      postData("/new-attendance/insert/select-attendants", NeededInfo).then((data: APIResponse): void => {
        checkForSuccess(data);
      });
    }
  };

  /**
   *
   * @param e takes on the parameter of an event.
   * @description final submithandler for the form, runs a number of different functions to create a new attendance sheet.
   */
  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    startLoading();
    if (searchForGroup(form.groupDisplayName, allGroups)) {
      postData("/new-attendance/create", form).then((data: APINewTable): void => {
        neededAttendants(data);
        endLoading();
        navigate('/attendance', {replace: true});
      });
    } else {
      postData("/new-group", form).then((data: ApiResponse): void => {
        if (data.message === "success") {
          postData("/new-group/create", form).then((data: APIResponse): void => {
            if (data.message === "success") {
              postData("/new-attendance/create", form).then((data: APINewTable): void => {
                if (data.message === "success") {
                  neededAttendants(data);
                  endLoading();
                  sessionStorage.setItem('currentAttendancePage', '0');
                  navigate('/attendance', {replace: true});
                } else {
                  endLoading();
                  alert("Error with the /new-attendance/create");
                }
              });
            } else {
              endLoading();
              alert("Failure with the /new-group/create");
            }
          });
        } else {
          endLoading();
          alert(`Failure with new-group ${data.data}`);
        }
      });
    }
  };

  return (
    <form
      id="new_attendance_form"
      method="post"
      action="/new-group/create"
      style={show ? { display: "" } : { display: "none" }}
      onSubmit={submitHandler}
    >
      <div
        id="form_group_dropdown_wrapper"
        style={formToShow === "Existing" ? { display: "" } : { display: "none" }}
      >
        <GroupDropDown
          currentGroups={allGroups}
          groupSelected={groupChange}
          getGroups={setGroups}
        />
      </div>
      <div
        id="form_new_group_form_wrapper"
        style={formToShow === "New" ? { display: "" } : { display: "none" }}
      >
        <NewGroupForm
          groupSelected={setNewGroupName}
          ageHandler={setGroupAge}
        />
      </div>
      <AttendanceTitle
        titleHandler={titleChange}
        attendanceTitle={form.title}
      />
      <input
        type="submit"
        value="Submit"
      />
    </form>
  );
}
