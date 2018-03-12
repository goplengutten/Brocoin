const SHA256 = require("crypto-js/sha256")


let originalString = process.argv[2]
let difficulty = parseInt(process.argv[3])
let nonce = 0

let stringToHash = originalString + nonce

let hash = SHA256(stringToHash).toString()
while(hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
  nonce += 1
  stringToHash = originalString + nonce
  hash = SHA256(stringToHash).toString()
}

console.log(hash)




