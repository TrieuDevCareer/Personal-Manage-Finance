const router = require("express").Router();
const Saving = require("../models/savingModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

//-------------------------------- CONSTANTS --------------------------------//

const RENDER_COLORS = ["#8884d8", "#ffc658", "#ff007f", "#82ca9d"];

//-------------------------------- INTERNAL FUNCTION --------------------------------//

//-------------------------------- ROUTES --------------------------------//

/**
 * Get all savings
 * @route GET /api/savings
 * @header { token }
 */
router.get("/", auth, async (req, res) => {
  try {
    await commonUtil.getAllData(req, res, Saving);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

/**
 * Get saving total data report
 * @route GET /api/savings/reporttotaldata
 * @header { token }
 */
router.get("/reporttotaldata", auth, async (req, res) => {
  try {
    const resultData = {
      iReportStartMon: 0,
      iReportTotalMon: 0,
      iUnsavedAmount: 0,
      iSavingAmount: 0,
      iAmountOfInterest: 0,
    };

    const activeSavings = await Saving.find({ user: req.user, savStatus: false }).lean();
    const userLogin = await User.findById(req.user).lean();

    // Calculate totals from active savings
    activeSavings.forEach((item) => {
      resultData.iReportStartMon += item.savMoney;
      resultData.iAmountOfInterest += item.savInteretMoney;
      resultData.iReportTotalMon += item.savTRealMoney;
    });

    // Add wallet data
    resultData.iSavingAmount = resultData.iReportStartMon;
    resultData.iReportStartMon += userLogin.walletSaving;
    resultData.iReportTotalMon += userLogin.walletSaving;
    resultData.iUnsavedAmount += userLogin.walletSaving;

    // Format currency values
    const formattedData = {
      iReportStartMon: commonUtil.formatCurrency(resultData.iReportStartMon),
      iReportTotalMon: commonUtil.formatCurrency(resultData.iReportTotalMon),
      iUnsavedAmount: commonUtil.formatCurrency(resultData.iUnsavedAmount),
      iSavingAmount: commonUtil.formatCurrency(resultData.iSavingAmount),
      iAmountOfInterest: commonUtil.formatCurrency(resultData.iAmountOfInterest),
    };

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error });
  }
});

/**
 * Get saving report with filters
 * @route POST /api/savings/reportsaving
 * @header { token }
 * @body { date, month, bank, status }
 */
router.post("/reportsaving", auth, async (req, res) => {
  try {
    const { date, month, bank, status } = req.body;
    const allSavings = await Saving.find({ user: req.user }).lean();

    const dateToDay = (d) => d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString();
    const dateToMonth = (d) => (d.getMonth() + 1).toString();

    const filteredData = allSavings.filter((item) => {
      const dateMatches = !date || date.length === 0 || date.includes(dateToDay(item.savDate));
      const monthMatches = !month || month.length === 0 || month.includes(dateToMonth(item.savDate));
      const bankMatches = !bank || bank.length === 0 || bank.includes(item.bnkName);
      const statusMatches = !status || status.length === 0 || status.some((keyword) =>
        keyword.includes(item.savStatus ? "Đã rút tiết kiệm" : "Đang gửi tiết kiệm")
      );
      
      return dateMatches && monthMatches && bankMatches && statusMatches;
    });

    const activeSavings = allSavings.filter((i) => i.savStatus === false);

    // O(N) grouping using Maps
    const reducedDataMap = new Map();
    const pieDataMap = new Map();

    filteredData.forEach(item => {
      if (reducedDataMap.has(item.bnkName)) {
        const existing = reducedDataMap.get(item.bnkName);
        existing.savMoney += item.savMoney;
        existing.savInteretMoney += item.savInteretMoney;
        existing.savTotalMoney += item.savTotalMoney;
        existing.savTRealMoney += item.savTRealMoney;
        existing.savRealInterMoney += item.savRealInterMoney;
      } else {
        reducedDataMap.set(item.bnkName, { ...item });
      }
    });

    activeSavings.forEach(item => {
      if (pieDataMap.has(item.bnkName)) {
        pieDataMap.get(item.bnkName).savMoney += item.savMoney;
      } else {
        pieDataMap.set(item.bnkName, { ...item });
      }
    });

    // Prepare table data
    const bankNames = Array.from(reducedDataMap.keys());
    const emptyRow = {
      name: "",
      ...bankNames.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
    };

    const resultData = [
      { ...emptyRow },
      { name: "Số tiền tiết kiệm" },
      { name: "Thực nhận" },
      { name: "Số tiền sau rút" },
      { name: "Lãi dự kiến" },
      { name: "Lãi/lỗ sau rút" },
      { ...emptyRow },
    ];

    for (const [key, value] of reducedDataMap.entries()) {
      resultData[1][key] = value.savMoney;
      resultData[2][key] = value.savTotalMoney;
      resultData[3][key] = value.savTRealMoney;
      resultData[4][key] = value.savInteretMoney;
      resultData[5][key] = value.savRealInterMoney;
    }

    // Prepare pie chart data
    const pieResultData = Array.from(reducedDataMap.entries()).map(([key, value], index) => ({
      label: key,
      value: value.savMoney,
      color: RENDER_COLORS[(index + 1) % RENDER_COLORS.length],
    }));

    res.json({ resultData, pieResultData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create new saving
 * @route POST /api/savings
 * @header { token }
 */
router.post("/", auth, async (req, res) => {
  try {
    const {
      bnkLstID, bnkName, savDate, savMoney, savMonth, savInteret, savInteretMoney,
      savTotalMoney, savStatus, savTRealMoney, savRealInterMoney,
    } = req.body;

    const savingData = {
      bnkLstID, bnkName, savDate, savMoney, savMonth, savInteret, savInteretMoney,
      savTotalMoney, savStatus, savTRealMoney, savRealInterMoney,
    };

    const results = await Promise.all([
      commonUtil.createData(req, res, savingData, Saving, "Bảng tiết kiệm"),
      commonUtil.updateWalletAfterCreation(req, res, "TK", -parseInt(savMoney), User)
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Update saving
 * @route PUT /api/savings/:id
 * @header { token }
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      bnkLstID, bnkName, savDate, savMoney, savMonth, savInteret, savInteretMoney,
      savTotalMoney, savStatus, savTRealMoney, savRealInterMoney, savDMoney,
    } = req.body;

    const savingData = {
      bnkLstID, bnkName, savDate, savMoney, savMonth, savInteret, savInteretMoney,
      savTotalMoney, savStatus, savTRealMoney, savRealInterMoney,
    };

    const savingId = req.params.id;
    const updateAmount = savStatus === true ? parseInt(savTRealMoney) : -parseInt(savDMoney || savMoney);

    const results = await Promise.all([
      commonUtil.updateData(req, res, savingData, Saving, savingId, "Bảng tiết kiệm"),
      commonUtil.updateWalletAfterUpdate(req, res, "TK", updateAmount, User)
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete saving
 * @route DELETE /api/savings/:id
 * @header { token }
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const savingId = req.params.id;
    const data = req.body;

    const results = await Promise.all([
      commonUtil.deleteData(req, res, Saving, savingId, "Bảng tiết kiệm"),
      commonUtil.updateWalletBatch(req, "bnkLstID", "savMoney", data, User)
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
