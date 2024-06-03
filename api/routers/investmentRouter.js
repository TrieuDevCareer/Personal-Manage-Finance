const router = require("express").Router();
const Invesment = require("../models/investmentModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, Invesment);
});

// get Invest report total data
router.get("/reporttotaldata", auth, async (req, res) => {
  try {
    let resultData = {
      investmentAmount: 0,
      nonInvestAmount: 0,
      profitAmount: 0,
    };
    const aInvestData = await Invesment.find({ user: req.user, investStatus: false });
    const oUserLogin = await User.findById(req.user);
    aInvestData.forEach((item) => {
      resultData.investmentAmount += item.investMoney;
      resultData.profitAmount += item.investResult;
    });
    resultData.investmentAmount += oUserLogin.walletInvest;
    resultData.nonInvestAmount += oUserLogin.walletInvest;
    res.json(
      (resultData = {
        investmentAmount: resultData.investmentAmount.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        }),
        nonInvestAmount: resultData.nonInvestAmount.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        }),
        profitAmount: resultData.profitAmount.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        }),
      })
    );
  } catch (error) {
    res.status(500).json({ error });
  }
});

// get Invest Data report list
router.post("/reportinvest", auth, async (req, res) => {
  const { date, month, coin, status } = req.body;
  const aInvestData = await Invesment.find({ user: req.user });

  // Hàm để kiểm tra điều kiện
  const matches = (item, field, values, transform = (v) => v) => {
    return !values || values.length === 0 || values.includes(transform(item[field]));
  };

  // Hàm để lọc dữ liệu
  const filterData = (item) => {
    return (
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

  const filteredData = aInvestData.filter(filterData);
  const filterPieChartData = aInvestData.filter((i) => i.investStatus === false);

  // Tách dữ liệu theo coinLstID
  let dataByCode = {};
  let dataByPie = {};

  filteredData.forEach((item) => {
    if (dataByCode[item.coinName]) {
      dataByCode[item.coinName].push(item);
    } else {
      Object.assign(dataByCode, {
        [`${item.coinName}`]: [item],
      });
    }
  });
  filterPieChartData.forEach((item) => {
    if (dataByPie[item.coinName]) {
      dataByPie[item.coinName].push(item);
    } else {
      Object.assign(dataByPie, {
        [`${item.coinName}`]: [item],
      });
    }
  });

  // Hàm để giảm dữ liệu
  const reduceData = (data) => {
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

  const reducedData = {};
  const reducedPieData = {};

  for (const [key] of Object.entries(dataByCode)) {
    Object.assign(reducedData, {
      [key]: reduceData(dataByCode[key])[0],
    });
  }
  for (const [key] of Object.entries(dataByPie)) {
    Object.assign(reducedPieData, {
      [key]: reduceData(dataByPie[key])[0],
    });
  }
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

  for (const [key, value] of Object.entries(reducedData)) {
    resultData[1][key] = value.investMoney;
    resultData[2][key] = value.investReMoney;
    resultData[3][key] = value.investResult;
    resultData[4][key] = value.investNumCoin;
  }

  let pieResultData = [];
  const rendercolor = ["#8884d8", "#ffc658", "#ff007f", "#82ca9d"];
  let i = 1;
  for (const [key, value] of Object.entries(reducedData)) {
    pieResultData.push({
      label: key,
      value: value.investMoney,
      color: `${rendercolor[(i + 1) % rendercolor.length]}`,
    });
    i++;
  }

  res.json({ resultData, pieResultData });
});

// create data router
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
    const sNotice = await commonUtil.createDataCase(
      req,
      res,
      oCreateData,
      Invesment,
      "bảng đầu tư"
    );
    const SNoticeUser = await commonUtil.UpdateUserWalletNew(
      req,
      res,
      "DT",
      0 - parseInt(req.body.investMoney),
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
    const sExpenseId = req.params.id;
    const sUpdateEntity = await commonUtil.updateDataCase(
      req,
      res,
      oUpdateData,
      Invesment,
      sExpenseId,
      "bảng đầu tư"
    );
    const sUpdateWalletUser = await commonUtil.UpdateUserWalletUpdate(
      req,
      res,
      "DT",
      investStatus === true
        ? parseInt(req.body.investReMoney)
        : 0 - parseInt(req.body.investDMoney),
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
router.delete("/:id", auth, async (req, res) => {
  try {
    const sExpenseId = req.params.id;
    const data = req.body;
    const result = await commonUtil.deleteDataCase(req, res, Invesment, sExpenseId, "bảng đầu tư");
    const minusAmountMoney = await commonUtil.UpdateWalletUser(
      req,
      "coinLstID",
      "investMoney",
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
