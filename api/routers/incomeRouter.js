const router = require("express").Router();
const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, Income);
});

// get Income - Expense in year
router.get("/reporttotal", auth, async (req, res) => {
  const resultData = new Array(12).fill().map(() => ({ incomeSite: 0, expenseSite: 0 }));
  const aIncomeData = await Income.find({ user: req.user });
  const aExpenseData = await Expense.find({ user: req.user });
  aIncomeData.forEach((income) => {
    const month = income.incDate.getMonth();
    resultData[month].incomeSite += income.incMoney;
  });
  aExpenseData.forEach((expense) => {
    const month = expense.expDate.getMonth();
    resultData[month].expenseSite += expense.expMoney;
  });
  res.json(resultData);
});

// get Income Data report list
router.post("/reportincome", auth, async (req, res) => {
  const { date, month, capitalSource, contentData } = req.body;
  const aIncomeData = await Income.find({ user: req.user });
  const aSOIncomeData = [];
  const aTKIncomeData = [];
  const aDTIncomeData = [];
  const aTDIncomeData = [];
  const filteredData = aIncomeData.filter((item) => {
    const itemDate = item.incDate.getDate().toString();
    const itemMonth = (item.incDate.getMonth() + 1).toString();
    let dateMatch = true;
    let monthMatch = true;
    let capitalSourceMatch = true;
    let contentDataMatch = true;
    if (date && date.length > 0) {
      dateMatch = date.includes(itemDate);
    }
    if (month && month.length > 0) {
      monthMatch = month.includes(itemMonth);
    }
    if (capitalSource && capitalSource.length > 0) {
      capitalSourceMatch = capitalSource.includes(item.inlstCode);
    }
    if (contentData && contentData.length > 0) {
      contentDataMatch = contentData.some((keyword) => item.inLstContent.includes(keyword));
    }
    return dateMatch && monthMatch && capitalSourceMatch && contentDataMatch;
  });
  filteredData.forEach((item) => {
    if (item.inlstCode === "SO") {
      aSOIncomeData.push(item);
    }
    if (item.inlstCode === "TD") {
      aTDIncomeData.push(item);
    }
    if (item.inlstCode === "DT") {
      aDTIncomeData.push(item);
    }
    if (item.inlstCode === "TK") {
      aTKIncomeData.push(item);
    }
  });
  const reducedSOData = aSOIncomeData.reduce((acc, current) => {
    // Tìm mục đã tồn tại trong acc có cùng inlstCode và inLstContent
    const existing = acc.find(
      (item) => item.inlstCode === current.inlstCode && item.inLstContent === current.inLstContent
    );

    if (existing) {
      // Nếu tồn tại, cộng dồn incMoney
      existing.incMoney += current.incMoney;
    } else {
      // Nếu không tồn tại, thêm mục mới vào acc
      acc.push({ ...current._doc });
    }

    return acc;
  }, []);
  const reducedTDData = aTDIncomeData.reduce((acc, current) => {
    // Tìm mục đã tồn tại trong acc có cùng inlstCode và inLstContent
    const existing = acc.find(
      (item) => item.inlstCode === current.inlstCode && item.inLstContent === current.inLstContent
    );

    if (existing) {
      // Nếu tồn tại, cộng dồn incMoney
      existing.incMoney += current.incMoney;
    } else {
      // Nếu không tồn tại, thêm mục mới vào acc
      acc.push({ ...current._doc });
    }

    return acc;
  }, []);
  const reducedTKData = aTKIncomeData.reduce((acc, current) => {
    // Tìm mục đã tồn tại trong acc có cùng inlstCode và inLstContent
    const existing = acc.find(
      (item) => item.inlstCode === current.inlstCode && item.inLstContent === current.inLstContent
    );

    if (existing) {
      // Nếu tồn tại, cộng dồn incMoney
      existing.incMoney += current.incMoney;
    } else {
      // Nếu không tồn tại, thêm mục mới vào acc
      acc.push({ ...current._doc });
    }

    return acc;
  }, []);
  const reducedDTData = aDTIncomeData.reduce((acc, current) => {
    // Tìm mục đã tồn tại trong acc có cùng inlstCode và inLstContent
    const existing = acc.find(
      (item) => item.inlstCode === current.inlstCode && item.inLstContent === current.inLstContent
    );

    if (existing) {
      // Nếu tồn tại, cộng dồn incMoney
      existing.incMoney += current.incMoney;
    } else {
      // Nếu không tồn tại, thêm mục mới vào acc
      acc.push({ ...current._doc });
    }

    return acc;
  }, []);

  res.json({ reducedSOData, reducedTDData, reducedTKData, reducedDTData });
});

// create data router
router.post("/", auth, async (req, res) => {
  try {
    const { inlstCode, inLstContent, incDate, incDetail, incMoney } = req.body;
    const oCreateData = {
      inlstCode,
      inLstContent,
      incDate,
      incDetail,
      incMoney,
    };
    const sNotice = await commonUtil.createDataCase(req, res, oCreateData, Income, "bảng thu nhập");
    // update wallet of User
    const SNoticeUser = await commonUtil.UpdateUserWalletNew(
      req,
      res,
      req.body.inlstCode,
      parseInt(req.body.incMoney),
      User
    );

    res.json(`${sNotice} và ${SNoticeUser}`);
  } catch (error) {
    res.status(500).send();
  }
});

// update data router
router.put("/:id", auth, async (req, res) => {
  try {
    const { inlstCode, inLstContent, incDate, incDetail, incMoney } = req.body;
    const oUpdateData = { inlstCode, inLstContent, incDate, incDetail, incMoney };
    const sIncomeId = req.params.id;
    const sUpdateEntuty = await commonUtil.updateDataCase(
      req,
      res,
      oUpdateData,
      Income,
      sIncomeId,
      "bảng thu nhập"
    );
    const sUpdateWalletUser = await commonUtil.UpdateUserWalletUpdate(
      req,
      res,
      req.body.inlstCode,
      parseInt(req.body.incDMoney),
      User
    );
    res.json(`${sUpdateEntuty} và ${sUpdateWalletUser}`);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id/", auth, async (req, res) => {
  try {
    const sIncomeId = req.params.id;
    const data = req.body;
    await commonUtil.deleteDataCase(req, res, Income, sIncomeId, "bảng thu nhập");
    await commonUtil.UpdateWalletUser(req, "inlstCode", "incMoney", data, User);
    res.json("Đã xóa thu nhập và cập nhập Ví của bạn");
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
