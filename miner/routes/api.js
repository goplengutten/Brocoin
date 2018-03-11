const express = require("express")
const router = express.Router()

const controller = require("../controllers/chain_controller")

router.get("/ischainvalid", (req, res) => {
  controller.chainValidity(res)
})

router.get("/chaininfo", (req, res) => {
  controller.chainInfo(res)
})

router.post("/newtransaction", (req, res) => {
  controller.newTransaction(req, res)
})

router.get("/getbalance", (req, res) => {
  controller.getBalance(req, res)
})

router.get("/getbalances", (req, res) => {
  controller.getBalances(res)
})

router.get("/transactionhistoryone", (req, res) => {
  controller.transactionHistoryOne(req, res)
})

router.get("/transactionhistoryall", (req, res) => {
  controller.transactionHistoryAll(res)
})


module.exports = router

