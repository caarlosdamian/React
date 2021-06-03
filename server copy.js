//set up express server
const express = require("express");
const app = express();
//set up sql server
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());
//create a variable called db to make your SQL Statements
const db = mysql.createConnection({
  user: "",
  host: "",
  password: "",
  database: "",
});

//GET REQUEST to database to retrieve customers information from database
app.get("/customers", (req, res) => {
  db.query("SELECT * FROM customer_info", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Update customers
app.put("/update", (req, res) => {
  const ID = req.body.ID;
  const contacted = req.body.contacted;

  db.query(
    "UPDATE customer_info SET contacted = ? WHERE ID = ?",
    [contacted, ID],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//Delete customers
app.delete("/stats/delete/:ID", (req, res) => {
  const ID = req.params.ID;

  db.query("DELETE FROM customer_info WHERE ID = ?", ID, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//api call to pull intents data
app.get("/intents", (req, res) => {
  db.query("SELECT * FROM data_analytics", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/countintents", (req, res) => {
  db.query(
    "SELECT SUM(CASE WHEN intent IN ('Products', 'Land Transport') THEN 1 END) AS products, SUM(CASE WHEN intent IN ('Air Freight', 'Industry Solutions', 'Aerospace and Defense') THEN 1 END) AS industry_solutions, SUM(CASE WHEN intent in ('Profile', 'Contact Us') THEN 1 END) AS about_us FROM data_analytics",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//check if backend server is running
app.listen(3001, () => {
  console.log("Your server is running on port 3001");
});
