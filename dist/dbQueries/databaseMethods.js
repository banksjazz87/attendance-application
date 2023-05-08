"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBMethods = void 0;
const mysql_1 = __importDefault(require("mysql"));
class DBMethods {
    constructor(hostName, userName, userDb, userPassword) {
        this.hostName = hostName;
        this.userName = userName;
        this.userDb = userDb;
        this.userPassword = userPassword;
    }
    getSqlError(obj) {
        const message = `The following error has occurred: ${obj.code} with sqlMessage: ${obj.sqlMessage}`;
        return message;
    }
    db() {
        let connection = mysql_1.default.createConnection({
            host: this.hostName,
            user: this.userName,
            database: this.userDb,
            password: this.userPassword,
        });
        return connection;
    }
    connect() {
        const database = this.db();
        database.connect((err) => {
            if (err) {
                console.log("err", err);
            }
            else {
                console.log("you are connected");
            }
        });
        database.end((err) => err ? console.log("error, disconnecting") : console.log("disconnected"));
    }
    endDb() {
        const database = this.db();
        database.end((err) => {
            err ? console.log("error, disconnecting") : console.log("disconnected");
        });
    }
    insert(table, columns, values) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            let sql = `INSERT INTO ${table} (${columns}) VALUES (?);`;
            database.query(sql, [values], (err, results) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(results);
                }
            });
            this.endDb();
        });
    }
    searchByValue(table, column, value) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            let sql = `SELECT * FROM ${table} WHERE ${column} = "${value}";`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getTable(table, order, column) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            let sql = `SELECT * FROM ${table} ORDER BY ${column} ${order};`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    createGroupTable(tableName) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            let sql = `CREATE TABLE ${tableName} (id int NOT NUll AUTO_INCREMENT, title varchar(50) DEFAULT NULL, displayTitle varchar(50) DEFAULT NULL, dateCreated datetime DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id));`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    createTableName(table) {
        let result = table.replace(/[.-/?! ]/g, "_");
        let resultNoSpaces = result.replace(/ /g, "_");
        return resultNoSpaces;
    }
    //This will be used to create a new attendance table.
    createNewAttendance(tableName) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            let sql = `CREATE TABLE ${tableName} (id smallint NOT NULL AUTO_INCREMENT, firstName varchar(40) DEFAULT NULL,
        lastName varchar(40) DEFAULT NULL, child tinyint DEFAULT 0, youth tinyint DEFAULT 0, adult tinyint DEFAULT 0, member tinyint DEFAULT 0, visitor tinyint DEFAULT 0, present tinyint DEFAULT 0, PRIMARY KEY (id));`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    //This will be used to insert all of the people of a certain age group into an attendance table.
    insertAgeGroup(tableName, group) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = () => {
                if (group === "all") {
                    return `INSERT INTO ${tableName} (id, firstName, lastName, child, youth, adult, member, visitor) SELECT * FROM People;`;
                }
                else {
                    return `INSERT INTO ${tableName} (id, firstName, lastName, child, youth, adult, member, visitor) SELECT * FROM People WHERE ${group} = 1;`;
                }
            };
            let sql = neededSql();
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    removePerson(tableName, firstName, lastName, id) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `DELETE FROM ${tableName} WHERE firstName = "${firstName}" AND lastName = "${lastName}" AND id = ${id};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    updatePerson(tableName, obj) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `UPDATE ${tableName} SET firstName = "${obj.firstName}", lastName = "${obj.lastName}", child = "${obj.child}", youth = "${obj.youth}", adult = "${obj.adult}", member = "${obj.member}", visitor = "${obj.visitor}" WHERE id = ${obj.id};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
}
exports.DBMethods = DBMethods;
