const router = require("express").Router();
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, Expense);
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
