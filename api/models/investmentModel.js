const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const investmentSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, required: true },
    coinLstID: { type: String, require: true, ref: "CoinList" },
    coinName: { type: String, require: true, ref: "CoinList" },
    investDate: { type: Date, require: true },
    investExRate: { type: Number, require: true },
    investMoney: { type: Number, require: true },
    investNumCoin: { type: Number, require: true },
    investReUSDT: { type: Number, require: true },
    investStatus: { type: Boolean, require: true },
    investSeDate: { type: Date, require: true },
    investSeMoney: { type: Number, require: true },
    investSeExRate: { type: Number, require: true },
    investSeUSDT: { type: Number, require: true },
    investReMoney: { type: Number, require: true },
    investResult: { type: Number, require: true }, // 0 - chưa xác định, 1 - lời, 2 - lỗ
  },
  {
    timestamps: true,
  }
);

const Investment = mongoose.model("investment", investmentSchema);

module.exports = Investment;
