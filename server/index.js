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
const conn = mysql.createConnection({
    host: process.env.MYSQL,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
});

//Making the connection the old days
conn.connect(function (err) {
    //Any connection error goes here.
    if(err) {
        console.log("connection error", err.stack);
        return;
    }

    //no error
    console.log(`connected to database`);
});




function getAmStations(){
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM am_radio;`
        conn.query(sql, function(err, results, fields){
            if(err) {
                return reject(err);
            }

            return resolve(results);
        });
    });
}

//test the database query
var sql = "SELECT * FROM fm_radio WHERE fm_callsign REGEXP '^WMGL.*';";
conn.query(sql, function(err, results, fields) { //returns an array
    if(err) throw err;

    console.log("Found these results", results);
});

//close the connection
conn.end();
// This goes before listen
// res stands for response
// This is a test
app.get("/api", (req, res) => {
    res.json({message: "Server connection test success!"});
});

//mariadb query
app.get("/sqltest", (req, res) => {
    res.json({message: `Connected to database ${database} on ${host}`});
});

app.get("/sam", (req, res, next) => {
    sql = "SELECT * FROM am_radio;";
    /*
    connection.query(sql, function(err, results, fields) {
        if(err) throw err;
    
        console.log("Found these results", results);
    });
    */

    return getAmStations().then((data) =>{
        //Get the data returning a promise,
        return res.render('AmStations', data);
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

//export the functions with module.export
module.exports = {
    getAmStations,
}

