const router = require("express").Router();
const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");
const Saving = require("../models/savingModel");
const Investment = require("../models/investmentModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// Data processing functions
const processMonthlyData = async (req) => {
  const resultData = new Array(12).fill().map(() => ({ incomeSite: 0, expenseSite: 0 }));

  // Use lean() for performance and fix the Investment model bug
  const [aIncomeData, aExpenseData, aSavingData, aInvestData] = await Promise.all([
    Income.find({ user: req.user }).lean(),
    Expense.find({ user: req.user }).lean(),
    Saving.find({ user: req.user, savStatus: false }).lean(),
    Investment.find({ user: req.user, investStatus: false }).lean(),
  ]);

  aIncomeData.forEach((income) => {
    const month = income.incDate.getMonth();
    resultData[month].incomeSite += income.incMoney;
  });

  aExpenseData.forEach((expense) => {
    const month = expense.expDate.getMonth();
    resultData[month].expenseSite += expense.expMoney;
  });

  aSavingData.forEach((saving) => {
    const month = saving.savDate.getMonth();
    resultData[month].expenseSite += saving.savMoney;
  });

  aInvestData.forEach((invest) => {
    const month = invest.investDate.getMonth();
    resultData[month].expenseSite += invest.investMoney;
  });

  return resultData;
};

// Route handlers

// Get all income data
router.get("/", auth, async (req, res) => {
  try {
    await commonUtil.getAllData(req, res, Income);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Get Income - Expense report by month
router.get("/reporttotal", auth, async (req, res) => {
  try {
    const resultData = await processMonthlyData(req);
    return res.json(resultData);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Get Income Data report list
router.post("/reportincome", auth, async (req, res) => {
  try {
    const { date, month, capitalSource, contentData } = req.body;
    
    // Lean query for performance
    const aIncomeData = await Income.find({ user: req.user }).lean();

    const filteredData = aIncomeData.filter((item) => {
      const dayMatches = !date || date.length === 0 || 
        date.includes(item.incDate.getDate() < 10 ? "0" + item.incDate.getDate().toString() : item.incDate.getDate().toString());

      const monthMatches = !month || month.length === 0 || 
        month.includes((item.incDate.getMonth() + 1).toString());

      const sourceMatches = !capitalSource || capitalSource.length === 0 || 
        capitalSource.includes(item.inlstCode);

      const contentMatches = !contentData || contentData.length === 0 || 
        contentData.some((keyword) => keyword.includes(item.inlstCode) && keyword.includes(item.inLstContent));

      return dayMatches && monthMatches && sourceMatches && contentMatches;
    });

    // O(N) grouping using Maps
    const maps = {
      "SO": new Map(),
      "TD": new Map(),
      "DT": new Map(),
      "TK": new Map()
    };

    filteredData.forEach((item) => {
      const map = maps[item.inlstCode];
      if (map) {
        const key = item.inLstContent;
        if (map.has(key)) map.get(key).incMoney += item.incMoney;
        else map.set(key, { ...item });
      }
    });

    const reducedData = {
      SO: Array.from(maps["SO"].values()),
      TD: Array.from(maps["TD"].values()),
      DT: Array.from(maps["DT"].values()),
      TK: Array.from(maps["TK"].values())
    };

    const maxLength = Math.max(
      reducedData.SO.length,
      reducedData.TD.length,
      reducedData.DT.length,
      reducedData.TK.length
    );

    const resultData = new Array(maxLength).fill().map((_, i) => ({
      name: i + 1,
      "Nguồn sống": reducedData.SO[i]?.incMoney || 0,
      "Tiết kiệm": reducedData.TK[i]?.incMoney || 0,
      "Đầu tư": reducedData.DT[i]?.incMoney || 0,
      "Tự do": reducedData.TD[i]?.incMoney || 0,
      SOContent: reducedData.SO[i]?.inLstContent || "",
      TKContent: reducedData.TK[i]?.inLstContent || "",
      DTContent: reducedData.DT[i]?.inLstContent || "",
      TDContent: reducedData.TD[i]?.inLstContent || "",
    }));

    return res.json({ resultData });
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Create income data
router.post("/", auth, async (req, res) => {
  try {
    const { inlstCode, inLstContent, incDate, incDetail, incMoney } = req.body;
    const oCreateData = { inlstCode, inLstContent, incDate, incDetail, incMoney };

    const results = await Promise.all([
      commonUtil.createData(req, res, oCreateData, Income, "bảng thu nhập"),
      commonUtil.updateWalletAfterCreation(req, res, inlstCode, parseInt(incMoney), User),
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Update income data
router.put("/:id", auth, async (req, res) => {
  try {
    const { inlstCode, inLstContent, incDate, incDetail, incMoney, incDMoney } = req.body;
    const oUpdateData = { inlstCode, inLstContent, incDate, incDetail, incMoney };
    const sIncomeId = req.params.id;

    const results = await Promise.all([
      commonUtil.updateData(req, res, oUpdateData, Income, sIncomeId, "bảng thu nhập"),
      commonUtil.updateWalletAfterUpdate(
        req,
        res,
        inlstCode,
        parseInt(incDMoney || incMoney),
        User
      ),
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Delete income data
router.delete("/:id/", auth, async (req, res) => {
  try {
    const sIncomeId = req.params.id;
    const data = req.body;

    const results = await Promise.all([
      commonUtil.deleteData(req, res, Income, sIncomeId, "bảng thu nhập"),
      commonUtil.updateWalletBatch(req, "inlstCode", "incMoney", data, User),
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

module.exports = router;
