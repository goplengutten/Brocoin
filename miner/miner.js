const SHA256 = require("crypto-js/sha256")
const Blockchain = require("./models/blockchain")
const Block = require("./models/block")
const spawn = require("child_process").spawn

module.exports = {

  transactions: [],

  mineBlock(){
    const minerAddress = "your address here" // Add an address here. Make it in the app
    let transaction = this.transactions.length > 0 ? this.transactions.shift() : ""
    
    Blockchain.findOne({}).populate("blocks").exec((err, blockchain) => {
      if(err) throw err
      
      let difficulty = blockchain.difficulty
      let index = blockchain.blocks.length
      let previousHash = blockchain.blocks[blockchain.blocks.length - 1].hash

      let info = {
        currentDifficulty: difficulty,
        index: index, 
        minerAddress: minerAddress,
        transaction: transaction,
        previousHash: previousHash,

      }

      let stringToMine = difficulty + minerAddress + index + transaction + previousHash
      
      console.log("********************************************")
      console.log("transaction:", transaction.length > 0 ? transaction : "no transaction")
      console.log("starting to mine a block")

      let mining = spawn('python', ["pow.py", stringToMine, difficulty])
      
      mining.stdout.on('data', (response) => {
        let nonce = parseInt(response.toString('utf8'))
        info.nonce = nonce
        let string = stringToMine + nonce
        info.hash = SHA256(string).toString()
        this.blockMined(info) 
      })
    })
  },

  blockMined(info){

    console.log("block is mined")

    Blockchain.findOne({}).populate("blocks").exec((err, blockchain) => {
      if(err) throw err
      let newBlock = new Block({
        index: parseInt(info.index),
        minerAddress: info.minerAddress,
        currentDifficulty: parseInt(info.currentDifficulty),
        previousHash: info.previousHash,
        transaction: info.transaction,
        hash: info.hash,
        nonce: parseInt(info.nonce)
      })
      
      if(newBlock.index !== blockchain.blocks.length){
        console.log({ valid: false, message: "the index needs to be one greater than the previous block" })
        process.exit()
      }      
      
      if(blockchain.blocks[blockchain.blocks.length - 1].hash !== newBlock.previousHash){
        console.log({ valid: false, message: "the previous blocks hash does not match this blocks previous hash" })
        process.exit()
      }
      
      if(newBlock.currentDifficulty !== blockchain.difficulty){
        console.log({ valid: false, message: "this block has a different difficulty that set on the chain" })
        process.exit()
      }
      
      if(SHA256(newBlock.currentDifficulty + newBlock.minerAddress + newBlock.index + newBlock.transaction + newBlock.previousHash + newBlock.nonce).toString() !== newBlock.hash){
        console.log({ valid: false, message: "the hash is not correct. grow up cheater..." })
        process.exit()
      }
     
      
      console.log({ valid: true, message: "all tests passed" })
      
      blockchain.blocks.push(newBlock)
      newBlock.save((err, newBlock) => {
        if(err) throw err
        blockchain.save(() => {
          if(err) throw err
          console.log("Block is added to the chain. You just earned 10 BRO")
          console.log("*******************************************************")
          console.log()
          this.mineBlock()
        })
      })
    })
  }
}


