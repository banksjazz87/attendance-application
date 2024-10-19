import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { DBMethods } from "./dbQueries/databaseMethods";
import { SQLResponse } from "./interfaces/interfaces";
import { TotalSentSum } from "./client/src/types/interfaces";

dotenv.config();

const app: Express = express();

//All middleware functions will go here.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const port = process.env.PORT || 3900;

app.listen(port, (): void => {
	console.log(`Server is running on port ${port}`);
});

app.use(express.static(path.join(__dirname, "../client/build")));

const paths = ["/dashboard", "/new-attendance", "/attendance", "/search-past-attendance", "/people", "/visitors"];

app.get(paths, (req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.post("/login", (req: Request, res: Response): any => {
	if (req.body.name === process.env.TEST_USER && req.body.password === process.env.TEST_PASSWORD) {
		res.cookie("account", "Tester", {
			maxAge: 31556952 * 1000,
		});
		res.cookie("user", process.env.MYSQL_USER, {
			maxAge: 31556952 * 1000,
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("host", process.env.MYSQL_HOST, {
			maxAge: 31556952 * 1000,
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("database", process.env.TEST_DB, {
			maxAge: 31556952 * 1000,
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("password", process.env.MYSQL_PASSWORD, {
			maxAge: 31556952 * 1000,
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("loggedIn", true, {
			maxAge: 31556952 * 1000,
		});
		res.send({ message: "valid" });
	} else if (req.body.name === process.env.HEROKU_USER && req.body.password === process.env.HEROKU_PASSWORD) {
		res.cookie("account", "Demo");
		res.cookie("user", process.env.JAWSDB_USERNAME, {
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("host", process.env.JAWSDB_HOSTNAME, {
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("database", process.env.JAWSDB_DATABASENAME, {
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("password", process.env.JAWSDB_PASSWORD, {
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("loggedIn", true);
		res.send({ message: "valid" });
	} else if (req.body.name === process.env.CHAPEL_USER && req.body.password === process.env.CHAPEL_PASSWORD) {
		res.cookie("account", "Chapel", {
			maxAge: 31556952 * 1000,
		});
		res.cookie("user", process.env.CHAPEL_MYSQL_USER, {
			maxAge: 31556952 * 1000,
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("host", process.env.CHAPEL_MYSQL_HOST, {
			maxAge: 31556952 * 1000,
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("database", process.env.CHAPEL_DB, {
			maxAge: 31556952 * 1000,
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("password", process.env.CHAPEL_DBPASSWORD, {
			maxAge: 31556952 * 1000,
			httpOnly: true,
			sameSite: "lax",
		});
		res.cookie("loggedIn", true, {
			maxAge: 31556952 * 1000,
		});
		res.send({ message: "valid" });
	} else {
		res.send({ message: "invalid" });
	}
});

app.post("/new-group", (req: Request, res: Response) => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	const dbValues = [Db.createTableName(req.body.groupDisplayName), req.body.ageGroup, req.body.group];
	const dbColumns = "name, age_group, displayName";

	Db.insert("group_names", dbColumns, dbValues)
		.then((data: string[]): void => {
			console.log(data);
			res.send({ message: "success", data: data });
		})
		.catch((err: SQLResponse): void => {
			console.log(Db.getSqlError(err));
			res.send({ message: "failure", error: Db.getSqlError(err) });
		});
});

app.get("/groups", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	Db.getTable("group_names", "ASC", "name")
		.then((data: string[]): void => {
			console.log(data);
			res.send({ message: "success", data: data });
		})
		.catch((err: SQLResponse): void => {
			console.log(err);
			res.send({ message: "failure", error: Db.getSqlError(err) });
		});
});

app.post("/new-attendance/create", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	let groupAttendance = req.body.group + " " + "attendance";
	let columnTitle = Db.createTableName(req.body.title);
	let tableName = Db.createTableName(groupAttendance);
	let attendanceColumnName = req.body.title;
	const columnNames = "title, displayTitle, parentGroup, parentGroupValue";
	const fieldValues = [Db.createTableName(attendanceColumnName), req.body.title, req.body.group, Db.createTableName(req.body.group)];

	const totalColNames = "groupName, displayTitle, totalChildren, totalYouth, totalAdults, totalMembers, totalVisitors, title";
	const totalFieldValues = [Db.createTableName(req.body.group), req.body.title, 0, 0, 0, 0, 0, Db.createTableName(attendanceColumnName)];

	Promise.all([Db.insertNoEnd("all_attendance", columnNames, fieldValues), Db.insertNoEnd("Attendance_Totals", totalColNames, totalFieldValues), Db.addNewColumnToMasterNoEnd(tableName, columnTitle)])
		.then((data: [string[], string[], string[]]): void => {
			console.log(data);
			res.send({ message: "success", data: data, newTable: tableName });
			Db.endDb();
		})
		.catch((err: [SQLResponse, SQLResponse, SQLResponse]): void => {
			console.log("Failure Alllll", err);
			res.send({
				message: "failure",
				error: () => {
					Db.getSqlError(err[0]);
					Db.getSqlError(err[1]);
					Db.getSqlError(err[2]);
				},
			});
			Db.endDb();
		});
});

app.post("/new-attendance/create/master/table", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	let groupAttendance = req.body.group + " " + "attendance";
	let tableName = Db.createTableName(groupAttendance);

	Db.createNewAttendance(tableName).then((data: string[]): void => {
		console.log(data);
		res.send({ message: "success", data: data });
	});
});

app.post("/new-attendance/insert/all", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	const groupTable = req.body.group + " attendance";
	const tableName = Db.createTableName(groupTable);

	Db.addAllActiveApplicants(tableName)
		.then((data: string[]): void => {
			console.log(data);
			res.send({ message: "success" });
		})
		.catch((err: SQLResponse): void => {
			console.log("failure", err);
			res.send({ message: "failure", error: Db.getSqlError(err) });
		});
});

app.post("/new-attendance/insert/select-attendants", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	const groupTable = req.body.group + " attendance";
	const tableName = Db.createTableName(groupTable);
	const neededAge = req.body.ageGroup;

	Db.addSelectApplicants(tableName, neededAge)
		.then((data: string[]): void => {
			console.log(data);
			res.send({ message: "success" });
		})
		.catch((err: SQLResponse): void => {
			console.log("failure", err);
			res.send({ message: "failure", error: Db.getSqlError(err) });
		});
});

app.post("/new-group/new-attendance/create", (req: Request, res: Response) => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	let group = Db.createTableName(req.body.name);
	const columnNames = "title, group_age";
	const values = [req.body.title, req.body.ageGroup];

	Promise.all([Db.createGroupTable(req.body.group), Db.insert(group, columnNames, values)])
		.then((data: [string[], string[]]): void => {
			console.log(data);
			res.send({ message: "success", data: data });
		})
		.catch((err: [SQLResponse, SQLResponse]): void => {
			console.log("err", err);
			res.send({
				message: "failure",
				error: () => {
					Db.getSqlError(err[0]), Db.getSqlError(err[1]);
				},
			});
		});
});

app.get("/all-attendants", (req: Request, res: Response) => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	Db.getTable("Attendants", "ASC", "lastName")
		.then((data: string[]): void => {
			console.log(data);
			res.send({ message: "Success", data: data });
		})
		.catch((err: SQLResponse): void => {
			console.log(err);
			res.send({ message: "failure", error: Db.getSqlError(err) });
		});
});

app.post("/new-attendant", (req: Request, res: Response) => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	const neededValues: string[] = Object.values(req.body);
	const neededColumns: string = Object.keys(req.body).toString();

	Db.insert("Attendants", neededColumns, neededValues)
		.then((data: string[]): void => {
			res.send({ message: "Success", data: data });
			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			console.log("Error", err);
			res.send({ message: "failure", error: Db.getSqlError(err) });
		});
});

app.get("/get-attendant/:firstName/:lastName", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	Db.getPerson("Attendants", req.params.firstName, req.params.lastName)
		.then((data: string[]): void => {
			res.send({ message: "success", data: data });
		})
		.catch((err: SQLResponse): void => {
			console.log("FAILURE", err);
			res.send({ message: "failure", error: err });
		});
});

app.delete("/remove-person/:firstName/:lastName/:id", (req: Request, res: Response) => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	let numOfId = parseInt(req.params.id);
	console.log(`${req.params.firstName}, ${req.params.lastName}, ${req.params.id}`);

	Db.removePerson("Attendants", req.params.firstName, req.params.lastName, numOfId)
		.then((data: string[]): void => {
			res.send({
				message: `Success, ${req.params.firstName} ${req.params.lastName} has been deleted`,
			});
			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			console.log("ERRRRORRRR", err);
			res.send({ message: "failure", error: Db.getSqlError(err) });
		});
});

app.put("/update-attendant", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
	Db.updatePerson("Attendants", req.body)
		.then((data: string[]): void => {
			res.send({ message: "Success", data: data });
			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			res.send({ message: "failure", error: Db.getSqlError(err) });
			console.log(err);
		});
});

app.get("/group-lists/attendance/:group", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
	const groupValue = Db.createTableName(req.params.group);

	Db.getAttendanceByGroupName(groupValue, "dateCreated", "desc")
		.then((data: string[]): void => {
			console.log(data);
			res.send({ message: "success", data: data });
		})
		.catch((err: SQLResponse): void => {
			console.log("Failureeee", err);
			res.send({ message: "Failure", error: Db.getSqlError(err) });
		});
});

app.get("/attendance/get-list/:listName", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
	Db.getTable(req.params.listName, "ASC", "lastName")
		.then((data: string[]): void => {
			console.log(data);
			res.send({ message: "success", data: data });
		})
		.catch((err: SQLResponse): void => {
			console.log("there was an error", err);
			res.send({ message: "failure", error: Db.getSqlError(err) });
		});
});

app.get("/attendance/get-list-by-name/:tableName/:colName", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
	const tableName = Db.createTableName(req.params.tableName);
	const columnName = Db.createTableName(req.params.colName);

	Db.getTableByColumn(tableName, "ASC", columnName, "lastName")
		.then((data: string[]): void => {
			console.log(data);
			res.send({ message: "success", data: data });
		})
		.catch((err: SQLResponse): void => {
			console.log("there was an error", err);
			res.send({ message: "failure", error: Db.getSqlError(err) });
		});
});

app.put("/attendance/update-table/:columnName/:presentValue", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	const neededTable = req.body.table;
	const neededId = req.body.attendantId;
	const neededLastName = req.body.lastName;
	const present = parseInt(req.params.presentValue as string);
	const column = req.params.columnName;

	Db.updateAttendance(neededTable, column, neededId, neededLastName, present)
		.then((data: string[]): void => {
			console.log(data);
			res.send({ message: "success", data: data });
		})
		.catch((err: SQLResponse): void => {
			console.log("FAILURE", err);
			res.send({ message: "Failure", error: Db.getSqlError(err) });
		});
});

app.post("/attendance/insert/attendant", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	const neededTable: string = req.body.table;
	const allColumns: string = `id, firstName, lastName, age, memberType, ${req.body.attendanceColumn}`;
	const allData: string[] = [req.body.attendantId, req.body.firstName, req.body.lastName, req.body.age, req.body.memberType, 1];

	Db.insert(neededTable, allColumns, allData)
		.then((data: string[]): void => {
			console.log("Success", data);
			res.send({ message: "success", data: data });
		})
		.catch((err: SQLResponse): void => {
			console.log("Errorr inserting attendant", err);
			res.send({ message: "failure", error: Db.getSqlError(err) });
		});
});

app.post("/attendance/insert/new-attendants/:tableName", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	const neededTable: string = req.params.tableName;
	const allColumns: string = `id, firstName, lastName, age, memberType`;

	Db.addBulkSelectApplicants(neededTable, allColumns, req.body.neededFields)
		.then((data: string[]): void => {
			console.log("success", data);
			res.send({ message: "success", data: data });
		})
		.catch((err: SQLResponse): void => {
			console.log("Error inserting multiple attendants", err);
			res.send({ message: "failure", error: Db.getSqlError(err) });
		});
});

app.delete("/attendance-sheet/remove-person/:firstName/:lastName/:id/:group", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	const first = req.params.firstName;
	const last = req.params.lastName;
	const idNum = parseInt(req.params.id);
	const table = `${req.params.group}_attendance`;

	Db.removePerson(table, first, last, idNum)
		.then((data: string[]): void => {
			res.send({
				message: `Success, ${first} ${last} has been removed from the ${table} table.`,
				data: data,
			});
			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			res.send({
				message: "failure",
				error: Db.getSqlError(err),
			});
			console.log(err);
		});
});

app.get("/row-count/:tableName", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	Db.numberOfRows(req.params.tableName)
		.then((data: string[]): void => {
			res.send({
				message: "success",
				data: data,
			});
			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			res.send({
				message: "failure",
				error: Db.getSqlError(err),
			});
			console.log(err);
		});
});

app.get("/table-return-few/:tableName/:limitNum/:offsetNum/:fieldOrder/:orderValue", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	Db.limitNumberOfRowsReturned(req.params.tableName, parseInt(req.params.limitNum), parseInt(req.params.offsetNum), req.params.fieldOrder, req.params.orderValue)
		.then((data: string[]): void => {
			res.send({
				message: "success",
				data: data,
			});

			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			res.send({
				message: "failure",
				error: Db.getSqlError(err),
			});
			console.log(err);
		});
});

app.get("/people/search/:table/:partialName", (req: Request, res: Response): void => {
	let tableName: string = req.params.table;
	let partial: string = req.params.partialName;

	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	Db.searchForPartialName(tableName, partial)
		.then((data: string[]): void => {
			res.send({
				message: "success",
				data: data,
			});
			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			res.send({
				message: "failure",
				error: Db.getSqlError(err),
			});
			console.log(err);
		});
});

app.put("/attendance-total/update/", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	let tableName = Db.createTableName(req.body.title);
	let groupValue = req.body.group;

	let totals: TotalSentSum = {
		children: req.body.data.totalChildren,
		youth: req.body.data.totalYouth,
		adults: req.body.data.totalAdults,
		members: req.body.data.totalMembers,
		visitors: req.body.data.totalVisitors,
	};

	Db.updateTotalTable(tableName, groupValue, totals.children, totals.youth, totals.adults, totals.members, totals.visitors)
		.then((data: string[]): void => {
			res.send({
				message: "success",
				data: data,
			});
			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			res.send({
				message: "failure",
				error: Db.getSqlError(err),
			});
			console.log(err);
		});
});

app.get("/group-statistics/:group/:month/:year", (req: Request, res: Response): void => {
	const year: string = req.params.year;
	const month: string = req.params.month;
	const group: string = req.params.group;

	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	Db.getMonthStatistics(group, month, year)
		.then((data: string[]): void => {
			res.send({
				message: "success",
				data: data,
			});
			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			res.send({
				message: "failure",
				error: Db.getSqlError(err),
			});
			console.log(err);
		});
});

app.get("/group-years/:groupName", (req: Request, res: Response): void => {
	const group: string = req.params.groupName;
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	Db.getDistinctStatisticYears(group)
		.then((data: string[]): void => {
			res.send({
				message: "success",
				data: data,
			});
			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			res.send({
				message: "failure",
				error: Db.getSqlError(err),
			});
			console.log("Error", err);
		});
});

app.get("/group-months/:yearDate/:groupName", (req: Request, res: Response): void => {
	const year: string = req.params.yearDate;
	const group: string = req.params.groupName;
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	Db.getDistinctStatisticMonths(group, year)
		.then((data: string[]): void => {
			res.send({
				message: "success",
				data: data,
			});
			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			res.send({
				message: "failure",
				error: Db.getSqlError(err),
			});
			console.log("Error", err);
		});
});

app.get("/all-visitors/:limit/:offset", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
	const neededColumns = ["id", "visitorId", "firstName", "lastName", "phone", "dateCreated"];
	const reqLimit = parseInt(req.params.limit);
	const reqOffset = parseInt(req.params.offset);

	Db.selectFewWithLimit("Visitor_Forms", neededColumns, reqLimit, reqOffset, "dateCreated", "DESC")
		.then((data: string[]): void => {
			res.send({
				message: "success",
				data: data,
			});
			console.log(data);
		})
		.catch((err: SQLResponse): void => {
			res.send({
				message: "failure",
				error: Db.getSqlError(err),
			});
			console.log("Error", err);
		});
});

app.get("/all-visitor-data/:id", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
	const visitorId: number = parseInt(req.params.id);

	Promise.all([
		Db.selectAllById("Visitor_Forms", "id", visitorId),
		Db.selectAllById("Visitor_Children", "parentId", visitorId),
		Db.selectAllById("Visitor_Interests", "visitor_attendant_id", visitorId),
		Db.selectAllById("Visitor_Spouse", "visitorSpouseId", visitorId),
		Db.endDb(),
	])
		.then((data: [string[], string[], string[], string[], void]) => {
			res.send({
				message: "success",
				data: {
					form: data[0],
					children: data[1],
					interests: data[2],
					spouse: data[3],
				},
			});
			console.log("Success!!");
		})
		.catch((err: [SQLResponse, SQLResponse, SQLResponse, SQLResponse, SQLResponse]): void => {
			res.send({
				message: "failure",
				error: () => {
					Db.getSqlError(err[0]);
					Db.getSqlError(err[1]);
					Db.getSqlError(err[2]);
					Db.getSqlError(err[3]);
					Db.getSqlError(err[4]);
				},
			});

			console.log("Error", err);
		});
});

