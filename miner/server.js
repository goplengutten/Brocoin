const express = require("express")
const mongoose = require("mongoose")
const http = require("http")
const bodyParser = require("body-parser")
const app = express()

const miner = require("./miner")
const api = require("./routes/api")

mongoose.connect("mongodb://localhost:27017/chain_store")
mongoose.Promise = global.Promise

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

if(process.argv[2] === "mine"){
  miner.mineBlock()
}

app.use("/api", api)

app.get("*", (req, res) => {
  res.redirect("/api")
})

const port = process.env.PORT || "3010"
app.set("port", port)

const server = http.createServer(app)

server.listen(port, () => console.log("Miner running on port:", port))

