const router = require("express").Router();
const Expense = require("../models/expenseModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, Expense);
});

// create data router
router.post("/", auth, async (req, res) => {
  try {
    const { dicLstCode, dicLstContent, expDate, expDetail, expMoney } = req.body;
    const oCreateData = {
      dicLstCode,
      dicLstContent,
      expDate,
      expDetail,
      expMoney,
    };
    await commonUtil.createDataCase(req, res, oCreateData, Expense, "bảng chi tiêu");
  } catch (error) {
    res.status(500).send();
  }
});

// update data router
router.put("/:id", auth, async (req, res) => {
  try {
    const { dicLstCode, dicLstContent, expDate, expDetail, expMoney } = req.body;
    const oUpdateData = { dicLstCode, dicLstContent, expDate, expDetail, expMoney };
    const sExpenseId = req.params.id;
    await commonUtil.updateDataCase(req, res, oUpdateData, Expense, sExpenseId, "bảng chi tiêu");
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id", auth, async (req, res) => {
  try {
    const sExpenseId = req.params.id;
    await commonUtil.deleteDataCase(req, res, Expense, sExpenseId, "bảng chi tiêu");
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
