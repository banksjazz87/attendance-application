import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { DBMethods } from "./dbQueries/databaseMethods";
import { SQLResponse } from "./interfaces/interfaces.ts";
import {TotalSentSum} from "./client/src/types/interfaces.ts";

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
  console.log("testing heree");
});

app.use(express.static(path.join(__dirname, "../client/build")));

const paths = ["/dashboard", "/new-attendance", "/attendance", "/search", "/people/"];

app.get(paths, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.post("/login", (req: Request, res: Response): any => {
  if (req.body.name === process.env.TEST_USER && req.body.password === process.env.TEST_PASSWORD) {
    const Db = new DBMethods(process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.TEST_DB, process.env.MYSQL_PASSWORD);
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

  Promise.all([Db.insert('all_attendance', columnNames, fieldValues), Db.insert("Attendance_Totals", totalColNames, totalFieldValues), Db.addNewColumnToMaster(tableName, columnTitle)])
  .then((data: [string[], string[], string[]]): void => {
    console.log("Success All", data);
    res.send({ message: "success", data: data, newTable: tableName });
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
  });
});

app.post('/new-attendance/create/master/table', (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
  
  let groupAttendance = req.body.group + " " + "attendance";
  let tableName = Db.createTableName(groupAttendance);

  Db.createNewAttendance(tableName)
    .then((data: string[]): void => {
      console.log("Success", data);
      res.send({ message: "success", data: data })
    });
});

app.post("/new-attendance/insert/all", (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  Db.addAllActiveApplicants(req.body.createdTableName)
    .then((data: string[]): void => {
      console.log("success", data);
      res.send({ message: "success" });
    })
    .catch((err: SQLResponse): void => {
      console.log("failure", err);
      res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});

app.post("/new-attendance/insert/select-attendants", (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  const tableName = req.body.createdTableName;
  const neededAge = req.body.allForm.ageGroup;

  Db.addSelectApplicants(tableName, neededAge)
    .then((data: string[]): void => {
      console.log("success", data);
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
    })
    .catch((err: SQLResponse): void => {
      console.log("Error", err);
      res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});

app.post("/new-attendant/add-to-table/", (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
});

app.get("/get-attendant/:firstName/:lastName", (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  Db.getPerson("Attendants", req.params.firstName, req.params.lastName)
    .then((data: string[]): void => {
      console.log(data);
      res.send({ message: "success", data: data });
    })
    .catch((err: SQLResponse): void => {
      console.log("FAILURE", err);
      res.send({ message: "failure", data: err });
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
    })
    .catch((err: SQLResponse): void => {
      res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});

app.get('/group-lists/attendance/:group', (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
  const groupValue = Db.createTableName(req.params.group);

  Db.getAttendanceByGroupName(groupValue, "dateCreated", "desc")
    .then((data: string[]): void => {
      console.log(data);
      res.send({ message: "success", data: data });
    })
    .catch((err: SQLResponse): void => {
      console.log('Failureeee', err);
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
      res.send({ message: "failure", data: Db.getSqlError(err) });
    });
});


app.get('/attendance/get-list-by-name/:tableName/:colName', (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
  const tableName = req.params.tableName;
  const columnName = req.params.colName;

  Db.getTableByColumn(tableName, 'ASC', columnName, 'lastName')
  .then((data: string[]): void => {
    console.log(data);
    res.send({ message: "success", data: data });
  })
  .catch((err: SQLResponse): void => {
    console.log("there was an error", err);
    res.send({ message: "failure", data: Db.getSqlError(err) });
  });
})

app.put("/attendance/update-table/:columnName/:presentValue", (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  console.log(req.body);

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
      res.send({ message: "Failure", data: Db.getSqlError(err) });
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
      res.send({ message: "failure", data: Db.getSqlError(err) });
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
        data: data
      });
      console.log(data);
    })
    .catch((err: SQLResponse): void => {
      res.send({
        message: "failure",
        data: Db.getSqlError(err)
      });
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
    })
    .catch((err: SQLResponse): void => {
      res.send({
        message: "failure",
        data: Db.getSqlError(err),
      });
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
        data: Db.getSqlError(err),
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
        data: Db.getSqlError(err),
      });
      console.log(err);
    });
});

app.put('/attendance-total/update/', (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
  
  let tableName = Db.createTableName(req.body.title);
  let groupValue = req.body.group;

  let totals: TotalSentSum = {
    children: req.body.data.totalChildren,
    youth: req.body.data.totalYouth,
    adults: req.body.data.totalAdults,
    members: req.body.data.totalMembers,
    visitors: req.body.data.totalVisitors
  }

  Db.updateTotalTable(tableName, groupValue, totals.children, totals.youth, totals.adults, totals.members, totals.visitors)
    .then((data: string[]): void => {
      res.send({
        message: "success",
        data: data
      });
      console.log(data);
    })
    .catch((err: SQLResponse): void => {
      res.send({
        message: "failure", 
        error: Db.getSqlError(err)
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
    })
    .catch((err: SQLResponse): void => {
      res.send({
        message: "failure", 
        err: Db.getSqlError(err),
      });
      console.log(err);
    });
});

app.get('/group-years/:groupName', (req: Request, res: Response): void => {

  const group: string = req.params.groupName;

  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  Db.getDistinctStatisticYears(group)
    .then((data: string[]): void => {
      res.send({
        message: "success", 
        data: data
      });
    })
    .catch((err: SQLResponse): void => {
      res.send({
        message: "failure", 
        error: Db.getSqlError(err)
      });
      console.log('Error', err);
    });
});

app.get('/group-months/:yearDate/:groupName', (req: Request, res: Response): void => {
  const year: string = req.params.yearDate;
  const group: string = req.params.groupName;
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  Db.getDistinctStatisticMonths(group, year)
    .then((data: string[]): void => {
      res.send({
        message: "success", 
        data: data
      });
    })
    .catch((err: SQLResponse): void => {
      res.send({
        message: "failure", 
        error: Db.getSqlError(err)
      });
      console.log('Error', err);
    });
});
