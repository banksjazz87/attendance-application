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

const paths = [
  "/dashboard",
  "/new-attendance",
  "/attendance",
  "search",
  "/people",
];

app.get(paths, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.post("/login", (req: Request, res: Response): any => {
  if (
    req.body.name === process.env.TEST_USER &&
    req.body.password === process.env.TEST_PASSWORD
  ) {
    const Db = new DBMethods(
      process.env.MYSQL_HOST,
      process.env.MYSQL_USER,
      process.env.TEST_DB,
      process.env.MYSQL_PASSWORD
    );
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
  const Db = new DBMethods(
    req.cookies.host,
    req.cookies.user,
    req.cookies.database,
    req.cookies.password
  );

  const dbValues = [
    Db.createTableName(req.body.groupDisplayName),
    req.body.ageGroup,
    req.body.group,
  ];
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
  const Db = new DBMethods(
    req.cookies.host,
    req.cookies.user,
    req.cookies.database,
    req.cookies.password
  );

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
  const Db = new DBMethods(
    req.cookies.host,
    req.cookies.user,
    req.cookies.database,
    req.cookies.password
  );

  let groupPlusDate = req.body.group + " " + req.body.title;
  let tableName = Db.createTableName(groupPlusDate);
  console.log("group = ", req.body.group, tableName, req.body.title);
  const columnNames = "title, displayTitle";
  const fieldValues = [tableName, req.body.title];

  Promise.all([
    Db.insert(req.body.group, columnNames, fieldValues),
    Db.createNewAttendance(tableName),
    Db.addApplicants(tableName, req.body.ageGroup)
  ])
    .then((data: [string[], string[], string[]]): void => {
      res.send({ message: "success", data: data });
    })
    .catch((err: [SQLResponse, SQLResponse, SQLResponse]): void => {
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

app.post("/new-group/create", (req: Request, res: Response) => {
  const Db = new DBMethods(
    req.cookies.host,
    req.cookies.user,
    req.cookies.database,
    req.cookies.password
  );

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
  const Db = new DBMethods(
    req.cookies.host,
    req.cookies.user,
    req.cookies.database,
    req.cookies.password
  );

  let group = Db.createTableName(req.body.name);
  const columnNames = "title, group_age";
  const values = [req.body.title, req.body.ageGroup];

  Promise.all([
    Db.createGroupTable(req.body.group),
    Db.insert(group, columnNames, values),
  ])
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
  const Db = new DBMethods(
    req.cookies.host,
    req.cookies.user,
    req.cookies.database,
    req.cookies.password
  );

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
  const Db = new DBMethods(
    req.cookies.host,
    req.cookies.user,
    req.cookies.database,
    req.cookies.password
  );

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

app.delete(
  "/remove-person/:firstName/:lastName/:id",
  (req: Request, res: Response) => {
    const Db = new DBMethods(
      req.cookies.host,
      req.cookies.user,
      req.cookies.database,
      req.cookies.password
    );

    let numOfId = parseInt(req.params.id);
    console.log(
      `${req.params.firstName}, ${req.params.lastName}, ${req.params.id}`
    );

    Db.removePerson(
      "Attendants",
      req.params.firstName,
      req.params.lastName,
      numOfId
    )
      .then((data: string[]): void => {
        res.send({
          message: `Success, ${req.params.firstName} ${req.params.lastName} has been deleted`,
        });
      })
      .catch((err: SQLResponse): void => {
        console.log("ERRRRORRRR", err);
        res.send({ message: "failure", error: Db.getSqlError(err) });
      });
  }
);

app.put("/update-attendant", (req: Request, res: Response): void => {
  const Db = new DBMethods(
    req.cookies.host,
    req.cookies.user,
    req.cookies.database,
    req.cookies.password
  );
  console.log("age =" + req.body.age + "memberType = " + req.body.memberType);
  Db.updatePerson("Attendants", req.body)
    .then((data: string[]): void => {
      res.send({ message: "Success", data: data });
    })
    .catch((err: SQLResponse): void => {
      res.send({ message: "failure", error: Db.getSqlError(err) });
    });
});
