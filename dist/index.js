"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const databaseMethods_1 = require("./dbQueries/databaseMethods");
dotenv_1.default.config();
const app = (0, express_1.default)();
//All middleware functions will go here.
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
const port = process.env.PORT || 3900;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use(express_1.default.static(path_1.default.join(__dirname, "../client/build")));
const paths = ["/dashboard", "/new-attendance", "/attendance", "/search", "/people", "/visitors"];
app.get(paths, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../client/build", "index.html"));
});
app.post("/login", (req, res) => {
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
    }
    else if (req.body.name === process.env.HEROKU_USER && req.body.password === process.env.HEROKU_PASSWORD) {
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
    }
    else if (req.body.name === process.env.CHAPEL_USER && req.body.password === process.env.CHAPEL_PASSWORD) {
        res.cookie("account", "Chapel", {
            maxAge: 31556952 * 1000
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
    }
    else {
        res.send({ message: "invalid" });
    }
});
app.post("/new-group", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const dbValues = [Db.createTableName(req.body.groupDisplayName), req.body.ageGroup, req.body.group];
    const dbColumns = "name, age_group, displayName";
    Db.insert("group_names", dbColumns, dbValues)
        .then((data) => {
        console.log(data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log(Db.getSqlError(err));
        res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
app.get("/groups", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.getTable("group_names", "ASC", "name")
        .then((data) => {
        console.log(data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log(err);
        res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
app.post("/new-attendance/create", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    let groupAttendance = req.body.group + " " + "attendance";
    let columnTitle = Db.createTableName(req.body.title);
    let tableName = Db.createTableName(groupAttendance);
    let attendanceColumnName = req.body.title;
    const columnNames = "title, displayTitle, parentGroup, parentGroupValue";
    const fieldValues = [Db.createTableName(attendanceColumnName), req.body.title, req.body.group, Db.createTableName(req.body.group)];
    const totalColNames = "groupName, displayTitle, totalChildren, totalYouth, totalAdults, totalMembers, totalVisitors, title";
    const totalFieldValues = [Db.createTableName(req.body.group), req.body.title, 0, 0, 0, 0, 0, Db.createTableName(attendanceColumnName)];
    Promise.all([Db.insertNoEnd("all_attendance", columnNames, fieldValues), Db.insertNoEnd("Attendance_Totals", totalColNames, totalFieldValues), Db.addNewColumnToMasterNoEnd(tableName, columnTitle)])
        .then((data) => {
        console.log(data);
        res.send({ message: "success", data: data, newTable: tableName });
        Db.endDb();
    })
        .catch((err) => {
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
app.post("/new-attendance/create/master/table", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    let groupAttendance = req.body.group + " " + "attendance";
    let tableName = Db.createTableName(groupAttendance);
    Db.createNewAttendance(tableName).then((data) => {
        console.log(data);
        res.send({ message: "success", data: data });
    });
});
app.post("/new-attendance/insert/all", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const groupTable = req.body.group + " attendance";
    const tableName = Db.createTableName(groupTable);
    Db.addAllActiveApplicants(tableName)
        .then((data) => {
        console.log(data);
        res.send({ message: "success" });
    })
        .catch((err) => {
        console.log("failure", err);
        res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
app.post("/new-attendance/insert/select-attendants", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const groupTable = req.body.group + " attendance";
    const tableName = Db.createTableName(groupTable);
    const neededAge = req.body.ageGroup;
    Db.addSelectApplicants(tableName, neededAge)
        .then((data) => {
        console.log(data);
        res.send({ message: "success" });
    })
        .catch((err) => {
        console.log("failure", err);
        res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
app.post("/new-group/new-attendance/create", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    let group = Db.createTableName(req.body.name);
    const columnNames = "title, group_age";
    const values = [req.body.title, req.body.ageGroup];
    Promise.all([Db.createGroupTable(req.body.group), Db.insert(group, columnNames, values)])
        .then((data) => {
        console.log(data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log("err", err);
        res.send({
            message: "failure",
            error: () => {
                Db.getSqlError(err[0]), Db.getSqlError(err[1]);
            },
        });
    });
});
app.get("/all-attendants", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.getTable("Attendants", "ASC", "lastName")
        .then((data) => {
        console.log(data);
        res.send({ message: "Success", data: data });
    })
        .catch((err) => {
        console.log(err);
        res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
app.post("/new-attendant", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const neededValues = Object.values(req.body);
    const neededColumns = Object.keys(req.body).toString();
    Db.insert("Attendants", neededColumns, neededValues)
        .then((data) => {
        res.send({ message: "Success", data: data });
        console.log(data);
    })
        .catch((err) => {
        console.log("Error", err);
        res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
app.get("/get-attendant/:firstName/:lastName", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.getPerson("Attendants", req.params.firstName, req.params.lastName)
        .then((data) => {
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log("FAILURE", err);
        res.send({ message: "failure", data: err });
    });
});
app.delete("/remove-person/:firstName/:lastName/:id", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    let numOfId = parseInt(req.params.id);
    console.log(`${req.params.firstName}, ${req.params.lastName}, ${req.params.id}`);
    Db.removePerson("Attendants", req.params.firstName, req.params.lastName, numOfId)
        .then((data) => {
        res.send({
            message: `Success, ${req.params.firstName} ${req.params.lastName} has been deleted`,
        });
        console.log(data);
    })
        .catch((err) => {
        console.log("ERRRRORRRR", err);
        res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
app.put("/update-attendant", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.updatePerson("Attendants", req.body)
        .then((data) => {
        res.send({ message: "Success", data: data });
        console.log(data);
    })
        .catch((err) => {
        res.send({ message: "failure", error: Db.getSqlError(err) });
        console.log(err);
    });
});
app.get("/group-lists/attendance/:group", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const groupValue = Db.createTableName(req.params.group);
    Db.getAttendanceByGroupName(groupValue, "dateCreated", "desc")
        .then((data) => {
        console.log(data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log("Failureeee", err);
        res.send({ message: "Failure", error: Db.getSqlError(err) });
    });
});
app.get("/attendance/get-list/:listName", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.getTable(req.params.listName, "ASC", "lastName")
        .then((data) => {
        console.log(data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log("there was an error", err);
        res.send({ message: "failure", data: Db.getSqlError(err) });
    });
});
app.get("/attendance/get-list-by-name/:tableName/:colName", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const tableName = Db.createTableName(req.params.tableName);
    const columnName = Db.createTableName(req.params.colName);
    Db.getTableByColumn(tableName, "ASC", columnName, "lastName")
        .then((data) => {
        console.log(data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log("there was an error", err);
        res.send({ message: "failure", data: Db.getSqlError(err) });
    });
});
app.put("/attendance/update-table/:columnName/:presentValue", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const neededTable = req.body.table;
    const neededId = req.body.attendantId;
    const neededLastName = req.body.lastName;
    const present = parseInt(req.params.presentValue);
    const column = req.params.columnName;
    Db.updateAttendance(neededTable, column, neededId, neededLastName, present)
        .then((data) => {
        console.log(data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log("FAILURE", err);
        res.send({ message: "Failure", data: Db.getSqlError(err) });
    });
});
app.post("/attendance/insert/attendant", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const neededTable = req.body.table;
    const allColumns = `id, firstName, lastName, age, memberType, ${req.body.attendanceColumn}`;
    const allData = [req.body.attendantId, req.body.firstName, req.body.lastName, req.body.age, req.body.memberType, 1];
    Db.insert(neededTable, allColumns, allData)
        .then((data) => {
        console.log("Success", data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log("Errorr inserting attendant", err);
        res.send({ message: "failure", data: Db.getSqlError(err) });
    });
});
app.post('/attendance/insert/new-attendants/:tableName', (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const neededTable = req.params.tableName;
    const allColumns = `id, firstName, lastName, age, memberType`;
    Db.addBulkSelectApplicants(neededTable, allColumns, req.body.neededFields)
        .then((data) => {
        console.log('success', data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log('Error inserting multiple attendants', err);
        res.send({ message: "failure", data: Db.getSqlError(err) });
    });
});
app.delete("/attendance-sheet/remove-person/:firstName/:lastName/:id/:group", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const first = req.params.firstName;
    const last = req.params.lastName;
    const idNum = parseInt(req.params.id);
    const table = `${req.params.group}_attendance`;
    Db.removePerson(table, first, last, idNum)
        .then((data) => {
        res.send({
            message: `Success, ${first} ${last} has been removed from the ${table} table.`,
            data: data,
        });
        console.log(data);
    })
        .catch((err) => {
        res.send({
            message: "failure",
            data: Db.getSqlError(err),
        });
        console.log(err);
    });
});
app.get("/row-count/:tableName", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.numberOfRows(req.params.tableName)
        .then((data) => {
        res.send({
            message: "success",
            data: data,
        });
        console.log(data);
    })
        .catch((err) => {
        res.send({
            message: "failure",
            data: Db.getSqlError(err),
        });
        console.log(err);
    });
});
app.get("/table-return-few/:tableName/:limitNum/:offsetNum/:fieldOrder/:orderValue", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.limitNumberOfRowsReturned(req.params.tableName, parseInt(req.params.limitNum), parseInt(req.params.offsetNum), req.params.fieldOrder, req.params.orderValue)
        .then((data) => {
        res.send({
            message: "success",
            data: data,
        });
        console.log(data);
    })
        .catch((err) => {
        res.send({
            message: "failure",
            data: Db.getSqlError(err),
        });
        console.log(err);
    });
});
app.get("/people/search/:table/:partialName", (req, res) => {
    let tableName = req.params.table;
    let partial = req.params.partialName;
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.searchForPartialName(tableName, partial)
        .then((data) => {
        res.send({
            message: "success",
            data: data,
        });
        console.log(data);
    })
        .catch((err) => {
        res.send({
            message: "failure",
            data: Db.getSqlError(err),
        });
        console.log(err);
    });
});
app.put("/attendance-total/update/", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    let tableName = Db.createTableName(req.body.title);
    let groupValue = req.body.group;
    let totals = {
        children: req.body.data.totalChildren,
        youth: req.body.data.totalYouth,
        adults: req.body.data.totalAdults,
        members: req.body.data.totalMembers,
        visitors: req.body.data.totalVisitors,
    };
    Db.updateTotalTable(tableName, groupValue, totals.children, totals.youth, totals.adults, totals.members, totals.visitors)
        .then((data) => {
        res.send({
            message: "success",
            data: data,
        });
        console.log(data);
    })
        .catch((err) => {
        res.send({
            message: "failure",
            error: Db.getSqlError(err),
        });
        console.log(err);
    });
});
app.get("/group-statistics/:group/:month/:year", (req, res) => {
    const year = req.params.year;
    const month = req.params.month;
    const group = req.params.group;
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.getMonthStatistics(group, month, year)
        .then((data) => {
        res.send({
            message: "success",
            data: data,
        });
        console.log(data);
    })
        .catch((err) => {
        res.send({
            message: "failure",
            err: Db.getSqlError(err),
        });
        console.log(err);
    });
});
app.get("/group-years/:groupName", (req, res) => {
    const group = req.params.groupName;
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.getDistinctStatisticYears(group)
        .then((data) => {
        res.send({
            message: "success",
            data: data,
        });
        console.log(data);
    })
        .catch((err) => {
        res.send({
            message: "failure",
            error: Db.getSqlError(err),
        });
        console.log("Error", err);
    });
});
app.get("/group-months/:yearDate/:groupName", (req, res) => {
    const year = req.params.yearDate;
    const group = req.params.groupName;
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.getDistinctStatisticMonths(group, year)
        .then((data) => {
        res.send({
            message: "success",
            data: data,
        });
        console.log(data);
    })
        .catch((err) => {
        res.send({
            message: "failure",
            error: Db.getSqlError(err),
        });
        console.log("Error", err);
    });
});
app.get('/all-visitors/:limit/:offset', (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const neededColumns = ['id', 'visitorId', 'firstName', 'lastName', 'phone', 'dateCreated'];
    const reqLimit = parseInt(req.params.limit);
    const reqOffset = parseInt(req.params.offset);
    Db.selectFewWithLimit('Visitor_Forms', neededColumns, reqLimit, reqOffset, 'dateCreated', 'DESC', 'id')
        .then((data) => {
        res.send({
            message: "success",
            data: data,
        });
        console.log(data);
    })
        .catch((err) => {
        res.send({
            message: "failure",
            error: Db.getSqlError(err)
        });
        console.log("Error", err);
    });
});
