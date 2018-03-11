const SHA256 = require("crypto-js/sha256")
const EC = require('elliptic').ec
const validator = require("validator")

const Blockchain = require("../models/blockchain")
const Block = require("../models/block")

const miner = require("../miner")

const ec = new EC('secp256k1')

module.exports = {

  chainInfo(res){
    Blockchain.findOne({}).populate("blocks").exec((err, blockchain) => {
      if(err) throw err
      let info = { 
        length: blockchain.blocks.length,
        difficulty: blockchain.difficulty,
        genesisAdded: blockchain.blocks[0].added,
        latestAdded: blockchain.blocks[blockchain.blocks.length - 1].added
      }
      res.send(info)
    })
  },

  chainValidity(res){
    Blockchain.findOne({}).populate("blocks").exec((err, blockchain) => {
      if(err) throw err

      for(let i = 1; i < blockchain.blocks.length; i++){

        const currentBlock = blockchain.blocks[i]
        const previousBlock = blockchain.blocks[i - 1]

        if(currentBlock.hash !== SHA256(currentBlock.currentDifficulty + currentBlock.minerAddress + currentBlock.index + currentBlock.transaction + currentBlock.previousHash + currentBlock.nonce).toString()){         
          return res.send({ valid: false, message: `the hash is not correct at index ${i}`})
        }
        if(previousBlock.hash !== currentBlock.previousHash){
          return res.send({ valid: false, message: `previous block's hash does not match this block's previous hash at index ${i}` })
        }
      }
      res.send({ valid: true, message: `Chain is valid` })
    })
  },

  newTransaction(req, res){

    let status = validateInput(req.body)
    if(!status.valid){
      return res.send(status)
    }
    
    let info = JSON.parse(req.body.info)
    let transaction = info.transaction
    
    let transactionString = JSON.stringify(transaction)
    let transactionHash = SHA256(JSON.stringify(transaction)).toString()
    let amount = transaction.amount


    let key = ec.keyFromPublic(info.public, 'hex')
    let derSign = info.derSign

    if(!key.verify(transactionHash, derSign)){
      return res.send({ valid: false, message: "Could not verify the transaction" })
    }

    Blockchain.findOne({}).populate("blocks").exec((err, blockchain) => {
      if(err) throw err

      let senderBalance = 0

      blockchain.blocks.forEach((block) => {

        if(block.index === 0){
          return
        }
        if(block.minerAddress === transaction.sender){
          senderBalance += 10
        }

        let trans = block.transaction
        if(trans === ""){
          return
        }

        trans = JSON.parse(trans) 

        if(trans.sender === transaction.sender){
          senderBalance -= trans.amount
        }
        if(trans.receiver === transaction.sender){
          senderBalance += trans.amount
        }
      })

      if(senderBalance < amount){
        return res.send({ valid: false, message: "Insufficiant funds" })
      }else{
        miner.transactions.push(transactionString)
        return res.send({ valid: true, message: "Your transaction is approved. Waiting for the miner to add it to the chain" })
      }
    })
  },

  getBalance(req, res){
    if(!req.query.address){
      return res.send({ valid: false, message: "No address present"})
    }

    let address = req.query.address

    if(!validator.isHash(address, 'sha256')){
      return res.send({ valid: false, message: "address is not a sha256 hash"})
    }

    Blockchain.findOne({}).populate("blocks").exec((err, blockchain) => {
      if(err) throw err
      let balance = 0
      let mined = 0
      let sent = 0
      let received = 0
      blockchain.blocks.forEach((block) => {
        let transaction = block.transaction
        
        if(block.minerAddress === address){
          balance += 10
          mined += 10
        }

        if(transaction === ""){
          return
        }
        transaction = JSON.parse(transaction)
        let amount = transaction.amount
        
        if(transaction.sender === address){
          sent += amount
          balance -= amount
        }
        
        if(transaction.receiver === address){
          received += amount
          balance += amount
        }
      })
      
      
      let info = {
        balance: balance,
        mined: mined,
        sent: sent,
        received: received
      }
      res.send(info)
    })
  },

  getBalances(res){
    Blockchain.findOne({}).populate("blocks").exec((err, blockchain) => {
      if(err) throw err
      let accounts = []
      blockchain.blocks.forEach((block, i) => {
        
        if(block.index === 0){
          return
        }
        let minerAddress = block.minerAddress
        
        let miner = accounts.find((account) => account.address === minerAddress)
        if(!miner){
          accounts.push({ address: minerAddress, amount: 10})
        }else{
          miner.amount += 10
        }
        
        let transaction = block.transaction

        if(transaction === ""){
          return
        }

        transaction = JSON.parse(transaction)
        let amount = transaction.amount

        let sender = accounts.find((account) => account.address === transaction.sender)
        if(!sender){
          accounts.push({ address: transaction.sender, amount: amount})
        }else{
          sender.amount += 10
        }

        let receiver = accounts.find((account) => account.address === transaction.receiver)
        if(!receiver){
          accounts.push({ address: transaction.receiver, amount: amount})
        }else{
          receiver.amount += 10
        }
      })
      res.send(accounts)
    })
  },

  transactionHistoryOne(req, res){
    if(!req.query.address){
      return res.send({ valid: false, message: "No address present"})
    }

    let address = req.query.address

    if(!validator.isHash(address, 'sha256')){
      return res.send({ valid: false, message: "address is not a sha256 hash"})
    }

    Blockchain.findOne({}).populate("blocks").exec((err, blockchain) => {
      let transactionsSent = []
      let transactionsReceived = []

      blockchain.blocks.forEach((block) => {

        let transaction = block.transaction

        if(transaction === ""){
          return
        }

        transaction = JSON.parse(transaction)

        if(transaction.sender === address){
          transactionsSent.unshift({
            address: transaction.receiver,
            amount: transaction.amount,
            time: block.added,
          })
        }
        if(transaction.receiver === address){
          transactionsReceived.unshift({
            address: transaction.sender,
            amount: transaction.amount,
            time: block.added,
          })
        }

      })
      let info = {
        sent: transactionsSent,
        received: transactionsReceived
      }
  
  
      res.send(info)
    })

  },

  transactionHistoryAll(res){
    Blockchain.findOne({}).populate("blocks").exec((err, blockchain) => {
      
      let transactions = []
      
      blockchain.blocks.forEach((block) => {
        
        let transaction = block.transaction
        
        if(transaction === ""){
          return
        }

        transaction = JSON.parse(transaction)

        transactions.unshift({
          sender: transaction.sender,
          receiver: transaction.receiver,
          amount: transaction.amount,
          time: block.added,
        })
      })

      info = { transactions: transactions }
  
      res.send(info)
    })
  }
}


