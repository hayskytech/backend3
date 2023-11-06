const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.listen(4000, () => {
  console.log("Server is running on port 4000");
})


const { addSqliteAPIs } = require('./sqlite')
addSqliteAPIs(app)


// const { addMysqlAPIs } = require('./mysql')
// addMysqlAPIs(app)