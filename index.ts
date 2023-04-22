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
const port = process.env.PORT || 3500;

app.listen(port, (): void => {
  console.log(`Server is running on port ${port}`);
});

app.use(express.static(path.join(__dirname, "../client/build")));

const neededCookies = 'req.cookies.host, req.cookies.user,req.cookies.database,req.cookies.password';

app.get("/*", (req: Request, res: Response) => {
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
    
    res.cookie('account', 'test');
    res.cookie('user', process.env.MYSQL_USER, {httpOnly: true, sameSite: 'lax'});
    res.cookie('host', process.env.MYSQL_HOST, {httpOnly: true, sameSite: 'lax'});
    res.cookie('database', process.env.TEST_DB, {httpOnly: true, sameSite: 'lax'});
    res.cookie('password', process.env.MYSQL_PASSWORD, {httpOnly: true, sameSite: 'lax'});
    res.cookie('loggedIn', true);
    res.send({ message: "valid" });

  } else {
    res.send({ message: "invalid" });
  }
});

app.post('/new-group', (req: Request, res: Response) => {
    const dbValues = [req.body.name];
    const dbColumns = 'name';

    const Db = new DBMethods(
      req.cookies.host,
      req.cookies.user,
      req.cookies.database,
      req.cookies.password
    );

   Db.insert('group_names', dbColumns, dbValues).then((data: string[]): void => {
      res.send({'message': 'success', data: data});
    }).catch((err: SQLResponse): void => {
      console.log(Db.getSqlError(err));
      res.send({'message': 'failure', 'error': Db.getSqlError(err)});
    });
});


