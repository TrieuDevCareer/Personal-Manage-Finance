const router = require("express").Router();
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// Constants
const CURRENCY_FORMAT = {
  style: "currency",
  currency: "VND",
};

const EXPENSE_TYPES = {
  LIVING: "SO", // Nguồn sống
  FREE: "TD", // Tự do
};

const COLOR_PALETTE = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#0ecb74", "#ff007f", "#FDDE55"];

// Helpers
const formatCurrency = (amount) => {
  return amount.toLocaleString("it-IT", CURRENCY_FORMAT);
};

const getMonthLastDay = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const calculateDaysUntilSalary = (currentDay, salaryDate) => {
  if (salaryDate >= currentDay) {
    return salaryDate - currentDay + 1;
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

    const userData = await User.findById(req.user);
    if (!userData) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    // Get current month's expenses
    const expenses = await Expense.find({
      user: req.user,
      expDate: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      },
    });

    // Calculate today's expenses by type
    const todayExpenses = {
      [EXPENSE_TYPES.LIVING]: 0,
      [EXPENSE_TYPES.FREE]: 0,
    };

    // Filter for today's expenses and sum by type
    expenses
      .filter((item) => item.expDate.getDate() === day)
      .forEach((item) => {
        if (item.exelstCode in todayExpenses) {
          todayExpenses[item.exelstCode] += item.expMoney;
        }
      });

    // Calculate days until next salary
    const daysUntilSalary = calculateDaysUntilSalary(day, userData.salaryDate);

    // Calculate daily allowances
    const livingDailyAllowance = calculateDailyAllowance(userData.walletLife, daysUntilSalary);
    const freeDailyAllowance = calculateDailyAllowance(userData.walletFree, daysUntilSalary);

    // Format response data
    const response = {
      SoDay: formatCurrency(livingDailyAllowance),
      TdDay: formatCurrency(freeDailyAllowance),
      SO: formatCurrency(todayExpenses[EXPENSE_TYPES.LIVING]),
      TD: formatCurrency(todayExpenses[EXPENSE_TYPES.FREE]),
      walletLife: formatCurrency(userData.walletLife),
      walletFree: formatCurrency(userData.walletFree),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ errorMessage: "Error fetching daily report", error: error.message });
  }
});

