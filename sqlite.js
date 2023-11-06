const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('./sample.db')

function addSqliteAPIs(app) {

  db.run(`
  CREATE TABLE IF NOT EXISTS playlists (
    [PlaylistId] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    [Name] TEXT
    )
  `);


  app.get("/persons", (req, res) => {
    const sql = "SELECT * FROM persons"
    db.all(sql, (error, result) => {
      if (error) return res.status(500).json(error)
      res.status(200).json(result);
    });
  })

  app.post("/persons/", (req, res) => {
    const { fname, lname } = req.body
    const sql = `INSERT INTO persons (fname,lname) VALUES (?,?)`
    db.run(sql, [fname, lname], (error) => {
      if (error) return res.status(500).json(error)
      return res.status(200).json(this.lastID)
    })
  })

  app.get("/persons/:id", (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM persons WHERE id=?`
    db.get(sql, [id], (error, result) => {
      if (error) return res.status(500).json(error)
      res.status(200).json(result);
    });
  })

  app.delete("/persons/:id", (req, res) => {
    const id = req.params.id
    const sql = `DELETE FROM persons WHERE id=?`
    db.run(sql, [id], (error) => {
      if (error) return res.status(500).json(error)
      return res.status(200).json("success")
    })
  })

  app.post("/persons/:id", (req, res) => {
    const id = req.params.id
    const { fname, lname } = req.body
    const sql = `UPDATE persons set fname=?, lname=? WHERE id=?`
    db.run(sql, [fname, lname, id], (error) => {
      if (error) return res.status(500).json(error)
      return res.status(200).json("success")
    })
  })

}
module.exports = { addSqliteAPIs }