const mongoose = require("mongoose");
const { randomUUID } = require("crypto");
const ObjectId = mongoose.Schema.Types.ObjectId;

const savingSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, required: true },
    bnkLstID: { type: String, require: true, ref: "BankList" },
    bnkName: { type: String, require: true, ref: "BankList" },
    savDate: { type: Date, require: true },
    savMoney: { type: Number, require: true },
    savMonth: { type: Number, require: true },
    savInteret: { type: Number, require: true },
    savInteretMoney: { type: Number, require: true },
    savTotalMoney: { type: Number, require: true },
    savStatus: { type: Boolean, require: true },
    savTRealMoney: { type: Number, require: true },
    savRealInterMoney: { type: Number, require: true },
  },
  {
    timestamps: true,
  }
);

const Saving = mongoose.model("saving", savingSchema);

module.exports = Saving;
