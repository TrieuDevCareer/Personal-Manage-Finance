const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const ObjectId = mongoose.Schema.Types.ObjectId;

const expenseSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, required: true },
    exelstCode: { type: String, require: true, ref: "ExpenseList" },
    exeLstContent: { type: String, require: true, ref: "ExpenseList" },
    expDate: { type: Date, require: true },
    expDetail: { type: String, require: true },
    expMoney: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("expense", expenseSchema);

module.exports = Expense;
