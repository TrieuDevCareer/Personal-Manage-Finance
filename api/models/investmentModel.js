const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const investmentSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, required: true },
    coinLstID: { type: String, require: true, ref: "CoinList" },
    coinName: { type: String, require: true, ref: "CoinList" },
    investDate: { type: Date, require: true },
    investExRate: { type: Number, require: true, default: 0 },
    investMoney: { type: Number, require: true, default: 0 },
    investNumCoin: { type: Number, require: true, default: 0 },
    investReUSDT: { type: Number, require: true, default: 0 },
    investStatus: { type: Boolean, require: true, default: false },
    investSeDate: { type: Date, require: true, default: "00/00/00" },
    investSeMoney: { type: Number, require: true, default: 0 },
    investSeExRate: { type: Number, require: true, default: 0 },
    investSeUSDT: { type: Number, require: true, default: 0 },
    investReMoney: { type: Number, require: true, default: 0 },
    investResult: { type: Number, require: true }, // 0 - chưa xác định, 1 - lời, 2 - lỗ
  },
  {
    timestamps: true,
  }
);

const Investment = mongoose.model("investment", investmentSchema);

module.exports = Investment;
