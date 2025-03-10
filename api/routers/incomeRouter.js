const router = require("express").Router();
const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");
const Saving = require("../models/savingModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

const handleMultipleResults = (res, results) => {
  const hasErrors = results.some((result) => result.status !== 200);

  if (!hasErrors) {
    const messages = results
      .filter((r) => r.message)
      .map((r) => r.message)
      .join(" và ");
    return res.json(messages || "Thao tác thành công");
  }

  const errorResult = results.find((r) => r.status !== 200);
  return res.status(errorResult.status).json({
    errorMessage: errorResult.message || "Hãy liên hệ nhà phát triễn ứng để xử lý",
  });
};

// Data processing functions
const processMonthlyData = async (req) => {
  const resultData = new Array(12).fill().map(() => ({ incomeSite: 0, expenseSite: 0 }));

  // Fetch all data in parallel
  const [aIncomeData, aExpenseData, aSavingData, aInvestData] = await Promise.all([
    Income.find({ user: req.user }),
    Expense.find({ user: req.user }),
    Saving.find({ user: req.user, savStatus: false }),
    Saving.find({ user: req.user, investStatus: false }),
  ]);

  // Process income data
  aIncomeData.forEach((income) => {
    const month = income.incDate.getMonth();
    resultData[month].incomeSite += income.incMoney;
  });

  // Process expense data
  aExpenseData.forEach((expense) => {
    const month = expense.expDate.getMonth();
    resultData[month].expenseSite += expense.expMoney;
  });

  // Process saving data
  aSavingData.forEach((saving) => {
    const month = saving.savDate.getMonth();
    resultData[month].expenseSite += saving.savMoney;
  });

  // Process investment data
  aInvestData.forEach((invest) => {
    const month = invest.investDate.getMonth();
    resultData[month].expenseSite += invest.investMoney;
  });

  return resultData;
};

const filterIncomeData = (data, filters) => {
  const { date, month, capitalSource, contentData } = filters;

  // Check if item matches filter criteria
  const matches = (item, field, values, transform = (v) => v) => {
    return !values || values.length === 0 || values.includes(transform(item[field]));
  };

  return data.filter(
    (item) =>
      matches(item, "incDate", date, (d) =>
        d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString()
      ) &&
      matches(item, "incDate", month, (d) => (d.getMonth() + 1).toString()) &&
      matches(item, "inlstCode", capitalSource) &&
      (!contentData ||
        contentData.length === 0 ||
        contentData.some(
          (keyword) => keyword.includes(item.inlstCode) && keyword.includes(item.inLstContent)
        ))
  );
};

const groupAndReduceIncomeData = (filteredData) => {
  // Group data by code
  const codeCategories = ["SO", "TD", "DT", "TK"];
  const dataByCode = codeCategories.reduce((acc, code) => {
    acc[code] = [];
    return acc;
  }, {});

  filteredData.forEach((item) => {
    if (dataByCode[item.inlstCode]) {
      dataByCode[item.inlstCode].push(item);
    }
  });

  // Reduce data within each category
  const reduceData = (data) => {
    return data.reduce((acc, current) => {
      const existing = acc.find(
        (item) => item.inlstCode === current.inlstCode && item.inLstContent === current.inLstContent
      );

      if (existing) {
        existing.incMoney += current.incMoney;
      } else {
        acc.push({ ...current._doc });
      }

      return acc;
    }, []);
  };

  // Apply reduction to each category
  const reducedData = {};
  codeCategories.forEach((code) => {
    reducedData[code] = reduceData(dataByCode[code]);
  });

  return reducedData;
};

const formatIncomeReport = (reducedData) => {
  const maxLength = Math.max(...Object.values(reducedData).map((arr) => arr.length));

  return new Array(maxLength).fill().map((_, i) => ({
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
    const aIncomeData = await Income.find({ user: req.user });
    const filteredData = filterIncomeData(aIncomeData, req.body);
    const reducedData = groupAndReduceIncomeData(filteredData);
    const resultData = formatIncomeReport(reducedData);

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

    return handleMultipleResults(res, results);
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

    return handleMultipleResults(res, results);
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

    return handleMultipleResults(res, results);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

module.exports = router;
