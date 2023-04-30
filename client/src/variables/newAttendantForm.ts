import {AttendanceLayout} from "../types/interfaces.ts";

export const attendantFormLayout: AttendanceLayout[] = [
    {
        placeholder: "First Name",
        type: "text",
        name: "firstName",
        id: "firstName", 
        value: '',
        label: "First Name"
    }, 
    {
        placeholder: "Last Name",
        type: "text",
        name: "lastName",
        id: "lastName", 
        value: '', 
        label: "Last Name"
    }, 
    {
        placeholder: "",
        type: "radio",
        name: "age_group",
        id: "child", 
        value: "child",
        label: "Child"
    }, 
    {
        placeholder: "",
        type: "radio",
        name: "age_group",
        id: "youth", 
        value: "youth",
        label: "Youth"
    }, 
    {
        placeholder: "",
        type: "radio",
        name: "age_group",
        id: "adult", 
        value: "adult",
        label: "Adult"
    }, 
    {
        placeholder: "",
        type: "radio",
        name: "member_status",
        id: "member", 
        value: "member",
        label: "Member"
    }, 
    {
        placeholder: "",
        type: "radio",
        name: "member_status",
        id: "visitor", 
        value: "visitor",
        label: "Visitor"
    }
]