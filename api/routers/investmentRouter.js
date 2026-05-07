const router = require("express").Router();
const Investment = require("../models/investmentModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

const RENDER_COLORS = ["#8884d8", "#ffc658", "#ff007f", "#82ca9d"];

// Data processing functions
const calculateTotalInvestmentData = async (req) => {
  let resultData = {
    investmentAmount: 0,
    nonInvestAmount: 0,
    profitAmount: 0,
  };

  const [aInvestData, oUserLogin] = await Promise.all([
    Investment.find({ user: req.user, investStatus: false }).lean(),
    User.findById(req.user).lean(),
  ]);

  aInvestData.forEach((item) => {
    resultData.investmentAmount += item.investMoney;
    resultData.profitAmount += item.investResult;
  });

  resultData.investmentAmount += oUserLogin.walletInvest;
  resultData.nonInvestAmount += oUserLogin.walletInvest;

  return {
    investmentAmount: commonUtil.formatCurrency(resultData.investmentAmount),
    nonInvestAmount: commonUtil.formatCurrency(resultData.nonInvestAmount),
    profitAmount: commonUtil.formatCurrency(resultData.profitAmount),
  };
};

// Route handlers

// Get all investment data
router.get("/", auth, async (req, res) => {
  try {
    await commonUtil.getAllData(req, res, Investment);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Get investment report total data
router.get("/reporttotaldata", auth, async (req, res) => {
  try {
    const formattedData = await calculateTotalInvestmentData(req);
    return res.json(formattedData);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Get investment data report
router.post("/reportinvest", auth, async (req, res) => {
  try {
    const { date, month, coin, status } = req.body;
    const investmentData = await Investment.find({ user: req.user }).lean();

    const dateToDay = (d) => d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString();
    const dateToMonth = (d) => (d.getMonth() + 1).toString();

    const filteredData = investmentData.filter((item) => {
      const dateMatches = !date || date.length === 0 || date.includes(dateToDay(item.investDate));
      const monthMatches = !month || month.length === 0 || month.includes(dateToMonth(item.investDate));
      const coinMatches = !coin || coin.length === 0 || coin.includes(item.coinName);
      const statusMatches = !status || status.length === 0 || status.some((keyword) =>
        keyword.includes(item.investStatus ? "Đã bán" : "Đang giữ")
      );

      return dateMatches && monthMatches && coinMatches && statusMatches;
    });

    const activeInvestmentData = investmentData.filter((i) => i.investStatus === false);

    // O(N) grouping using Maps
    const reducedDataMap = new Map();
    const pieDataMap = new Map();

    filteredData.forEach(item => {
      if (reducedDataMap.has(item.coinName)) {
        const existing = reducedDataMap.get(item.coinName);
        existing.investMoney += item.investMoney;
        existing.investReMoney += item.investReMoney;
        existing.investResult += item.investResult;
        existing.investNumCoin += item.investNumCoin;
      } else {
        reducedDataMap.set(item.coinName, { ...item });
      }
    });

    activeInvestmentData.forEach(item => {
      if (pieDataMap.has(item.coinName)) {
        pieDataMap.get(item.coinName).investMoney += item.investMoney;
      } else {
        pieDataMap.set(item.coinName, { ...item });
      }
    });

    // Create table data structure
    const coinNames = Array.from(reducedDataMap.keys());
    const initialData = {
      name: "",
      ...coinNames.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
    };

    const resultData = [
      { ...initialData },
      { name: "Số tiền mua" },
      { name: "Số tiền thu" },
      { name: "Lãi/Lỗ" },
      { name: "Số coin mua được" },
      { ...initialData },
    ];

    for (const [key, value] of reducedDataMap.entries()) {
      resultData[1][key] = value.investMoney;
      resultData[2][key] = value.investReMoney;
      resultData[3][key] = value.investResult;
      resultData[4][key] = value.investNumCoin;
    }

    const pieResultData = Array.from(pieDataMap.entries()).map(([key, value], index) => ({
      label: key,
      value: value.investMoney,
      color: RENDER_COLORS[index % RENDER_COLORS.length],
    }));

    return res.json({ resultData, pieResultData });
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Create investment data
router.post("/", auth, async (req, res) => {
  try {
    const {
      coinLstID, coinName, investDate, investExRate, investMoney, investNumCoin, investReUSDT,
      investStatus, investSeDate, investSeMoney, investSeExRate, investSeUSDT, investReMoney, investResult,
    } = req.body;

    const oCreateData = {
      coinLstID, coinName, investDate, investExRate, investMoney, investNumCoin, investReUSDT,
      investStatus, investSeDate, investSeMoney, investSeExRate, investSeUSDT, investReMoney, investResult,
    };

    const results = await Promise.all([
      commonUtil.createData(req, res, oCreateData, Investment, "bảng đầu tư"),
      commonUtil.updateWalletAfterCreation(req, res, "DT", -parseInt(investMoney), User),
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Update investment data
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      coinLstID, coinName, investDate, investExRate, investMoney, investNumCoin, investReUSDT,
      investStatus, investSeDate, investSeMoney, investSeExRate, investSeUSDT, investReMoney, investResult, investDMoney,
    } = req.body;

    const oUpdateData = {
      coinLstID, coinName, investDate, investExRate, investMoney, investNumCoin, investReUSDT,
      investStatus, investSeDate, investSeMoney, investSeExRate, investSeUSDT, investReMoney, investResult,
    };

    const sInvestmentId = req.params.id;
    const walletUpdateAmount = investStatus === true ? parseInt(investReMoney) : -parseInt(investDMoney || investMoney);

    const results = await Promise.all([
      commonUtil.updateData(req, res, oUpdateData, Investment, sInvestmentId, "bảng đầu tư"),
      commonUtil.updateWalletAfterUpdate(req, res, "DT", walletUpdateAmount, User),
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Delete investment data
router.delete("/:id", auth, async (req, res) => {
  try {
    const sInvestmentId = req.params.id;
    const data = req.body;

    const results = await Promise.all([
      commonUtil.deleteData(req, res, Investment, sInvestmentId, "bảng đầu tư"),
      commonUtil.updateWalletBatch(req, "coinLstID", "investMoney", data, User),
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

module.exports = router;
