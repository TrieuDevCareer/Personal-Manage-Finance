const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const incomeSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, required: true },
    inlstCode: { type: String, require: true, ref: "IncomeList" },
    inLstContent: { type: String, require: true, ref: "IncomeList" },
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
