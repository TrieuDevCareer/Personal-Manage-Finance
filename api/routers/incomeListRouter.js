const router = require("express").Router();
const IncomeList = require("../models/incomeListModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// Constants
const INCOME_TYPES = {
  LIVING: "SO", // Nguồn sống
  SAVINGS: "TK", // Tiết kiệm
  INVESTMENT: "DT", // Đầu tư
  FREE: "TD", // Tự do
};

const ALL_INCOME_TYPES = Object.values(INCOME_TYPES);

// Routes
/**
 * Get all income categories
 */
router.get("/", auth, async (req, res) => {
  try {
    await commonUtil.getAllData(req, res, IncomeList);
  } catch (error) {
    res.status(500).json({
      errorMessage: "Lỗi khi lấy danh sách thu nhập",
      error: error.message,
    });
  }
});

/**
 * Get income categories filtered by income type
 */
router.post("/content", auth, async (req, res) => {
  try {
    let { data } = req.body;

    // If "All" is selected, include all income types
    const incomeTypes = data[0] === "All" ? ALL_INCOME_TYPES : data;

    const incomeCategories = await IncomeList.find({
      user: req.user,
      inlstCode: { $in: incomeTypes },
    });

    res.json(incomeCategories);
  } catch (error) {
    res.status(500).json({
      errorMessage: "Lỗi khi lấy danh mục thu nhập theo loại",
      error: error.message,
    });
  }
});

/**
 * Create new income category
 */
router.post("/", auth, async (req, res) => {
  try {
    const { inlstCode, inLstContent } = req.body;

    // Validate input
    if (!inlstCode || !inLstContent) {
      return res.status(400).json({
        errorMessage: "Mã loại thu nhập và nội dung là bắt buộc",
      });
    }

    // Check if income type is valid
    if (!ALL_INCOME_TYPES.includes(inlstCode)) {
      return res.status(400).json({
        errorMessage: `Mã loại thu nhập không hợp lệ. Các giá trị hợp lệ: ${ALL_INCOME_TYPES.join(
          ", "
        )}`,
      });
    }

    const createData = { inlstCode, inLstContent };
    const result = await commonUtil.createData(
      req,
      res,
      createData,
      IncomeList,
      "Danh mục thu nhập"
    );

    if (result.status === 200) {
      return res.json(result.message);
    } else {
      return res.status(400).json({
        errorMessage: result.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Lỗi khi tạo danh mục thu nhập",
      error: error.message,
    });
  }
});

/**
 * Update an income category
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { inlstCode, inLstContent } = req.body;
    const incomeId = req.params.id;

    // Validate input
    if (!inlstCode || !inLstContent) {
      return res.status(400).json({
        errorMessage: "Mã loại thu nhập và nội dung là bắt buộc",
      });
    }

    // Check if income type is valid
    if (!ALL_INCOME_TYPES.includes(inlstCode)) {
      return res.status(400).json({
        errorMessage: `Mã loại thu nhập không hợp lệ. Các giá trị hợp lệ: ${ALL_INCOME_TYPES.join(
          ", "
        )}`,
      });
    }

    // Check if income category exists
    const existingCategory = await IncomeList.findOne({
      _id: incomeId,
      user: req.user,
    });

    if (!existingCategory) {
      return res.status(404).json({
        errorMessage: "Không tìm thấy danh mục thu nhập",
      });
    }

    const updateData = { inlstCode, inLstContent };
    const result = await commonUtil.updateData(
      req,
      res,
      updateData,
      IncomeList,
      incomeId,
      "Danh mục thu nhập"
    );

    if (result.status === 200) {
      return res.json(result.message);
    } else {
      return res.status(400).json({
        errorMessage: result.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Lỗi khi cập nhật danh mục thu nhập",
      error: error.message,
    });
  }
});

/**
 * Delete an income category
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const incomeId = req.params.id;

    // Check if income category exists
    const existingCategory = await IncomeList.findOne({
      _id: incomeId,
      user: req.user,
    });

    if (!existingCategory) {
      return res.status(404).json({
        errorMessage: "Không tìm thấy danh mục thu nhập",
      });
    }

    const result = await commonUtil.deleteData(req, res, IncomeList, incomeId, "Danh mục thu nhập");

    if (result.status === 200) {
      return res.json(result.message);
    } else {
      return res.status(400).json({
        errorMessage: result.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Lỗi khi xóa danh mục thu nhập",
      error: error.message,
    });
  }
});

module.exports = router;
