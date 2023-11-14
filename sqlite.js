const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('./sample.db')
const bcrypt = require("bcrypt")
const saltRounds = 10
const jwt = require("jsonwebtoken")

function addSqliteAPIs(app) {

  db.run(`
  CREATE TABLE IF NOT EXISTS playlists (
    [PlaylistId] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    [Name] TEXT
    )
  `);


  app.get("/api/persons", (req, res) => {
    const sql = "SELECT * FROM persons"
    db.all(sql, (error, result) => {
      if (error) return res.status(500).json(error)
      res.status(200).json(result);
    });
  })

  app.post("/api/persons/", (req, res) => {
    const result = verifyToken(req, res)
    if (result) {
      const { fname, lname } = req.body
      const sql = `INSERT INTO persons (fname,lname) VALUES (?,?)`
      db.run(sql, [fname, lname], (error) => {
        if (error) return res.status(500).json(error)
        // console.log(this.lastID);
        return res.status(200).json('added...')
      })
    }
  })

  app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM persons WHERE id=?`
    db.get(sql, [id], (error, result) => {
      if (error) return res.status(500).json(error)
      res.status(200).json(result);
    });
  })

  app.delete("/api/persons/:id", (req, res) => {
    const result = verifyToken(req, res)
    if (result) {
      const id = req.params.id
      const sql = `DELETE FROM persons WHERE id=?`
      db.run(sql, [id], (error) => {
        if (error) return res.status(500).json(error)
        return res.status(200).json("success")
      })
    }
  })

  app.post("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const { fname, lname } = req.body
    const sql = `UPDATE persons set fname=?, lname=? WHERE id=?`
    db.run(sql, [fname, lname, id], (error) => {
      if (error) return res.status(500).json(error)
      return res.status(200).json("success")
    })
  })

  app.post("/api/register", (req, res) => {
    const { username, password } = req.body
    let sql = `SELECT id FROM users WHERE username=?`
    db.get(sql, [username], (error, result) => {
      if (error) return res.status(500).json(error)
      if (result) return res.status(200).json('User aleady exists')
      sql = `INSERT INTO users (username, password) VALUES (?,?)`
      bcrypt
        .genSalt(saltRounds)
        .then(salt => {
          return bcrypt.hash(password, salt)
        })
        .then(hash => {
          db.run(sql, [username, hash], (error) => {
            if (error) return res.status(200).json(error)
            return res.status(200).json("registration success")
          })
        })
        .catch(err => {
          return res.status(500).json(err)
        })
    })
  })

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body
    const sql = `SELECT * FROM users WHERE username=?`
    db.get(sql, [username], (error, result) => {
      if (error) return res.status(500).json(error)
      if (!result) return res.status(404).json('User not found')
      bcrypt.compare(password, result.password)
        .then((matched) => {
          if (!matched) return res.status(500).json('Wrong password')
          const token = jwt.sign(
            { userId: username, },
            "RANDOM-TOKEN",
            { expiresIn: "30d" }
          )
          res.status(200).json({ username, token });
        })
        .catch(err => res.status(500).json(err.message))
    })

  })

  function verifyToken(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      return jwt.verify(token, "RANDOM-TOKEN");
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: "Token has expired" });
      } else {
        res.status(500).json({ error: "Token verification failed" });
      }
      return false
    }
  }

}
module.exports = { addSqliteAPIs }