const SHA256 = require("crypto-js/sha256")
const request = require('request')
const EC = require('elliptic').ec

const ec = new EC('secp256k1')

module.exports = {
  checkValidity(res){
    request('http://localhost:3010/api/ischainvalid', { json: true }, (err, response, body) => {
      if(err) throw err
      res.send(body)
    })
  },

  chainInfo(res){
    request('http://localhost:3010/api/chaininfo', { json: true }, (err, response, body) => {
      if(err) throw err
      res.send(body)
    })
  },

  generateKey(res){
    
    const key = ec.genKeyPair()

    const privateKey = key.getPrivate("hex")
    const publickey = key.getPublic("hex")
    info = {
      key: privateKey,
      address: SHA256(publickey).toString()
    }

    res.send(info)
  },

  newTransaction(req, res){
    const private = req.body.key
    const key = ec.keyFromPrivate(private, 'hex')
    const public = key.getPublic("hex") 
    const sender = SHA256(public).toString()
    
    const transaction = { sender: sender, receiver: req.body.address, amount: req.body.amount }
    const hashedTransaction = SHA256(JSON.stringify(transaction)).toString()
    
    const signature = key.sign(hashedTransaction)
    const derSign = signature.toDER() 
    
    const info = JSON.stringify({ transaction: transaction, derSign: derSign, public: public })
    request.post('http://localhost:3010/api/newtransaction', { form: { info: info } }, (err, response, body) => {
      if(err) throw err
      res.send(body)
    })
  },

  getBalance(req, res){
    let address = req.query.address
    request(`http://localhost:3010/api/getbalance?address=${address}`, { json: true }, (err, response, body) => {
      if(err) throw err
      res.send(body)
    })
  },

  getBalances(res){
    request(`http://localhost:3010/api/getbalances`, { json: true }, (err, response, body) => {
      if(err) throw err
      res.send(body)
    })
  },

  transactionHistoryOne(req, res){
    let address = req.query.address
    request(`http://localhost:3010/api/transactionhistoryone?address=${address}`, { json: true }, (err, response, body) => {
      if(err) throw err
      res.send(body)
    })
  },

  transactionHistoryAll(res){
    request(`http://localhost:3010/api/transactionhistoryall`, { json: true }, (err, response, body) => {
      if(err) throw err
      res.send(body)
    })
  }
}

