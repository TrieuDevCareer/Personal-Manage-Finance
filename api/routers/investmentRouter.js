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
    res.json(`${sNotice} và ${SNoticeUser}`);
  } catch (error) {
    res.status(500).send();
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
    const sUpdateWalletUser = await commonUtil.updateDataCase(
      req,
      res,
      oUpdateData,
      Invesment,
      sExpenseId,
      "bảng đầu tư"
    );
    const sUpdateEntity = await commonUtil.UpdateUserWalletUpdate(
      req,
      res,
      "DT",
      investStatus === true
        ? parseInt(req.body.investReMoney)
        : 0 - parseInt(req.body.investDMoney),
      User
    );

    res.json(`${sUpdateEntity} và ${sUpdateWalletUser}`);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id", auth, async (req, res) => {
  try {
    const sExpenseId = req.params.id;
    const data = req.body;
    await commonUtil.deleteDataCase(req, res, Invesment, sExpenseId, "bảng đầu tư");
    await commonUtil.UpdateWalletUser(req, "coinLstID", "investMoney", data, User);
    res.json("Đã xóa thu nhập và cập nhập Ví của bạn");
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
