const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const expenseListSchema = new mongoose.Schema(
  {
    exelstCode: { type: String, require: true },
    exeLstContent: { type: String, require: true },
    user: { type: ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

const ExpenseList = mongoose.model("expenseList", expenseListSchema);

module.exports = ExpenseList;
