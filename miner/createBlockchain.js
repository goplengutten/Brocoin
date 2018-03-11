const mongoose = require("mongoose")

const Block = require("./models/block")
const Blockchain = require("./models/blockchain")

mongoose.connect("mongodb://localhost:27017/chain_store")
mongoose.Promise = global.Promise


if(process.argv[2] === "drop"){
  dropAll()
}else{
  createBlockchain("brocoin")
}

function dropAll(){
  mongoose.connection.collections['blocks'].drop((err) => {
    mongoose.connection.collections['blockchains'].drop((err) => {
      console.log("All collections dropped")
      mongoose.connection.close()
    })
  })
}

function createBlockchain(name){
  Blockchain.findOne({ name: name }, (err, blockchain) => {
    if(err) throw err
    if(blockchain){
      console.log("exists")
      mongoose.connection.close()
    }
    let genesisBlock = new Block({
      minerAddress: "0",
      index: 0,
      currentDifficulty: 0,
      transaction: "",
      hash: "0",
      previousHash: "0",
      nonce: 0
    })
    genesisBlock.save((err, block)  => {
      let newBlockchain = new Blockchain({ name: name })
      newBlockchain.blocks.push(genesisBlock)
      newBlockchain.save((err) => {
        if(err) throw err
        console.log("Blockchain created")
        mongoose.connection.close()
      })
    })
  })
}

