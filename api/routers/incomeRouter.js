const router = require("express").Router();
const Income = require("../models/incomeModel");
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
    await commonUtil.createDataCase(req, res, oCreateData, Income, "bảng thu nhập");
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
    await commonUtil.updateDataCase(req, res, oUpdateData, Income, sIncomeId, "bảng thu nhập");
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id", auth, async (req, res) => {
  try {
    const sIncomeId = req.params.id;
    await commonUtil.deleteDataCase(req, res, Income, sIncomeId, "bảng thu nhập");
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
