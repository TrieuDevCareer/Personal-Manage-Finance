const router = require("express").Router();
const DistionaryList = require("../models/dictionaryListModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// get data router
router.get("/", auth, async (req, res) => {
  await commonUtil.getAllResult(req, res, DistionaryList);
});

// create data router
router.post("/", auth, async (req, res) => {
  try {
    const { dicLstCode, dicLstContent } = req.body;
    const oCreateData = { dicLstCode, dicLstContent };
    await commonUtil.createDataCase(
      req,
      res,
      oCreateData,
      DistionaryList,
      "danh mục tổng hợp"
    );
  } catch (error) {
    res.status(500).send();
  }
});

// update data router
router.put("/:id", auth, async (req, res) => {
  try {
    const { dicLstCode, dicLstContent } = req.body;
    const oUpdateData = { dicLstCode, dicLstContent };
    const sDicId = req.params.id;
    await commonUtil.updateDataCase(
      req,
      res,
      oUpdateData,
      DistionaryList,
      sDicId,
      "danh mục tổng hợp"
    );
  } catch (error) {
    res.status(500).json({ error });
  }
});

// delete data router
router.delete("/:id", auth, async (req, res) => {
  try {
    const oDicId = req.params.id;
    await commonUtil.deleteDataCase(
      req,
      res,
      DistionaryList,
      oDicId,
      "danh mục tổng hợp"
    );
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
