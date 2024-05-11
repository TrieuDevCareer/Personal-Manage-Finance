const router = require("express").Router();
const ExpenseList = require("../models/expenseListModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, ExpenseList);
});

// create data router
router.post("/", auth, async (req, res) => {
  try {
    const { exelstCode, exeLstContent } = req.body;
    const oCreateData = { exelstCode, exeLstContent };
    await commonUtil.createDataCase(req, res, oCreateData, ExpenseList, "danh mục tiêu dùng");
  } catch (error) {
    res.status(500).send();
  }
});

// update data router
router.put("/:id", auth, async (req, res) => {
  try {
    const { exelstCode, exeLstContent } = req.body;
    const oUpdateData = { exelstCode, exeLstContent };
    const oExeId = req.params.id;
    await commonUtil.updateDataCase(
      req,
      res,
      oUpdateData,
      ExpenseList,
      oExeId,
      "danh mục tiêu dùng"
    );
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id", auth, async (req, res) => {
  try {
    const oExeId = req.params.id;
    await commonUtil.deleteDataCase(req, res, ExpenseList, oExeId, "danh mục tiêu dùng");
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
