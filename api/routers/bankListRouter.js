const router = require("express").Router();
const BankList = require("../models/bankListModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

/**
 * Error response helper function
 * @param {object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 */
const sendResponse = (res, status, message) => {
  if (status === 200) {
    return res.status(status).json(message);
  }
  return res.status(status).json({
    errorMessage: message,
  });
};

/**
 * Route handlers
 */
// Get all banks
router.get("/", auth, async (req, res) => {
  try {
    await commonUtil.getAllData(req, res, BankList);
  } catch (error) {
    sendResponse(res, 500, `Lỗi truy xuất dữ liệu danh sách Ngân hàng: ${error.message}`);
  }
});

// Create new bank
router.post("/", auth, async (req, res) => {
  try {
    const { bnkLstID, bnkName } = req.body;

    // Validate required fields
    if (!bnkLstID || !bnkName) {
      return sendResponse(res, 400, "ID Ngân hàng và tên Ngân hàng là bắt buộc");
    }

    const bankData = { bnkLstID, bnkName };
    const result = await commonUtil.createData(req, res, bankData, BankList, "Ngân hàng");

    sendResponse(res, result.status, result.message);
  } catch (error) {
    sendResponse(res, 500, `Lỗi khi tạo dữ liệu Ngân hàng: ${error.message}`);
  }
});

// Update bank
router.put("/:id", auth, async (req, res) => {
  try {
    const { bnkLstID, bnkName } = req.body;
    const bankId = req.params.id;

    // Validate required fields
    if (!bnkLstID || !bnkName) {
      return sendResponse(res, 400, "ID Ngân hàng và tên Ngân hàng là bắt buộc");
    }

    // Check if bank ID exists
    if (!bankId) {
      return sendResponse(res, 400, "ID Ngân hàng là bắt buộc");
    }

    const updateData = { bnkLstID, bnkName };
    const result = await commonUtil.updateData(req, res, updateData, BankList, bankId, "Ngân hàng");

    sendResponse(res, result.status, result.message);
  } catch (error) {
    sendResponse(res, 500, `Lỗi khi cập nhập dữ liệu Ngân hàng: ${error.message}`);
  }
});

// Delete bank
router.delete("/:id", auth, async (req, res) => {
  try {
    const bankId = req.params.id;

    // Check if bank ID exists
    if (!bankId) {
      return sendResponse(res, 400, "ID Ngân hàng là bắt buộc");
    }

    const result = await commonUtil.deleteData(req, res, BankList, bankId, "Ngân hàng");

    sendResponse(res, result.status, result.message);
  } catch (error) {
    sendResponse(res, 500, `Lỗi khi xóa dữ liệu Ngân hàng: ${error.message}`);
  }
});

module.exports = router;
