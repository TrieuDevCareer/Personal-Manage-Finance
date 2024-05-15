const router = require("express").Router();
const Invesment = require("../models/investmentModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, Invesment);
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