app.get("/children-spouse-ids/:parentId", (req: Request, res: Response): void => {
	const parentId = req.params.parentId;
	const childSpouseAttendantID: string[] = [`SELECT id FROM Visitor_Children WHERE parentId = ${parentId}`, `SELECT id FROM Visitor_Spouse WHERE visitorSpouseId = ${parentId}`];

	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	Promise.all([Db.dataUnion(childSpouseAttendantID), Db.getBySelectColumnsNoEnd(["spouseId"], "Visitor_Spouse", "visitorSpouseId", parentId), Db.getBySelectColumnsNoEnd(["childId"], "Visitor_Children", "parentId", parentId), Db.endDb()])

		.then((data: [string[], string[], string[], void]): void => {
			res.send({
				message: "success",
				data: {
					attendantIds: data[0],
					spouseIds: data[1],
					childIds: data[2],
				},
			});
			console.log("Success here ", data);
		})
		.catch((err: [SQLResponse, SQLResponse, SQLResponse, SQLResponse]): void => {
			console.log("ERRROR ", err);
			res.send({
				message: "failure",
				error: () => {
					Db.getSqlError(err[0]);
					Db.getSqlError(err[1]);
					Db.getSqlError(err[2]);
					Db.getSqlError(err[3]);
				},
			});
		});
});

