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
const databaseMethods_1 = require("./dbQueries/databaseMethods");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../client/build")));
app.get("/*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../client/build", "index.html"));
});
app.post("/login", (req, res) => {
    if (req.body.name === process.env.TEST_USER &&
        req.body.password === process.env.TEST_PASSWORD) {
        const Db = new databaseMethods_1.DBMethods(process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD);
        Db.connect();
        res.send({ message: "valid" });
    }
    else {
        res.send({ message: "invalid" });
    }
});
const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
