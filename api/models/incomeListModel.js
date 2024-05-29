const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const incomeListSchema = new mongoose.Schema(
  {
    inlstCode: { type: String, require: true },
    inLstContent: { type: String, require: true },
    user: { type: ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

const IncomeList = mongoose.model("incomeList", incomeListSchema);

module.exports = IncomeList;
