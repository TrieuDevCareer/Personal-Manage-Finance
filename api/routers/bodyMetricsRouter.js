const router = require("express").Router();
const BodyMetrics = require("../models/bodyMetricsModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// Routes
/**
 * Get all income categories
 */
router.get("/", auth, async (req, res) => {
  try {
    await commonUtil.getAllData(req, res, BodyMetrics);
  } catch (error) {
    res.status(500).json({
      errorMessage: "Lỗi khi lấy danh sách chỉ số cơ thể",
      error: error.message,
    });
  }
});

/**
 * Create new income category
 */
router.post("/", auth, async (req, res) => {
  try {
    const { bf, vfa, lbm, smm, tbw, bmr, tdee, ffmi, whr, whtr, weight, height, age, gender, waist, hip, neck, arm, thigh } = req.body;

    const createData = { bf, vfa, lbm, smm, tbw, bmr, tdee, ffmi, whr, whtr, weight, height, age, gender, waist, hip, neck, arm, thigh };
    const result = await commonUtil.createData(
      req,
      res,
      createData,
      BodyMetrics,
      "Danh mục Chỉ số cơ thể"
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
      errorMessage: "Lỗi khi tạo dữ liệu chỉ số cơ thể",
      error: error.message,
    });
  }
});

/**
 * Update an income category
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { bf, vfa, lbm, smm, tbw, bmr, tdee, ffmi, whr, whtr, weight, height, age, gender, waist, hip, neck, arm, thigh } = req.body;
    const inbodyId = req.params.id;

    // Check if income category exists
    const existingCategory = await BodyMetrics.findOne({
      _id: inbodyId,
      user: req.user,
    });

    if (!existingCategory) {
      return res.status(404).json({
        errorMessage: "Không tìm thấy Chỉ số cần cập nhật",
      });
    }

    const updateData = { bf, vfa, lbm, smm, tbw, bmr, tdee, ffmi, whr, whtr, weight, height, age, gender, waist, hip, neck, arm, thigh };
    const result = await commonUtil.updateData(
      req,
      res,
      updateData,
      BodyMetrics,
      inbodyId,
      "Danh mục Chỉ số cơ thể"
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
    const inbodyId = req.params.id;

    // Check if income category exists
    const existingCategory = await BodyMetrics.findOne({
      _id: inbodyId,
      user: req.user,
    });

    if (!existingCategory) {
      return res.status(404).json({
        errorMessage: "Không tìm thấy Chỉ số cần xóa",
      });
    }

    const result = await commonUtil.deleteData(
      req,
      res,
      BodyMetrics,
      inbodyId,
      "Danh mục Chỉ số cơ thể"
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
      errorMessage: "Lỗi khi xóa Chỉ số cần xóa",
      error: error.message,
    });
  }
});

module.exports = router;
