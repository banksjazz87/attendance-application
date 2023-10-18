export interface Attendee {
  firstName: string;
  lastName: string;
  age: string;
  memberType: string;
  active: number;
  present?: number;
  id?: number;
  table?: string;
}

export interface AttendanceProps {
  show: boolean;
  title: string;
  attendanceData: Attendee[];
  parentTitle: string;
  parentName: string;
  tableName: string;
  deleteMemberHandler: Function;
  updatePartial: Function;
  activeSearch: boolean;
  startLoading: Function;
  stopLoading: Function;
  triggerSuccessMessage: Function;
  hideSuccessMessage: Function;
  updateSuccessMessage: Function;
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
  resetOffset?: Function;

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
  updateLoadingStatus: Function;
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
  active: AttendanceInputs[];
}

export interface APIResponse {
  message: string;
  data: string[];
  error: string;
}

export interface YearsDataObj {
  years: number;
}

export interface MonthsDataObj {
  months: string;
}

export interface MonthsDataObj {
  months: string;
}

export interface YearsDataResponse {
  message: string;
  data: YearsDataObj[];
  error: string;
}

export interface MonthsDataResponse {
  message: string;
  data: MonthsDataObj[];
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





export interface DBAllAttendance {
  id: number;
  title: string;
  displayTitle: string;
  parentGroup: string;
  dateCreated: string;
}

export interface APIAttendanceAllTitles {
  message: string;
  data: DBAllAttendance[];
  error: string;
}


export interface GroupAttendance {
  id: number;
  firstName: string;
  lastName: string;
  age: string;
  memberType: string;
  [x: string]: string | number;
}

export interface APIGroupAttendance {
  message: string;
  data: GroupAttendance[];
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
  triggerSuccessMessage: Function;
  updateSuccessMessage: Function;
}

export interface DeleteResponse {
  message: string;
  error: string;
}

export interface FormProps {
  show: boolean;
  formToShow: "New" | "Existing";
  updateLoadingStatus: Function;
}

export interface UpdateAttendant {
  firstName: string;
  lastName: string;
  attendantId: number | undefined;
  table: string | undefined;
  presentValue?: number;
  age?: string;
  memberType?: string;
  [x: string]: any;
}

export interface NewMemberProps {
  currentTable?: string;
  show: boolean;
  showHandler: Function;
  masterTable: boolean;
  triggerSuccessMessage: Function;
  updateSuccessMessage: Function;

}

export interface ValuesAndClass {
  value: string;
  class: string;
}

export interface TotalSum {
	totalChildren: number;
	totalYouth: number;
	totalAdults: number;
	totalMembers: number;
	totalVisitors: number;
}

export interface TotalSentSum {
	children: number;
	youth: number;
	adults: number;
	members: number;
	visitors: number;
}

export interface SaveButtonProps {
  tableTitle: string;
  totalData: TotalSum;
  startLoading: Function;
  stopLoading: Function;
}

export interface SentData {
  title: string;
  data: TotalSum;
}

export interface NewAttendance {
  title: string;
  group: string;
  ageGroup: string;
  groupDisplayName: string;
}

export interface ApiResponse {
  message: string;
  data: [] | string;
}

export interface AttendanceTotals {
  id: number,
  groupName: string;
  displayTitle: string;
  dateCreated: string;
  totalChildren: number;
  totalYouth: number;
  totalAdults: number;
  totalMembers: number;
  totalVisitors: number;
  title: string;
  totalCount: number;
}

export interface AttendanceResponse {
  data: AttendanceTotals[];
  message: string;
  error: string;
}
