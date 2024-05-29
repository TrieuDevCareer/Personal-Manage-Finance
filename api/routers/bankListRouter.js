const router = require("express").Router();
const BankList = require("../models/bankListModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, BankList);
});

// create data router
router.post("/", auth, async (req, res) => {
  try {
    const { bnkLstID, bnkName } = req.body;
    const oCreateData = { bnkLstID, bnkName };
    const result = await commonUtil.createDataCase(req, res, oCreateData, BankList, "Ngân hàng");
    result.status === 200
      ? res.json(result.message)
      : res.status(400).json({
          errorMessage: result.message,
        });
  } catch (error) {
    res.status(500).send(error);
  }
});

// update data router
router.put("/:id", auth, async (req, res) => {
  try {
    const { bnkLstID, bnkName } = req.body;
    const oUpdateData = { bnkLstID, bnkName };
    const sBankId = req.params.id;
    const result = await commonUtil.updateDataCase(
      req,
      res,
      oUpdateData,
      BankList,
      sBankId,
      "ngân hàng"
    );
    result.status === 200
      ? res.json(result.message)
      : res.status(400).json({
          errorMessage: result.message,
        });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id", auth, async (req, res) => {
  try {
    const oBankId = req.params.id;
    const result = await commonUtil.deleteDataCase(req, res, BankList, oBankId, "ngân hàng");
    result.status === 200
      ? res.json(result.message)
      : res.status(400).json({
          errorMessage: result.message,
        });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
