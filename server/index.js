// server/index.js

require("dotenv").config(); //database configuration files

const express = require("express");
const mysql = require("mysql");
// Express is the dependency, needed with npm -i express
const app = express();

// --- DATABASE SECTION ---
const host = process.env.MYSQL_HOST;
const database = process.env.MYSQL_DB;

const PORT = process.env.PORT || 3001; // Port for the node server

//Readying the connection
const connection = mysql.createConnection({
    host: process.env.MYSQL,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
});

//Making the connection
connection.connect(function (err) {
    //Any connection error goes here.
    if(err) {
        console.log("connection error", err.stack);
        return;
    }

    //no error
    console.log(`connected to database`);
});

const sql = "SELECT * FROM fm_radio WHERE fm_callsign REGEXP '^WMGL.*';"

//test the database query
connection.query(sql, function(err, results, fields) {
    if(err) throw err;

    console.log("Found these results", results);
});

//close the connection
connection.end();

// This goes before listen
// res stands for response
// This is a test
app.get("/api", (req, res) => {
    res.json({message: "Server connection test success!"});
});

//mariadb query
app.get("/sqltest", (req, res) => {
    res.json({message: `Connecting to database ${database} on ${host}`});
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

