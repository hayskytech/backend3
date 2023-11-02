const express = require("express")
const bodyParser = require("body-parser")
const mysql = require("mysql")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(4000, () => {
  console.log("Server is running on port 4000");
})

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "backend3"
});

db.getConnection(function (err, connection) {
  if (err) {
    console.err("Error connecting to the database", err);
    return;
  }
})

app.get("/students", (req, res) => {
  const sql = "SELECT id,student,father FROM student"
  db.query(sql, (error, result) => {
    if (error) {
      res.status(400).json(error);
    } else {
      res.status(200).json(result);
    }
  })
})

app.post("/students", (req, res) => {
  const { student, father, phone, address } = req.body;
  const sql = "INSERT INTO student (student,father,phone,address) VALUES (?,?,?,?)"
  db.query(sql, [student, father, phone, address], (error, result) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(200).json(result)
    }
  });
})