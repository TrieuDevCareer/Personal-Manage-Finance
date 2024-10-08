const router = require("express").Router();
const Income = require("../models/incomeModel");
const Expense = require("../models/expenseModel");
const Saving = require("../models/savingModel");
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
  const aSavingData = await Saving.find({ user: req.user, savStatus: false });
  const aInvestData = await Saving.find({ user: req.user, investStatus: false });
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
  res.json(resultData);
});

// get Income Data report list
router.post("/reportincome", auth, async (req, res) => {
  const { date, month, capitalSource, contentData } = req.body;
  const aIncomeData = await Income.find({ user: req.user });

  // Hàm để kiểm tra điều kiện
  const matches = (item, field, values, transform = (v) => v) => {
    return !values || values.length === 0 || values.includes(transform(item[field]));
  };

  // Hàm để lọc dữ liệu
  const filterData = (item) => {
    return (
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

  const filteredData = aIncomeData.filter(filterData);

  // Tách dữ liệu theo inlstCode
  const dataByCode = {
    SO: [],
    TD: [],
    DT: [],
    TK: [],
  };

  filteredData.forEach((item) => {
    if (dataByCode[item.inlstCode]) {
      dataByCode[item.inlstCode].push(item);
    }
  });

  // Hàm để giảm dữ liệu
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

  const reducedData = {
    SO: reduceData(dataByCode.SO),
    TD: reduceData(dataByCode.TD),
    DT: reduceData(dataByCode.DT),
    TK: reduceData(dataByCode.TK),
  };

  const maxLengthArr = Math.max(
    reducedData.SO.length,
    reducedData.TD.length,
    reducedData.TK.length,
    reducedData.DT.length
  );

  let resultData = new Array(maxLengthArr).fill().map((_, i) => ({
    name: i + 1,
    [`Nguồn sống`]: reducedData.SO[i]?.incMoney || 0,
    [`Tiết kiệm`]: reducedData.TK[i]?.incMoney || 0,
    [`Đầu tư`]: reducedData.DT[i]?.incMoney || 0,
    [`Tự do`]: reducedData.TD[i]?.incMoney || 0,
    [`SOContent`]: reducedData.SO[i]?.inLstContent || "",
    [`TKContent`]: reducedData.TK[i]?.inLstContent || "",
    [`DTContent`]: reducedData.DT[i]?.inLstContent || "",
    [`TDContent`]: reducedData.TD[i]?.inLstContent || "",
  }));
  res.json({ resultData });
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
    if (SNoticeUser.status === 200 && sNotice.status === 200) {
      res.json(`${sNotice.message} và ${SNoticeUser.message}`);
    } else {
      if (sNotice.status !== 200 && SNoticeUser.status === 200)
        res.status(400).json({
          errorMessage: sNotice.message,
        });
      else
        res.status(400).json({
          errorMessage: "Hãy liên hệ nhà phát triễn ứng để xử lý",
        });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// update data router
router.put("/:id", auth, async (req, res) => {
  try {
    const { inlstCode, inLstContent, incDate, incDetail, incMoney } = req.body;
    const oUpdateData = { inlstCode, inLstContent, incDate, incDetail, incMoney };
    const sIncomeId = req.params.id;
    const sUpdateEntity = await commonUtil.updateDataCase(
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
    if (sUpdateEntity.status === 200 && sUpdateWalletUser.status === 200) {
      res.json(`${sUpdateEntity.message} và ${sUpdateWalletUser.message}`);
    } else {
      if (sUpdateEntity.status !== 200 && sUpdateWalletUser.status === 200)
        res.status(400).json({
          errorMessage: sUpdateEntity.message,
        });
      else
        res.status(400).json({
          errorMessage: "Hãy liên hệ nhà phát triễn ứng để xử lý",
        });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id/", auth, async (req, res) => {
  try {
    const sIncomeId = req.params.id;
    const data = req.body;
    const result = await commonUtil.deleteDataCase(req, res, Income, sIncomeId, "bảng thu nhập");
    const minusAmountMoney = await commonUtil.UpdateWalletUser(
      req,
      "inlstCode",
      "incMoney",
      data,
      User
    );
    if (result.status === 200 && minusAmountMoney.status === 200) {
      res.json("Đã xóa thu nhập và cập nhập Ví của bạn");
    } else {
      if (result.status !== 200 && minusAmountMoney.status === 200)
        res.status(400).json({
          errorMessage: result.message,
        });
      else
        res.status(400).json({
          errorMessage: "Hãy liên hệ nhà phát triễn ứng để xử lý",
        });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
