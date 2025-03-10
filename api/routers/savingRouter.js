const router = require("express").Router();
const Saving = require("../models/savingModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// Constants
const CURRENCY_FORMAT = {
  style: "currency",
  currency: "VND",
  locale: "it-IT",
};

const RENDER_COLORS = ["#8884d8", "#ffc658", "#ff007f", "#82ca9d"];

// Helper Functions
const formatCurrency = (amount) => {
  return amount.toLocaleString(CURRENCY_FORMAT.locale, {
    style: CURRENCY_FORMAT.style,
    currency: CURRENCY_FORMAT.currency,
  });
};

const processOperationResult = (res, entityResult, walletResult) => {
  if (entityResult.status === 200 && walletResult.status === 200) {
    return res.json(`${entityResult.message} và ${walletResult.message}`);
  }

  if (entityResult.status !== 200 && walletResult.status === 200) {
    return res.status(400).json({ errorMessage: entityResult.message });
  }

  return res.status(400).json({
    errorMessage: "Hãy liên hệ nhà phát triễn ứng để xử lý",
  });
};

// Routes
// Get all savings
router.get("/", auth, async (req, res) => {
  try {
    await commonUtil.getAllData(req, res, Saving);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Get saving report total data
router.get("/reporttotaldata", auth, async (req, res) => {
  try {
    const resultData = {
      iReportStartMon: 0,
      iReportTotalMon: 0,
      iUnsavedAmount: 0,
      iSavingAmount: 0,
      iAmountOfInterest: 0,
    };

    const activeSavings = await Saving.find({ user: req.user, savStatus: false });
    const userLogin = await User.findById(req.user);

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
      iReportStartMon: formatCurrency(resultData.iReportStartMon),
      iReportTotalMon: formatCurrency(resultData.iReportTotalMon),
      iUnsavedAmount: formatCurrency(resultData.iUnsavedAmount),
      iSavingAmount: formatCurrency(resultData.iSavingAmount),
      iAmountOfInterest: formatCurrency(resultData.iAmountOfInterest),
    };

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Get saving data report list
router.post("/reportsaving", auth, async (req, res) => {
  try {
    const { date, month, bank, status } = req.body;
    const allSavings = await Saving.find({ user: req.user });

    // Filter functions
    const matches = (item, field, values, transform = (v) => v) => {
      return !values || values.length === 0 || values.includes(transform(item[field]));
    };

    const dateToDay = (d) =>
      d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString();
    const dateToMonth = (d) => (d.getMonth() + 1).toString();

    const filterData = (item) => {
      return (
        matches(item, "savDate", date, dateToDay) &&
        matches(item, "savDate", month, dateToMonth) &&
        matches(item, "bnkName", bank) &&
        (!status ||
          status.length === 0 ||
          status.some((keyword) =>
            keyword.includes(item.savStatus ? "Đã rút tiết kiệm" : "Đang gửi tiết kiệm")
          ))
      );
    };

    const filteredData = allSavings.filter(filterData);
    const activeSavings = allSavings.filter((i) => i.savStatus === false);

    // Group data by bank name
    const groupDataByBank = (data) => {
      const result = {};
      data.forEach((item) => {
        if (!result[item.bnkName]) {
          result[item.bnkName] = [];
        }
        result[item.bnkName].push(item);
      });
      return result;
    };

    const dataByBank = groupDataByBank(filteredData);
    const pieDataByBank = groupDataByBank(activeSavings);

    // Reduce function to consolidate data
    const reduceData = (data) => {
      return data.reduce((acc, current) => {
        const existing = acc.find(
          (item) => item.bnkLstID === current.bnkLstID && item.bnkName === current.bnkName
        );

        if (existing) {
          existing.savMoney += current.savMoney;
          existing.savInteretMoney += current.savInteretMoney;
          existing.savTotalMoney += current.savTotalMoney;
          existing.savTRealMoney += current.savTRealMoney;
          existing.savRealInterMoney += current.savRealInterMoney;
        } else {
          acc.push({ ...current._doc });
        }

        return acc;
      }, []);
    };

    // Reduce each bank group
    const reduceBankGroups = (groups) => {
      const reducedGroups = {};
      for (const [key, value] of Object.entries(groups)) {
        reducedGroups[key] = reduceData(value)[0];
      }
      return reducedGroups;
    };

    const reducedData = reduceBankGroups(dataByBank);
    const reducedPieData = reduceBankGroups(pieDataByBank);

    // Prepare table data
    const bankNames = Object.keys(reducedData);
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

    for (const [key, value] of Object.entries(reducedData)) {
      resultData[1][key] = value.savMoney;
      resultData[2][key] = value.savTotalMoney;
      resultData[3][key] = value.savTRealMoney;
      resultData[4][key] = value.savInteretMoney;
      resultData[5][key] = value.savRealInterMoney;
    }

    // Prepare pie chart data
    const pieResultData = Object.entries(reducedData).map(([key, value], index) => ({
      label: key,
      value: value.savMoney,
      color: RENDER_COLORS[(index + 1) % RENDER_COLORS.length],
    }));

    res.json({ resultData, pieResultData });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Create new saving
router.post("/", auth, async (req, res) => {
  try {
    const {
      bnkLstID,
      bnkName,
      savDate,
      savMoney,
      savMonth,
      savInteret,
      savInteretMoney,
      savTotalMoney,
      savStatus,
      savTRealMoney,
      savRealInterMoney,
    } = req.body;

    const savingData = {
      bnkLstID,
      bnkName,
      savDate,
      savMoney,
      savMonth,
      savInteret,
      savInteretMoney,
      savTotalMoney,
      savStatus,
      savTRealMoney,
      savRealInterMoney,
    };

    const savingResult = await commonUtil.createData(
      req,
      res,
      savingData,
      Saving,
      "Bảng tiết kiệm"
    );

    const walletResult = await commonUtil.updateWalletAfterCreation(
      req,
      res,
      "TK",
      -parseInt(savMoney),
      User
    );

    processOperationResult(res, savingResult, walletResult);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update saving
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      bnkLstID,
      bnkName,
      savDate,
      savMoney,
      savMonth,
      savInteret,
      savInteretMoney,
      savTotalMoney,
      savStatus,
      savTRealMoney,
      savRealInterMoney,
      savDMoney,
    } = req.body;

    const savingData = {
      bnkLstID,
      bnkName,
      savDate,
      savMoney,
      savMonth,
      savInteret,
      savInteretMoney,
      savTotalMoney,
      savStatus,
      savTRealMoney,
      savRealInterMoney,
    };

    const savingId = req.params.id;
    const updateAmount = savStatus === true ? parseInt(savTRealMoney) : -parseInt(savDMoney);

    const savingResult = await commonUtil.updateData(
      req,
      res,
      savingData,
      Saving,
      savingId,
      "Bảng tiết kiệm"
    );

    const walletResult = await commonUtil.updateWalletAfterUpdate(
      req,
      res,
      "TK",
      updateAmount,
      User
    );

    processOperationResult(res, savingResult, walletResult);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Delete saving
router.delete("/:id", auth, async (req, res) => {
  try {
    const savingId = req.params.id;
    const data = req.body;

    const savingResult = await commonUtil.deleteData(req, res, Saving, savingId, "Bảng tiết kiệm");

    const walletResult = await commonUtil.updateWalletBatch(
      req,
      "bnkLstID",
      "savMoney",
      data,
      User
    );

    processOperationResult(res, savingResult, walletResult);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
