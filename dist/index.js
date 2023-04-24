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
const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use(express_1.default.static(path_1.default.join(__dirname, "../client/build")));
const neededCookies = 'req.cookies.host, req.cookies.user,req.cookies.database,req.cookies.password';
/*app.get("/*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});*/
app.post("/login", (req, res) => {
    if (req.body.name === process.env.TEST_USER &&
        req.body.password === process.env.TEST_PASSWORD) {
        const Db = new databaseMethods_1.DBMethods(process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.TEST_DB, process.env.MYSQL_PASSWORD);
        Db.connect();
        res.cookie('account', 'test');
        res.cookie('user', process.env.MYSQL_USER, { httpOnly: true, sameSite: 'lax' });
        res.cookie('host', process.env.MYSQL_HOST, { httpOnly: true, sameSite: 'lax' });
        res.cookie('database', process.env.TEST_DB, { httpOnly: true, sameSite: 'lax' });
        res.cookie('password', process.env.MYSQL_PASSWORD, { httpOnly: true, sameSite: 'lax' });
        res.cookie('loggedIn', true);
        res.send({ message: "valid" });
    }
    else {
        res.send({ message: "invalid" });
    }
});
app.post('/new-group', (req, res) => {
    const dbValues = [req.body.name];
    const dbColumns = 'name';
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.insert('group_names', dbColumns, dbValues).then((data) => {
        res.send({ 'message': 'success', data: data });
    }).catch((err) => {
        console.log(Db.getSqlError(err));
        res.send({ 'message': 'failure', 'error': Db.getSqlError(err) });
    });
});
app.get('/groups', (req, res) => {
    const Db = new databaseMethods_1.DBMethods(req.cookies.host, req.cookies.user, req.cookies.database, req.cookies.password);
    Db.getTable('group_names', 'ASC', 'name')
        .then((data) => {
        console.log(data);
        res.send({ "message": "success", "data": data });
    })
        .catch((err) => {
        res.send({ "message": "failure", "data": Db.getSqlError(err) });
    });
});