//Delete visitor form data and deletes the visitors from all attendance views.
app.delete("/remove-all-visitor-data/", (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	const childIds: string[] = req.body.childIds;
	const spouseIds: string[] = req.body.spouseIds;
	const familyIds: string[] = req.body.familyIds;
	const userId: string[] = req.body.userId;
	const allFamilyIds: string[] = familyIds.concat(userId);

	Promise.all([
		Db.removeByIdNoEnd("Visitor_Children", "parentId", userId),
		Db.removeByIdNoEnd("Visitor_Spouse", "visitorSpouseId", userId),
		Db.removeByIdNoEnd("Visitor_Interests", "visitor_attendant_id", userId),
		Db.removeByIdNoEnd("Visitor_Forms", "id", userId),
	])
		.then((data: [string[], string[], string[], string[]]): void => {
			Promise.all([Db.removeByIdNoEnd("Attendants", "id", allFamilyIds), Db.endDb()])
				.then((final: [string[], void]): void => {
					res.send({
						message: "success",
						data: final,
					});
					console.log("SUCCESS removing all visitor data ");
				})

				.catch((finalErr: [SQLResponse, SQLResponse]): void => {
					res.send({
						message: "failure",
						error: (): void => {
							Db.getSqlError(finalErr[0]), Db.getSqlError(finalErr[1]);
						},
					});
					console.log("ERROR DELETING ALL ", finalErr);
				});
		})
		.catch((err: [SQLResponse, SQLResponse, SQLResponse, SQLResponse, SQLResponse]): void => {
			res.send({
				message: "failure",
				error: (): void => {
					Db.getSqlError(err[0]);
					Db.getSqlError(err[1]);
					Db.getSqlError(err[2]);
					Db.getSqlError(err[3]);
					Db.getSqlError(err[4]);
				},
			});
			console.log("ERROR ", err);
		});
});

