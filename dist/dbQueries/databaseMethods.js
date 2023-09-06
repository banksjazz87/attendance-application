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
        database.end((err) => (err ? console.log("error, disconnecting") : console.log("disconnected")));
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
                err ? reject(err) : resolve(results);
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
        lastName varchar(40) DEFAULT NULL, age varchar(30), memberType varchar(30), present tinyint DEFAULT 0, PRIMARY KEY (id));`;
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
                    return `INSERT INTO ${tableName} (id, firstName, lastName, age, memberType) SELECT * FROM People;`;
                }
                else {
                    return `INSERT INTO ${tableName} (id, firstName, lastName, age, memberType) SELECT * FROM People WHERE memberType = ${group};`;
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
    getPerson(tableName, first, last) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `SELECT * FROM ${tableName} WHERE firstName = "${first}" AND lastName = "${last}";`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    updatePerson(tableName, obj) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `UPDATE ${tableName} SET firstName = "${obj.firstName}", lastName = "${obj.lastName}", age = "${obj.age}", memberType = "${obj.memberType}" WHERE id = ${obj.id};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    addAllApplicants(table) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT * FROM Attendants;`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    addSelectApplicants(table, neededAge) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT * FROM Attendants WHERE age = "${neededAge}";`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    updateAttendance(table, attendeeId, attendeeLastName, status) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `UPDATE ${table} SET present = ${status} WHERE id = ${attendeeId} AND lastName = "${attendeeLastName}";`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    //Used to return the number of rows in a table.
    numberOfRows(table) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `SELECT COUNT(*) AS total FROM ${table};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    //Used to return a limited number of rows from a table.
    limitNumberOfRowsReturned(table, limit, offset, fieldOrder, order) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `SELECT * FROM ${table} ORDER BY ${fieldOrder} ${order} LIMIT ${limit} OFFSET ${offset}`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    //Used to return a partial match of rows from a table.
    searchForPartialName(table, partialName) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `SELECT * FROM ${table} WHERE firstName LIKE "%${partialName}%" OR lastName LIKE "%${partialName}%"`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    updateTotalTable(currentTable, children, youth, adults, members, visitors) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const total = children + youth + adults;
            const neededSql = `UPDATE Attendance_Totals SET totalChildren = ${children}, totalYouth = ${youth}, totalAdults = ${adults}, totalMembers = ${members}, totalVisitors = ${visitors}, totalCount = ${total} WHERE title = "${currentTable}";`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getMonthStatistics(groupName, monthName, yearDate) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `SELECT * FROM Attendance_Totals WHERE MONTHNAME(dateCreated) = "${monthName}" AND YEAR(dateCreated) = "${yearDate}" AND groupName = "${groupName}" ORDER BY dateCreated ASC;`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getDistinctStatisticYears(group) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            const neededSql = `SELECT DISTINCT YEAR(dateCreated) AS years FROM Attendance_Totals WHERE groupName = "${group}" ORDER BY years DESC;`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
}
exports.DBMethods = DBMethods;
