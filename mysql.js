const mysql = require("mysql")
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "backend3"
});


function addMysqlAPIs(app) {

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
  
  app.delete("/students/:id", (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM student WHERE id = ?"
    db.query(sql, [id], (error, result) => {
      if (error) {
        res.status(400).json(error);
      } else {
        res.status(200).json(result);
      }
    })
  })

}


module.exports = { addMysqlAPIs }