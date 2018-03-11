const express = require("express")
const router = express.Router()

const controller = require("../controllers/chain_controller")

router.get("/checkvalidity", (req, res) => {
  controller.checkValidity(res)
})

router.get("/chaininfo", (req, res) => {
  controller.chainInfo(res)
})

router.get("/generatekey", (req, res) => {
  controller.generateKey(res)
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

router.post("/newtransaction", (req, res) => {
  controller.newTransaction(req, res)
})

module.exports = router