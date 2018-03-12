const mongoose = require("mongoose")

const Schema = mongoose.Schema

const blockchainSchema = new Schema({
  name: String,
  blocks: [{
    type: Schema.Types.ObjectId, 
    ref: "block"
  }],
  difficulty: {
    type: Number,
    default: 4
  }
})


module.exports = mongoose.model("blockchain", blockchainSchema)