//Just used to remove the visitor form data, doesn't delete the attendant from the attendants table.
app.delete("/remove-visitor-form-data/", (req: Request, res: Response): void => {
	const Db: DBMethods = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

	const userId: string[] = req.body.userId;

	Promise.all([
		Db.removeByIdNoEnd("Visitor_Children", "parentId", userId),
		Db.removeByIdNoEnd("Visitor_Spouse", "visitorSpouseId", userId),
		Db.removeByIdNoEnd("Visitor_Interests", "visitor_attendant_id", userId),
		Db.removeByIdNoEnd("Visitor_Forms", "id", userId),
		Db.endDb(),
	])
		.then((data: [string[], string[], string[], string[], void]): void => {
			res.send({
				message: "success",
				data: data,
			});
			console.log("SUCCESS removing just the visitor form data");
		})

		.catch((err: [SQLResponse, SQLResponse, SQLResponse, SQLResponse, SQLResponse, void]): void => {
			res.send({
				message: "failure",
				error: (): void => {
					Db.getSqlError(err[0]);
					Db.getSqlError(err[1]);
					Db.getSqlError(err[2]);
					Db.getSqlError(err[3]);
					Db.getSqlError(err[4]);
				},
			});
			console.log("ERROR ", err);
		});
});

app.get('/get-visitor-by-id/:table/:id', (req: Request, res: Response): void => {
	const Db: DBMethods = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
	const userId: string = req.params.id;
	const table: string = req.params.table;

	Promise.all([
		Db.getBySelectColumnsNoEnd(['id'], table, 'id', userId),
		Db.endDb()
	])
		.then((data: [string[], void]): void => {
			res.send({
				message: 'success',
				data: data[0]
			});
			console.log('Success ', data);
		})
		.catch((err: [SQLResponse, void]): void => {
			res.send({
				message: 'failure',
				error: Db.getSqlError(err[0])
			});
			console.log('Failure getting data ', err);
		});
});