// Generate expense report
router.post("/reportexpense", auth, async (req, res) => {
  try {
    const { date, month, capitalSource, contentData } = req.body;
    const expenses = await Expense.find({ user: req.user });

    // Filter expenses based on criteria
    const filteredExpenses = expenses.filter((item) => {
      // Date filter
      const dayMatches =
        !date ||
        date.length === 0 ||
        date.includes(
          item.expDate.getDate() < 10
            ? "0" + item.expDate.getDate().toString()
            : item.expDate.getDate().toString()
        );

      // Month filter
      const monthMatches =
        !month || month.length === 0 || month.includes((item.expDate.getMonth() + 1).toString());

      // Category filter
      const sourceMatches =
        !capitalSource || capitalSource.length === 0 || capitalSource.includes(item.exelstCode);

      // Content filter
      const contentMatches =
        !contentData ||
        contentData.length === 0 ||
        contentData.some(
          (keyword) => keyword.includes(item.exelstCode) && keyword.includes(item.exeLstContent)
        );

      return dayMatches && monthMatches && sourceMatches && contentMatches;
    });

    // Group expenses by type
    const expensesByType = {
      [EXPENSE_TYPES.LIVING]: [],
      [EXPENSE_TYPES.FREE]: [],
    };

    filteredExpenses.forEach((item) => {
      if (item.exelstCode in expensesByType) {
        expensesByType[item.exelstCode].push(item);
      }
    });

    // Aggregate expenses by content
    const aggregateByContent = (expenses) => {
      return expenses.reduce((result, current) => {
        const existingIndex = result.findIndex(
          (item) =>
            item.exelstCode === current.exelstCode && item.exeLstContent === current.exeLstContent
        );

        if (existingIndex >= 0) {
          result[existingIndex].expMoney += current.expMoney;
        } else {
          result.push({ ...current._doc });
        }

        return result;
      }, []);
    };

    const aggregatedExpenses = {
      [EXPENSE_TYPES.LIVING]: aggregateByContent(expensesByType[EXPENSE_TYPES.LIVING]),
      [EXPENSE_TYPES.FREE]: aggregateByContent(expensesByType[EXPENSE_TYPES.FREE]),
    };

    // Prepare chart data
    const maxRows = Math.max(
      aggregatedExpenses[EXPENSE_TYPES.LIVING].length,
      aggregatedExpenses[EXPENSE_TYPES.FREE].length
    );

    // Table data for bar chart
    const tableData = Array(maxRows)
      .fill()
      .map((_, i) => ({
        name: i + 1,
        [`Nguồn sống`]: aggregatedExpenses[EXPENSE_TYPES.LIVING][i]?.expMoney || 0,
        [`Tự do`]: aggregatedExpenses[EXPENSE_TYPES.FREE][i]?.expMoney || 0,
        [`SOContent`]: aggregatedExpenses[EXPENSE_TYPES.LIVING][i]?.exeLstContent || "",
        [`TDContent`]: aggregatedExpenses[EXPENSE_TYPES.FREE][i]?.exeLstContent || "",
      }));

    // Pie chart data
    const allExpenseCategories = [
      ...aggregatedExpenses[EXPENSE_TYPES.LIVING],
      ...aggregatedExpenses[EXPENSE_TYPES.FREE],
    ];

    const pieChartData = allExpenseCategories.map((item, index) => ({
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

    // Create expense record
    const expenseData = { exelstCode, exeLstContent, expDate, expDetail, expMoney };
    const expenseResult = await commonUtil.createData(
      req,
      res,
      expenseData,
      Expense,
      "bảng chi tiêu"
    );

    if (expenseResult.status !== 200) {
      return res.status(400).json({ errorMessage: expenseResult.message });
    }

    // Update user wallet (reduce balance)
    const walletResult = await commonUtil.updateWalletAfterCreation(
      req,
      res,
      exelstCode,
      -parseInt(expMoney),
      User
    );

    if (walletResult.status !== 200) {
      return res.status(400).json({
        errorMessage: "Hãy liên hệ nhà phát triễn ứng dụng để xử lý",
      });
    }

    res.json(`${expenseResult.message} và ${walletResult.message}`);
  } catch (error) {
    res.status(500).json({ errorMessage: "Lỗi khi tạo chi tiêu", error: error.message });
  }
});

// Update expense
router.put("/:id", auth, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const { exelstCode, exeLstContent, expDate, expDetail, expMoney } = req.body;

    // Update expense record
    const updateData = { exelstCode, exeLstContent, expDate, expDetail, expMoney };
    const updateResult = await commonUtil.updateData(
      req,
      res,
      updateData,
      Expense,
      expenseId,
      "bảng chi tiêu"
    );

    if (updateResult.status !== 200) {
      return res.status(400).json({ errorMessage: updateResult.message });
    }

    // Update user wallet
    const walletResult = await commonUtil.updateWalletAfterUpdate(
      req,
      res,
      exelstCode,
      -parseInt(req.body.expDMoney),
      User
    );

    if (walletResult.status !== 200) {
      return res.status(400).json({
        errorMessage: "Hãy liên hệ nhà phát triễn ứng dụng để xử lý",
      });
    }

    res.json(`${updateResult.message} và ${walletResult.message}`);
  } catch (error) {
    res.status(500).json({
      errorMessage: "Lỗi khi cập nhật chi tiêu",
      error: error.message,
    });
  }
});

// Delete expense
router.delete("/:id", auth, async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expenseData = req.body;

    // Delete expense record
    const deleteResult = await commonUtil.deleteData(req, res, Expense, expenseId, "bảng chi tiêu");

    if (deleteResult.status !== 200) {
      return res.status(400).json({ errorMessage: deleteResult.message });
    }

    // Update user wallet (add amount back)
    const walletResult = await commonUtil.updateWalletBatch(
      req,
      "exelstCode",
      "expMoney",
      expenseData,
      User
    );

    if (walletResult.status !== 200) {
      return res.status(400).json({
        errorMessage: "Hãy liên hệ nhà phát triễn ứng dụng để xử lý",
      });
    }

    res.json("Đã xóa thu nhập và cập nhập Ví của bạn");
  } catch (error) {
    res.status(500).json({
      errorMessage: "Lỗi khi xóa chi tiêu",
      error: error.message,
    });
  }
});

module.exports = router;
