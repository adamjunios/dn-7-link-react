const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();
const mysql = require("mysql");

var corsOptions = {
  origin: "http://localhost:3001",
};

//connect db
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "dn-7-link",
  charset: "utf8mb4",
});

// app.use(cors(corsOptions));
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM categories";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.get("/api/getlinks/:linkCategory", (req, res) => {
  const linkCategory = req.params.linkCategory;
  const sqlSelectLinks = "SELECT * FROM links WHERE category_id=?";

  db.query(sqlSelectLinks, linkCategory, (err, result) => {
    // if (err) res.send(err);
    res.send(result);
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
