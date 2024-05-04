const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const ObjectId = mongoose.Schema.Types.ObjectId;

const incomeSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, required: true },
    dicLstCode: { type: String, require: true, ref: "DictionaryList" },
    dicLstContent: { type: String, require: true, ref: "DictionaryList" },
    incDate: { type: Date, require: true },
    incDetail: { type: String, require: true },
    incMoney: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
);

const Income = mongoose.model("income", incomeSchema);

module.exports = Income;
