const router = require("express").Router();
const Income = require("../models/incomeModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, Income);
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
    const SNoticeUser = await commonUtil.UpdateUserWalletNew(req, res, User);
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
    const sUpdateWalletUser = await commonUtil.UpdateUserWalletUpdate(req, res, User);
    res.json(`${sUpdateEntuty} và ${sUpdateWalletUser}`);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id", auth, async (req, res) => {
  try {
    const sIncomeId = req.params.id;
    const sUpdateWalletUser = await commonUtil.UpdateUserWalletDelete(req, res, Income, User);
    const sDeleteCurrentData = await commonUtil.deleteDataCase(
      req,
      res,
      Income,
      sIncomeId,
      "bảng thu nhập"
    );
    res.json(`${sUpdateWalletUser} và ${sDeleteCurrentData}`);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
