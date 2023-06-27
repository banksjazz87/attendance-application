import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { DBMethods } from "./dbQueries/databaseMethods";
import { SQLResponse } from "./interfaces/interfaces.ts";

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

const paths = ["/dashboard", "/new-attendance", "/attendance", "search", "/people"];

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

  let groupPlusDate = req.body.group + " " + req.body.title;
  let tableName = Db.createTableName(groupPlusDate);
  const columnNames = "title, displayTitle";
  const fieldValues = [tableName, req.body.title];
  const parentGroup = Db.createTableName(req.body.group);

  Promise.all([Db.insert(parentGroup, columnNames, fieldValues), Db.createNewAttendance(tableName)])
    .then((data: [string[], string[]]): void => {
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

app.post("/new-attendance/insert/all", (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  Db.addAllApplicants(req.body.createdTableName)
    .then((data: string[]): void => {
      console.log("success", data);
      res.send({ message: "success" });
    })
    .catch((err: SQLResponse): void => {
      console.log("failure", err);
      res.send({ message: "failure", error: err });
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
      res.send({ message: "failure", error: err });
    });
});

app.post("/new-group/create", (req: Request, res: Response) => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  let tableName = Db.createTableName(req.body.group);
  Db.createGroupTable(tableName)
    .then((data: string[]): void => {
      console.log(data);
      res.send({ message: "success", data: data });
    })
    .catch((err: SQLResponse): void => {
      console.log("err", err);
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

/**
 * New endpoint
 */
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
  console.log("age =" + req.body.age + "memberType = " + req.body.memberType);
  Db.updatePerson("Attendants", req.body)
    .then((data: string[]): void => {
      res.send({ message: "Success", data: data });
    })
    .catch((err: SQLResponse): void => {
      res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});

app.get("/group-lists/attendance/:listParent", (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  Db.getTable(req.params.listParent, "DESC", "dateCreated")
    .then((data: string[]): void => {
      console.log(data);
      res.send({ message: "success", data: data });
    })
    .catch((err: SQLResponse): void => {
      console.log("Failure", err);
      res.send({ message: "Failure", error: Db.getSqlError(err) });
    });
});

app.get("/attendance/get-list/:listName", (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  console.log("this is the table name", req.params.listName);
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

app.put("/attendance/update-table", (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  const neededTable = req.body.table;
  const neededId = req.body.attendantId;
  const neededLastName = req.body.lastName;
  const present = req.body.presentValue;

  Db.updateAttendance(neededTable, neededId, neededLastName, present)
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
  const allColumns: string = "id, firstName, lastName, age, memberType, present";
  const allData: string[] = [req.body.attendantId, req.body.firstName, req.body.lastName, req.body.age, req.body.memberType, req.body.presentValue];

  Db.insert(req.body.table, allColumns, allData)
    .then((data: string[]): void => {
      console.log("Success", data);
      res.send({ message: "success", data: data });
    })
    .catch((err: SQLResponse): void => {
      console.log("Errorr inserting attendant", err);
      res.send({ message: "failure", data: Db.getSqlError(err) });
    });
});

app.delete("/attendance-sheet/remove-person/:firstName/:lastName/:id/:table", (req: Request, res: Response): void => {
  const Db = new DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);

  const first = req.params.firstName;
  const last = req.params.lastName;
  const idNum = parseInt(req.params.id);
  const table = req.params.table;

  Promise.all([Db.removePerson(table, first, last, idNum), Db.removePerson("Attendants", first, last, idNum)])
    .then((data: [string[], string[]]): void => {
      res.send({
        message: "success",
        data: () => {
          return data[0], data[1];
        },
      });
      console.log(data[0], data[1]);
    })
    .catch((err: SQLResponse[]): void => {
      res.send({
        message: "failure",
        data: () => {
          Db.getSqlError(err[0]);
          Db.getSqlError(err[1]);
        },
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
