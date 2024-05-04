const router = require("express").Router();
const Invesment = require("../models/investmentModel");
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
    await commonUtil.createDataCase(req, res, oCreateData, Invesment, "bảng đầu tư");
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
    await commonUtil.updateDataCase(req, res, oUpdateData, Invesment, sExpenseId, "bảng đầu tư");
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id", auth, async (req, res) => {
  try {
    const sExpenseId = req.params.id;
    await commonUtil.deleteDataCase(req, res, Invesment, sExpenseId, "bảng đầu tư");
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
