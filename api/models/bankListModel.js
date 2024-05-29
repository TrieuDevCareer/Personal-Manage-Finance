const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const bankListSchema = new mongoose.Schema(
  {
    bnkLstID: { type: String, require: true },
    user: { type: ObjectId, required: true },
    bnkName: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const BankList = mongoose.model("bankList", bankListSchema);

module.exports = BankList;
