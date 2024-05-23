const router = require("express").Router();
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, Expense);
});

// get Expense Data report list
router.post("/reportexpense", auth, async (req, res) => {
  const { date, month, capitalSource, contentData } = req.body;
  const aExpenseData = await Expense.find({ user: req.user });

  // Hàm để kiểm tra điều kiện
  const matches = (item, field, values, transform = (v) => v) => {
    return !values || values.length === 0 || values.includes(transform(item[field]));
  };

  // Hàm để lọc dữ liệu
  const filterData = (item) => {
    return (
      matches(item, "expDate", date, (d) => d.getDate().toString()) &&
      matches(item, "expDate", month, (d) => (d.getMonth() + 1).toString()) &&
      matches(item, "exelstCode", capitalSource) &&
      (!contentData ||
        contentData.length === 0 ||
        contentData.some(
          (keyword) => keyword.includes(item.exelstCode) && keyword.includes(item.exeLstContent)
        ))
    );
  };

  const filteredData = aExpenseData.filter(filterData);

  // Tách dữ liệu theo exelstCode
  const dataByCode = {
    SO: [],
    TD: [],
  };

  filteredData.forEach((item) => {
    if (dataByCode[item.exelstCode]) {
      dataByCode[item.exelstCode].push(item);
    }
  });

  // Hàm để giảm dữ liệu
  const reduceData = (data) => {
    return data.reduce((acc, current) => {
      const existing = acc.find(
        (item) =>
          item.exelstCode === current.exelstCode && item.exeLstContent === current.exeLstContent
      );

      if (existing) {
        existing.expMoney += current.expMoney;
      } else {
        acc.push({ ...current._doc });
      }

      return acc;
    }, []);
  };

  const reducedData = {
    SO: reduceData(dataByCode.SO),
    TD: reduceData(dataByCode.TD),
  };

  const maxLengthArr = Math.max(reducedData.SO.length, reducedData.TD.length);

  let resultData = new Array(maxLengthArr).fill().map((_, i) => ({
    name: i + 1,
    [`Nguồn sống`]: reducedData.SO[i]?.expMoney || 0,
    [`Tự do`]: reducedData.TD[i]?.expMoney || 0,
    [`SOContent`]: reducedData.SO[i]?.exeLstContent || "",
    [`TDContent`]: reducedData.TD[i]?.exeLstContent || "",
  }));
  let percentData = [];
  const colorBackground = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#0ecb74",
    "#ff007f",
    "#FDDE55",
  ];
  percentData.push(...reducedData.SO);
  percentData.push(...reducedData.TD);
  let pieChartData = [];
  percentData.forEach((item, i) => {
    item.label = item.exelstCode + "-" + item.exeLstContent;
    item.value = item.expMoney;
    item.color = colorBackground[(i + 1) % colorBackground.length];
    pieChartData.push({
      label: item.label,
      value: item.value,
      color: item.color,
    });
  });
  res.json({ resultData, pieChartData });
});
// create data router
router.post("/", auth, async (req, res) => {
  try {
    const { exelstCode, exeLstContent, expDate, expDetail, expMoney } = req.body;
    const oCreateData = {
      exelstCode,
      exeLstContent,
      expDate,
      expDetail,
      expMoney,
    };
    const sNotice = await commonUtil.createDataCase(
      req,
      res,
      oCreateData,
      Expense,
      "bảng chi tiêu"
    );
    // update wallet of User
    const SNoticeUser = await commonUtil.UpdateUserWalletNew(
      req,
      res,
      req.body.exelstCode,
      0 - parseInt(req.body.expMoney),
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
    const { exelstCode, exeLstContent, expDate, expDetail, expMoney } = req.body;
    const oUpdateData = { exelstCode, exeLstContent, expDate, expDetail, expMoney };
    const sExpenseId = req.params.id;
    const sUpdateEntuty = await commonUtil.updateDataCase(
      req,
      res,
      oUpdateData,
      Expense,
      sExpenseId,
      "bảng chi tiêu"
    );
    const sUpdateWalletUser = await commonUtil.UpdateUserWalletUpdate(
      req,
      res,
      req.body.exelstCode,
      0 - parseInt(req.body.expDMoney),
      User
    );
    res.json(`${sUpdateEntuty} và ${sUpdateWalletUser}`);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id", auth, async (req, res) => {
  try {
    const sExpenseId = req.params.id;
    const data = req.body;
    await commonUtil.deleteDataCase(req, res, Expense, sExpenseId, "bảng chi tiêu");
    await commonUtil.UpdateWalletUser(req, "exelstCode", "expMoney", data, User);
    res.json("Đã xóa thu nhập và cập nhập Ví của bạn");
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
