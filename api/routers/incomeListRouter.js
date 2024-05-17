const router = require("express").Router();
const IncomeList = require("../models/incomeListModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, IncomeList);
});

// get content by capital
router.post("/content", auth, async (req, res) => {
  let { data } = req.body;
  data = data[0] === "All" ? ["SO", "TK", "DT", "TD"] : data;
  const aResultData = await IncomeList.find({ user: req.user, inlstCode: { $in: data } });

  res.json(aResultData);
});

// create data router
router.post("/", auth, async (req, res) => {
  try {
    const { inlstCode, inLstContent } = req.body;
    const oCreateData = { inlstCode, inLstContent };
    await commonUtil.createDataCase(req, res, oCreateData, IncomeList, "danh mục thu nhập");
  } catch (error) {
    res.status(500).send();
  }
});

// update data router
router.put("/:id", auth, async (req, res) => {
  try {
    const { inlstCode, inLstContent } = req.body;
    const oUpdateData = { inlstCode, inLstContent };
    const oIncId = req.params.id;
    await commonUtil.updateDataCase(req, res, oUpdateData, IncomeList, oIncId, "danh mục thu nhập");
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id", auth, async (req, res) => {
  try {
    const oIncId = req.params.id;
    await commonUtil.deleteDataCase(req, res, IncomeList, oIncId, "danh mục thu nhập");
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
