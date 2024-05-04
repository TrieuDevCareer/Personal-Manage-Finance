const router = require("express").Router();
const Saving = require("../models/savingModel");
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
    await commonUtil.createDataCase(req, res, oCreateData, Saving, "Bảng tiết kiệm");
  } catch (error) {
    res.status(500).send();
  }
});

// update data router
router.put("/:id", auth, async (req, res) => {
  try {
    const { bnkLstID, bnkName } = req.body;
    const oUpdateData = { bnkLstID, bnkName };
    const sBankId = req.params.id;
    await commonUtil.updateDataCase(req, res, oUpdateData, Saving, sBankId, "Bảng tiết kiệm");
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id", auth, async (req, res) => {
  try {
    const oBankId = req.params.id;
    await commonUtil.deleteDataCase(req, res, Saving, oBankId, "Bảng tiết kiệm");
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
