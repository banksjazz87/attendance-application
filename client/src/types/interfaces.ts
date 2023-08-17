export interface Attendee {
  firstName: string;
  lastName: string;
  age: string;
  memberType: string;
  present?: number;
  id?: number;
  table?: string;
}

export interface AttendanceProps {
  show: boolean;
  title: string;
  attendanceData: Attendee[];
  parentTitle: string;
  tableName: string;
  deleteMemberHandler: Function;
}

export interface Group {
  id?: number;
  name: string;
  age_group: string;
  displayName: string;
}

export interface GroupProps {
  clickHandler?: Function;
  groupHandler?: Function;
  name?: string;
  groupSelectedHandler?: Function;
  groupSelected?: Function;
  titleHandler?: Function;
  attendanceTitle?: string;
  getGroups?: Function;
  currentGroups?: Group[];
  ageHandler?: Function;
  show?: Boolean;
}

export interface GroupDropDownProps {
  groupSelected?: Function;
  getGroups?: Function;
  currentGroups?: Group[];
  attendanceGroupSelected?: Function;
}

export interface User {
  name: string;
  password: string;
}

export interface UserProps {
  showForm: boolean;
  logIn: any;
}

export interface JSDate {
  getMonth: Function;
  getDate: Function;
  getFullYear: Function;
}

export interface AttendanceInputs {
  placeholder: string;
  type: string;
  name: string;
  id: string;
  value: string;
  label: string;
}

export interface AttendanceLayout {
  name: AttendanceInputs[];
  ageGroup: AttendanceInputs[];
  memberStatus: AttendanceInputs[];
}

export interface APIResponse {
  message: string;
  data: string[];
  error: string;
}

export interface APINewTable extends APIResponse {
  newTable: string;
}

export interface APIPeople {
  message: string;
  data: Attendee[];
  error: string;
}

export interface TotalRows {
  total: number;
}

export interface APITotalRows {
  message: string;
  data: TotalRows[];
  error: string;
}

export interface DBAttendanceTitle {
  id: number;
  title: string;
  displayTitle: string;
  dateCreated: string;
}

export interface APIAttendanceTitles {
  message: string;
  data: DBAttendanceTitle[];
  error: string;
}

export interface APIAttendanceSheet {
  message: string;
  data: Attendee[];
  error: string;
}

export interface AllPeopleProps {
  allPeople: Attendee[];
  deletePersonHandler: Function;
  editPersonHandler: Function;
  totalRows: number;
  updateOffsetHandler: Function;
  offSetIncrement: number;
  updatePartial: Function;
  activeSearch: boolean;
}

export interface DeleteProps {
  message: string;
  url: string;
  show: boolean;
  deleteUser: Attendee;
  hideHandler: Function;
}

export interface DeleteResponse {
  message: string;
  error: string;
}

export interface FormProps {
  show: boolean;
  formToShow: "New" | "Existing";
}

export interface UpdateAttendant {
  firstName: string;
  lastName: string;
  attendantId: number | undefined;
  table: string | undefined;
  presentValue: number;
  age?: string;
  memberType?: string;
}

export interface NewMemberProps {
  currentTable?: string;
  show: boolean;
  showHandler: Function;
}

export interface ValuesAndClass {
  value: string;
  class: string;
}
