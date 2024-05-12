const router = require("express").Router();
const CoinList = require("../models/coinListModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  try {
    await commonUtil.getAllResult(req, res, CoinList);
  } catch (error) {
    res.status(500).send();
  }
});

// create data router
router.post("/", auth, async (req, res) => {
  try {
    const { coinLstID, coinName } = req.body;
    const oCreateData = { coinLstID, coinName };
    await commonUtil.createDataCase(req, res, oCreateData, CoinList, "đồng coin");
  } catch (error) {
    res.status(500).send();
  }
});

// update data router
router.put("/:id", auth, async (req, res) => {
  try {
    const { coinLstID, coinName } = req.body;
    const oUpdateData = { coinLstID, coinName };
    const sCoinId = req.params.id;
    await commonUtil.updateDataCase(req, res, oUpdateData, CoinList, sCoinId, "đồng coin");
  } catch (error) {
    res.status(500).json({ error });
  }
});
// delete data router

router.delete("/:id", auth, async (req, res) => {
  try {
    const oCoinId = req.params.id;
    await commonUtil.deleteDataCase(req, res, CoinList, oCoinId, "danh mục tổng hợp");
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
