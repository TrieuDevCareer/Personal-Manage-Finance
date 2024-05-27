const router = require("express").Router();
const Saving = require("../models/savingModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, Saving);
});

// get Saving Data report list
router.post("/reportsaving", auth, async (req, res) => {
  const { date, month, bank, status } = req.body;
  const aSavingData = await Saving.find({ user: req.user });

  // Hàm để kiểm tra điều kiện
  const matches = (item, field, values, transform = (v) => v) => {
    return !values || values.length === 0 || values.includes(transform(item[field]));
  };

  // Hàm để lọc dữ liệu
  const filterData = (item) => {
    return (
      matches(item, "savDate", date, (d) => d.getDate().toString()) &&
      matches(item, "savDate", month, (d) => (d.getMonth() + 1).toString()) &&
      matches(item, "bnkName", bank) &&
      (!status ||
        status.length === 0 ||
        status.some((keyword) =>
          keyword.includes(item.savStatus ? "Đã rút tiết kiệm" : "Đang gửi tiết kiệm")
        ))
    );
  };

  const filteredData = aSavingData.filter(filterData);
  const filterPieChartData = aSavingData.filter((i) => i.savStatus === false);

  // Tách dữ liệu theo bnkLstID
  let dataByCode = {};
  let dataByPie = {};

  filteredData.forEach((item) => {
    if (dataByCode[item.bnkName]) {
      dataByCode[item.bnkName].push(item);
    } else {
      Object.assign(dataByCode, {
        [`${item.bnkName}`]: [item],
      });
    }
  });
  filterPieChartData.forEach((item) => {
    if (dataByPie[item.bnkName]) {
      dataByPie[item.bnkName].push(item);
    } else {
      Object.assign(dataByPie, {
        [`${item.bnkName}`]: [item],
      });
    }
  });

  // Hàm để giảm dữ liệu
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
    { name: "Số tiền tiết kiệm" },
    { name: "Thực nhận" },
    { name: "Số tiền sau rút" },
    { name: "Lãi dự kiến" },
    { name: "Lãi/lỗ sau rút" },
    { ...initialData },
  ];

  for (const [key, value] of Object.entries(reducedData)) {
    resultData[1][key] = value.savMoney;
    resultData[2][key] = value.savTotalMoney;
    resultData[3][key] = value.savTRealMoney;
    resultData[4][key] = value.savInteretMoney;
    resultData[5][key] = value.savRealInterMoney;
  }

  let pieResultData = [];
  const rendercolor = ["#8884d8", "#ffc658", "#ff007f", "#82ca9d"];
  let i = 1;
  for (const [key, value] of Object.entries(reducedData)) {
    pieResultData.push({
      label: key,
      value: value.savMoney,
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
    const oCreateData = {
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
    const sNotice = await commonUtil.createDataCase(
      req,
      res,
      oCreateData,
      Saving,
      "Bảng tiết kiệm"
    );
    const SNoticeUser = await commonUtil.UpdateUserWalletNew(
      req,
      res,
      "TK",
      0 - parseInt(req.body.savMoney),
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
    const oUpdateData = {
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
    const sBankId = req.params.id;
    const sUpdateEntuty = await commonUtil.updateDataCase(
      req,
      res,
      oUpdateData,
      Saving,
      sBankId,
      "Bảng tiết kiệm"
    );
    const sUpdateWalletUser = await commonUtil.UpdateUserWalletUpdate(
      req,
      res,
      "TK",
      savStatus === true ? parseInt(req.body.savTRealMoney) : 0 - parseInt(req.body.savDMoney),
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
    const oBankId = req.params.id;
    const data = req.body;
    await commonUtil.deleteDataCase(req, res, Saving, oBankId, "Bảng tiết kiệm");
    await commonUtil.UpdateWalletUser(req, "bnkLstID", "savMoney", data, User);
    res.json("Đã xóa thu nhập và cập nhập Ví của bạn");
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
