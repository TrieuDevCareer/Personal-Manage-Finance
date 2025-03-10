const router = require("express").Router();
const Investment = require("../models/investmentModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// Helper functions
const responseHandler = (res, result) => {
  if (result.status === 200) {
    return res.json(result.data || result.message);
  }
  return res.status(result.status).json({ errorMessage: result.message });
};

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

const formatCurrency = (amount) => {
  return amount.toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  });
};

// Data processing functions
const calculateTotalInvestmentData = async (req) => {
  let resultData = {
    investmentAmount: 0,
    nonInvestAmount: 0,
    profitAmount: 0,
  };

  const [aInvestData, oUserLogin] = await Promise.all([
    Investment.find({ user: req.user, investStatus: false }),
    User.findById(req.user),
  ]);

  aInvestData.forEach((item) => {
    resultData.investmentAmount += item.investMoney;
    resultData.profitAmount += item.investResult;
  });

  resultData.investmentAmount += oUserLogin.walletInvest;
  resultData.nonInvestAmount += oUserLogin.walletInvest;

  return {
    investmentAmount: formatCurrency(resultData.investmentAmount),
    nonInvestAmount: formatCurrency(resultData.nonInvestAmount),
    profitAmount: formatCurrency(resultData.profitAmount),
  };
};

const filterInvestmentData = (data, filters) => {
  const { date, month, coin, status } = filters;

  // Check if item matches filter criteria
  const matches = (item, field, values, transform = (v) => v) => {
    return !values || values.length === 0 || values.includes(transform(item[field]));
  };

  return data.filter(
    (item) =>
      matches(item, "investDate", date, (d) =>
        d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString()
      ) &&
      matches(item, "investDate", month, (d) => (d.getMonth() + 1).toString()) &&
      matches(item, "coinName", coin) &&
      (!status ||
        status.length === 0 ||
        status.some((keyword) => keyword.includes(item.investStatus ? "Đã bán" : "Đang giữ")))
  );
};

const groupInvestmentData = (data, activeOnly = false) => {
  let groupedData = {};

  // Filter active investments if required
  const dataToProcess = activeOnly ? data.filter((i) => i.investStatus === false) : data;

  // Group by coin name
  dataToProcess.forEach((item) => {
    if (!groupedData[item.coinName]) {
      groupedData[item.coinName] = [];
    }
    groupedData[item.coinName].push(item);
  });

  return groupedData;
};

const reduceInvestmentData = (data) => {
  return data.reduce((acc, current) => {
    const existing = acc.find(
      (item) => item.coinLstID === current.coinLstID && item.coinName === current.coinName
    );

    if (existing) {
      existing.investMoney += current.investMoney;
      existing.investReMoney += current.investReMoney;
      existing.investResult += current.investResult;
      existing.investNumCoin += current.investNumCoin;
    } else {
      acc.push({ ...current._doc });
    }

    return acc;
  }, []);
};

const aggregateInvestmentData = (groupedData) => {
  const reducedData = {};

  // Reduce each group
  for (const [key, value] of Object.entries(groupedData)) {
    reducedData[key] = reduceInvestmentData(value)[0];
  }

  return reducedData;
};

const formatInvestmentReport = (reducedData) => {
  // Create table data structure
  let initialData = {
    name: "",
    ...Object.keys(reducedData).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
  };

  let resultData = [
    { ...initialData },
    { name: "Số tiền mua" },
    { name: "Số tiền thu" },
    { name: "Lãi/Lỗ" },
    { name: "Số coin mua được" },
    { ...initialData },
  ];

  // Fill in data
  for (const [key, value] of Object.entries(reducedData)) {
    resultData[1][key] = value.investMoney;
    resultData[2][key] = value.investReMoney;
    resultData[3][key] = value.investResult;
    resultData[4][key] = value.investNumCoin;
  }

  return resultData;
};

const createPieChartData = (reducedData) => {
  const rendercolor = ["#8884d8", "#ffc658", "#ff007f", "#82ca9d"];
  let pieResultData = [];
  let i = 0;

  for (const [key, value] of Object.entries(reducedData)) {
    pieResultData.push({
      label: key,
      value: value.investMoney,
      color: rendercolor[i % rendercolor.length],
    });
    i++;
  }

  return pieResultData;
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
    // Get all investment data for the user
    const investmentData = await Investment.find({ user: req.user });

    // Filter data based on request parameters
    const filteredData = filterInvestmentData(investmentData, req.body);

    // Group data by coin name
    const groupedData = groupInvestmentData(filteredData);
    const groupedActiveData = groupInvestmentData(investmentData, true);

    // Aggregate data
    const reducedData = aggregateInvestmentData(groupedData);
    const reducedActiveData = aggregateInvestmentData(groupedActiveData);

    // Format data for reporting
    const resultData = formatInvestmentReport(reducedData);
    const pieResultData = createPieChartData(reducedActiveData);

    return res.json({ resultData, pieResultData });
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Create investment data
router.post("/", auth, async (req, res) => {
  try {
    const {
      coinLstID,
      coinName,
      investDate,
      investExRate,
      investMoney,
      investNumCoin,
      investReUSDT,
      investStatus,
      investSeDate,
      investSeMoney,
      investSeExRate,
      investSeUSDT,
      investReMoney,
      investResult,
    } = req.body;

    const oCreateData = {
      coinLstID,
      coinName,
      investDate,
      investExRate,
      investMoney,
      investNumCoin,
      investReUSDT,
      investStatus,
      investSeDate,
      investSeMoney,
      investSeExRate,
      investSeUSDT,
      investReMoney,
      investResult,
    };

    const results = await Promise.all([
      commonUtil.createData(req, res, oCreateData, Investment, "bảng đầu tư"),
      commonUtil.updateWalletAfterCreation(req, res, "DT", -parseInt(investMoney), User),
    ]);

    return handleMultipleResults(res, results);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Update investment data
router.put("/:id", auth, async (req, res) => {
  try {
    const {
      coinLstID,
      coinName,
      investDate,
      investExRate,
      investMoney,
      investNumCoin,
      investReUSDT,
      investStatus,
      investSeDate,
      investSeMoney,
      investSeExRate,
      investSeUSDT,
      investReMoney,
      investResult,
      investDMoney,
    } = req.body;

    const oUpdateData = {
      coinLstID,
      coinName,
      investDate,
      investExRate,
      investMoney,
      investNumCoin,
      investReUSDT,
      investStatus,
      investSeDate,
      investSeMoney,
      investSeExRate,
      investSeUSDT,
      investReMoney,
      investResult,
    };

    const sInvestmentId = req.params.id;
    const walletUpdateAmount =
      investStatus === true ? parseInt(investReMoney) : -parseInt(investDMoney || investMoney);

    const results = await Promise.all([
      commonUtil.updateData(req, res, oUpdateData, Investment, sInvestmentId, "bảng đầu tư"),
      commonUtil.updateWalletAfterUpdate(req, res, "DT", walletUpdateAmount, User),
    ]);

    return handleMultipleResults(res, results);
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

    return handleMultipleResults(res, results);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

module.exports = router;