function validateInput(body){
  
  if(!body.info){
    return { valid: false, message: "no info present" }
  }

  let info = JSON.parse(body.info)

  if(!info.transaction || !info.derSign || !info.public){
    return { valid: false, message: "missing info" }
  }

  let transaction = info.transaction
  
  if(!transaction.amount || !transaction.sender || !transaction.receiver){
    return { valid: false, message: "Invalid transaction" }
  }
  
  if(!validator.isHash(transaction.sender, 'sha256')){
    return { valid: false, message: "sender address is not a sha256 hash" }
  }

  if(!validator.isHash(transaction.receiver, 'sha256')){
    return { valid: false, message: "receiver address is not a sha256 hash" }
  }

  if(typeof transaction.amount !== "number" || 
     transaction.amount <= 0 || 
     transaction.number >= 1000000000){
    return { valid: false, message: "Invalid amount" }
  }

  if(!validator.isHexadecimal(info.public) || info.public.length !== 130){
    return { valid: false, message: "invalid format on key" }
  }

  if(!Array.isArray(info.derSign)){
    return { valid: false, message: "invalid signature format" }
  }

  for(let i = 0; i < info.derSign.length; i++){
    if(typeof info.derSign[i] !== 'number' || info.derSign[i] > 10000){
      return { valid: false, message: "invalid signature format" }
    }
  }
  return { valid: true, message: "input is ok" }
}