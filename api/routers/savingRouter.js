const router = require("express").Router();
const Saving = require("../models/savingModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, Saving);
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
