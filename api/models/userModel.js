const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, require: true },
    userName: { type: String, require: true },
    passwordHash: { type: String, required: true },
    walletLife: { type: Number, required: true },
    walletInvest: { type: Number, required: true },
    walletSaving: { type: Number, required: true },
    walletFree: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
