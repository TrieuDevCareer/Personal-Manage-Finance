const router = require("express").Router();
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

const EXPENSE_TYPES = {
  LIVING: "SO", // Nguồn sống
  FREE: "TD", // Tự do
};

const COLOR_PALETTE = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#0ecb74", "#ff007f", "#FDDE55"];

const getMonthLastDay = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const calculateDaysUntilSalary = (currentDay, salaryDate) => {
  if (salaryDate > currentDay) {
    return salaryDate - currentDay;
  }

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  return getMonthLastDay(year, month) - currentDay + salaryDate;
};

const calculateDailyAllowance = (totalAmount, daysRemaining) => {
  return Math.round(totalAmount / daysRemaining);
};

// Routes
// Get all expenses
router.get("/", auth, async (req, res) => {
  try {
    await commonUtil.getAllData(req, res, Expense);
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
});

// Get daily expense report
router.get("/byday", auth, async (req, res) => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    const userData = await User.findById(req.user).lean();
    if (!userData) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    // Use Aggregation to get today's expenses by type
    const startOfToday = new Date(year, month, day);
    const endOfToday = new Date(year, month, day + 1);

    const todayAgg = await Expense.aggregate([
      {
        $match: {
          user: userData._id,
          expDate: { $gte: startOfToday, $lt: endOfToday }
        }
      },
      {
        $group: {
          _id: "$exelstCode",
          total: { $sum: "$expMoney" }
        }
      }
    ]);

    const todayExpenses = {
      [EXPENSE_TYPES.LIVING]: 0,
      [EXPENSE_TYPES.FREE]: 0,
    };

    todayAgg.forEach(item => {
      if (item._id in todayExpenses) {
        todayExpenses[item._id] = item.total;
      }
    });

    const daysUntilSalary = calculateDaysUntilSalary(day, userData.salaryDate);
    const livingDailyAllowance = calculateDailyAllowance(userData.walletLife, daysUntilSalary);
    const freeDailyAllowance = calculateDailyAllowance(userData.walletFree, daysUntilSalary);

    res.json({
      SoDay: commonUtil.formatCurrency(livingDailyAllowance),
      TdDay: commonUtil.formatCurrency(freeDailyAllowance),
      SO: commonUtil.formatCurrency(todayExpenses[EXPENSE_TYPES.LIVING]),
      TD: commonUtil.formatCurrency(todayExpenses[EXPENSE_TYPES.FREE]),
      walletLife: commonUtil.formatCurrency(userData.walletLife),
      walletFree: commonUtil.formatCurrency(userData.walletFree),
    });
  } catch (error) {
    res.status(500).json({ errorMessage: "Error fetching daily report", error: error.message });
  }
});

// Generate expense report
router.post("/reportexpense", auth, async (req, res) => {
  try {
    const { date, month, capitalSource, contentData } = req.body;
    
    // Use .lean() for 10x faster query and 10x less RAM usage
    const expenses = await Expense.find({ user: req.user }).lean();

    const filteredExpenses = expenses.filter((item) => {
      const dayMatches = !date || date.length === 0 || 
        date.includes(item.expDate.getDate() < 10 ? "0" + item.expDate.getDate().toString() : item.expDate.getDate().toString());

      const monthMatches = !month || month.length === 0 || 
        month.includes((item.expDate.getMonth() + 1).toString());

      const sourceMatches = !capitalSource || capitalSource.length === 0 || 
        capitalSource.includes(item.exelstCode);

      const contentMatches = !contentData || contentData.length === 0 || 
        contentData.some((keyword) => keyword.includes(item.exelstCode) && keyword.includes(item.exeLstContent));

      return dayMatches && monthMatches && sourceMatches && contentMatches;
    });

    // O(N) grouping using Maps instead of nested findIndex
    const mapSO = new Map();
    const mapTD = new Map();

    filteredExpenses.forEach((item) => {
      const type = item.exelstCode;
      if (type === EXPENSE_TYPES.LIVING) {
        const key = item.exeLstContent;
        if (mapSO.has(key)) mapSO.get(key).expMoney += item.expMoney;
        else mapSO.set(key, { ...item });
      } else if (type === EXPENSE_TYPES.FREE) {
        const key = item.exeLstContent;
        if (mapTD.has(key)) mapTD.get(key).expMoney += item.expMoney;
        else mapTD.set(key, { ...item });
      }
    });

    const aggregatedExpenses = {
      [EXPENSE_TYPES.LIVING]: Array.from(mapSO.values()),
      [EXPENSE_TYPES.FREE]: Array.from(mapTD.values()),
    };

    const maxRows = Math.max(
      aggregatedExpenses[EXPENSE_TYPES.LIVING].length,
      aggregatedExpenses[EXPENSE_TYPES.FREE].length
    );

    const tableData = Array(maxRows).fill().map((_, i) => ({
      name: i + 1,
      [`Nguồn sống`]: aggregatedExpenses[EXPENSE_TYPES.LIVING][i]?.expMoney || 0,
      [`Tự do`]: aggregatedExpenses[EXPENSE_TYPES.FREE][i]?.expMoney || 0,
      [`SOContent`]: aggregatedExpenses[EXPENSE_TYPES.LIVING][i]?.exeLstContent || "",
      [`TDContent`]: aggregatedExpenses[EXPENSE_TYPES.FREE][i]?.exeLstContent || "",
    }));

    const pieChartData = [
      ...aggregatedExpenses[EXPENSE_TYPES.LIVING],
      ...aggregatedExpenses[EXPENSE_TYPES.FREE],
    ].map((item, index) => ({
      label: `${item.exelstCode}-${item.exeLstContent}`,
      value: item.expMoney,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
    }));

    res.json({ resultData: tableData, pieChartData });
  } catch (error) {
    res.status(500).json({ errorMessage: "Error generating expense report", error: error.message });
  }
});

// Create expense
router.post("/", auth, async (req, res) => {
  try {
    const { exelstCode, exeLstContent, expDate, expDetail, expMoney } = req.body;

    const expenseData = { exelstCode, exeLstContent, expDate, expDetail, expMoney };
    
    const results = await Promise.all([
      commonUtil.createData(req, res, expenseData, Expense, "bảng chi tiêu"),
      commonUtil.updateWalletAfterCreation(req, res, exelstCode, -parseInt(expMoney), User)
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    res.status(500).json({ errorMessage: "Lỗi khi tạo chi tiêu", error: error.message });
  }
});

// Update expense
router.put("/:id", auth, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { exelstCode, exeLstContent, expDate, expDetail, expMoney, expDMoney } = req.body;

    const updateData = { exelstCode, exeLstContent, expDate, expDetail, expMoney };
    
    const results = await Promise.all([
      commonUtil.updateData(req, res, updateData, Expense, expenseId, "bảng chi tiêu"),
      commonUtil.updateWalletAfterUpdate(req, res, exelstCode, -parseInt(expDMoney || 0), User)
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    res.status(500).json({ errorMessage: "Lỗi khi cập nhật chi tiêu", error: error.message });
  }
});

// Delete expense
router.delete("/:id", auth, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expenseData = req.body;

    const results = await Promise.all([
      commonUtil.deleteData(req, res, Expense, expenseId, "bảng chi tiêu"),
      commonUtil.updateWalletBatch(req, "exelstCode", "expMoney", expenseData, User)
    ]);

    return commonUtil.handleMultipleResults(res, results);
  } catch (error) {
    res.status(500).json({ errorMessage: "Lỗi khi xóa chi tiêu", error: error.message });
  }
});

module.exports = router;
