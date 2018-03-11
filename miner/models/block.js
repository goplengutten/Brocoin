const mongoose = require("mongoose")

const Schema = mongoose.Schema

const blockSchema = new Schema({
    index: Number,
    currentDifficulty: Number,
    minerAddress: String,
    transaction: String,
    hash: String,
    previousHash: String,
    nonce: Number,
    added: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("block", blockSchema)