//Delete visitor form data and deletes the visitors from all attendance views.
app.delete("/remove-visitor-from-attendant-table/:firstName/:lastName/:id", (req: Request, res: Response): void => {
	const Db: DBMethods = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
	const userId: string[] = [req.params.id];
	const userName: string = `${req.params.firstName} ${req.params.lastName}`;
	

	Promise.all([
		Db.removeByIdNoEnd("Visitor_Children", "parentId", userId),
		Db.removeByIdNoEnd("Visitor_Spouse", "visitorSpouseId", userId),
		Db.removeByIdNoEnd("Visitor_Interests", "visitor_attendant_id", userId),
		Db.removeByIdNoEnd("Visitor_Forms", "id", userId),
	])
		.then((data: [string[], string[], string[], string[]]): void => {
			Promise.all([Db.removeByIdNoEnd("Attendants", "id", userId), Db.endDb()])
				.then((final: [string[], void]): void => {
					res.send({
						message: `Success, ${userName} has been deleted.`,
						data: final,
					});
					console.log("SUCCESS removing all visitor data ");
				})

				.catch((finalErr: [SQLResponse, SQLResponse]): void => {
					res.send({
						message: "failure",
						error: (): void => {
							Db.getSqlError(finalErr[0]), Db.getSqlError(finalErr[1]);
						},
					});
					console.log("ERROR DELETING ALL ", finalErr);
				});
		})
		.catch((err: [SQLResponse, SQLResponse, SQLResponse, SQLResponse, SQLResponse]): void => {
			res.send({
				message: "failure",
				error: (): void => {
					Db.getSqlError(err[0]);
					Db.getSqlError(err[1]);
					Db.getSqlError(err[2]);
					Db.getSqlError(err[3]);
					Db.getSqlError(err[4]);
				},
			});
			console.log("ERROR ", err);
		});
});

app.delete('/remove-visitor-from-attendance-keep-form-data/:id', (req: Request, res: Response): void => {
	const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
	const userId: number = parseInt(req.params.id);
	
	Promise.all([
		Db.setToNullNoEnd("Visitor_Children", ["id"], userId),
		Db.setToNullNoEnd("Visitor_Spouse", ["id"], userId),
		Db.setToNullNoEnd("Visitor_Interests", ["id"], userId),
		Db.setToNullNoEnd("Visitor_Forms", ["id"], userId)
	]);


})
