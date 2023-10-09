import { AttendanceLayout } from "../types/interfaces.ts";

export const AttendantFormLayout: AttendanceLayout = {
  name: [
    {
      placeholder: "First Name",
      type: "text",
      name: "firstName",
      id: "firstName",
      value: "",
      label: "First Name",
    },
    {
      placeholder: "Last Name",
      type: "text",
      name: "lastName",
      id: "lastName",
      value: "",
      label: "Last Name",
    },
  ],

  ageGroup: [
    {
      placeholder: "",
      type: "radio",
      name: "age_group",
      id: "child",
      value: "child",
      label: "Child",
    },
    {
      placeholder: "",
      type: "radio",
      name: "age_group",
      id: "youth",
      value: "youth",
      label: "Youth",
    },
    {
      placeholder: "",
      type: "radio",
      name: "age_group",
      id: "adult",
      value: "adult",
      label: "Adult",
    },
  ],

  active: [
    {
      placeholder: "",
      type: "radio",
      name: "active_status",
      id: "active",
      value: "1",
      label: "Active",
    },
    {
      placeholder: "",
      type: "radio",
      name: "active_status",
      id: "in-active",
      value: "0",
      label: "In-Active",
    }
  ],

  memberStatus: [
    {
      placeholder: "",
      type: "radio",
      name: "member_status",
      id: "member",
      value: "member",
      label: "Member",
    },
    {
      placeholder: "",
      type: "radio",
      name: "member_status",
      id: "visitor",
      value: "visitor",
      label: "Visitor",
    },
  ],
};
