const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const ObjectId = mongoose.Schema.Types.ObjectId;

const coinListSchema = new mongoose.Schema(
  {
    coinLstID: { type: String, require: true },
    coinName: { type: String, require: true },
    user: { type: ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

const CoinList = mongoose.model("coinList", coinListSchema);

module.exports = CoinList;
