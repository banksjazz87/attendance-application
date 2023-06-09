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
    console.log("testing heree");
});
app.use(express_1.default.static(path_1.default.join(__dirname, "../client/build")));
const paths = ["/dashboard", "/new-attendance", "/attendance", "search", "/people"];
app.get(paths, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../client/build", "index.html"));
});
app.post("/login", (req, res) => {
    if (req.body.name === process.env.TEST_USER && req.body.password === process.env.TEST_PASSWORD) {
        const Db = new databaseMethods_1.DBMethods(process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.TEST_DB, process.env.MYSQL_PASSWORD);
        Db.connect();
        res.cookie("account", "test");
        res.cookie("user", process.env.MYSQL_USER, {
            httpOnly: true,
            sameSite: "lax",
        });
        res.cookie("host", process.env.MYSQL_HOST, {
            httpOnly: true,
            sameSite: "lax",
        });
        res.cookie("database", process.env.TEST_DB, {
            httpOnly: true,
            sameSite: "lax",
        });
        res.cookie("password", process.env.MYSQL_PASSWORD, {
            httpOnly: true,
            sameSite: "lax",
        });
        res.cookie("loggedIn", true);
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
        res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
app.post("/new-attendance/create", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    let groupPlusDate = req.body.group + " " + req.body.title;
    let tableName = Db.createTableName(groupPlusDate);
    const columnNames = "title, displayTitle";
    const fieldValues = [tableName, req.body.title];
    const parentGroup = Db.createTableName(req.body.group);
    Promise.all([Db.insert(parentGroup, columnNames, fieldValues), Db.createNewAttendance(tableName)])
        .then((data) => {
        console.log("Success All", data);
        res.send({ message: "success", data: data, newTable: tableName });
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
    });
});
app.post("/new-attendance/insert/all", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.addAllApplicants(req.body.createdTableName)
        .then((data) => {
        console.log("success", data);
        res.send({ message: "success" });
    })
        .catch((err) => {
        console.log("failure", err);
        res.send({ message: "failure", error: err });
    });
});
app.post("/new-attendance/insert/select-attendants", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const tableName = req.body.createdTableName;
    const neededAge = req.body.allForm.ageGroup;
    Db.addSelectApplicants(tableName, neededAge)
        .then((data) => {
        console.log("success", data);
        res.send({ message: "success" });
    })
        .catch((err) => {
        console.log("failure", err);
        res.send({ message: "failure", error: err });
    });
});
app.post("/new-group/create", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    let tableName = Db.createTableName(req.body.group);
    Db.createGroupTable(tableName)
        .then((data) => {
        console.log(data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log("err", err);
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
    })
        .catch((err) => {
        console.log("Error", err);
        res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
/**
 * New endpoint
 */
app.post("/new-attendant/add-to-table/", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
});
app.get("/get-attendant/:firstName/:lastName", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.getPerson("Attendants", req.params.firstName, req.params.lastName)
        .then((data) => {
        console.log(data);
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
    })
        .catch((err) => {
        console.log("ERRRRORRRR", err);
        res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
app.put("/update-attendant", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    console.log("age =" + req.body.age + "memberType = " + req.body.memberType);
    Db.updatePerson("Attendants", req.body)
        .then((data) => {
        res.send({ message: "Success", data: data });
    })
        .catch((err) => {
        res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
app.get("/group-lists/attendance/:listParent", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.getTable(req.params.listParent, "DESC", "dateCreated")
        .then((data) => {
        console.log(data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log("Failure", err);
        res.send({ message: "Failure", error: Db.getSqlError(err) });
    });
});
app.get("/attendance/get-list/:listName", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    console.log("this is the table name", req.params.listName);
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
app.put("/attendance/update-table", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const neededTable = req.body.table;
    const neededId = req.body.attendantId;
    const neededLastName = req.body.lastName;
    const present = req.body.presentValue;
    Db.updateAttendance(neededTable, neededId, neededLastName, present)
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
    const allColumns = "id, firstName, lastName, age, memberType, present";
    const allData = [req.body.attendantId, req.body.firstName, req.body.lastName, req.body.age, req.body.memberType, req.body.presentValue];
    Db.insert(req.body.table, allColumns, allData)
        .then((data) => {
        console.log("Success", data);
        res.send({ message: "success", data: data });
    })
        .catch((err) => {
        console.log("Errorr inserting attendant", err);
        res.send({ message: "failure", data: Db.getSqlError(err) });
    });
});
app.delete("/attendance-sheet/remove-person/:firstName/:lastName/:id/:table", (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    const first = req.params.firstName;
    const last = req.params.lastName;
    const idNum = parseInt(req.params.id);
    const table = req.params.table;
    Promise.all([Db.removePerson(table, first, last, idNum), Db.removePerson("Attendants", first, last, idNum)])
        .then((data) => {
        res.send({
            message: "success",
            data: () => {
                return data[0], data[1];
            },
        });
        console.log(data[0], data[1]);
    })
        .catch((err) => {
        res.send({
            message: "failure",
            data: () => {
                Db.getSqlError(err[0]);
                Db.getSqlError(err[1]);
            },
        });
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
    })
        .catch((err) => {
        res.send({
            message: "failure",
            data: Db.getSqlError(err),
        });
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
