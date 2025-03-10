const router = require("express").Router();
const CoinList = require("../models/coinListModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

/**
 * Error response helper function
 * @param {object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {string|object} payload - Response payload (message or error)
 * @param {boolean} isError - Whether this is an error response
 */
const sendResponse = (res, status, payload, isError = false) => {
  if (isError) {
    return res.status(status).json({ errorMessage: payload });
  }
  return res.status(status).json(payload);
};

/**
 * Route handlers
 */
// Get all coins
router.get("/", auth, async (req, res) => {
  try {
    await commonUtil.getAllData(req, res, CoinList);
  } catch (error) {
    sendResponse(res, 500, `Lỗi truy xuất dữ liệu danh sách Coin: ${error.message}`, true);
  }
});

// Create new coin
router.post("/", auth, async (req, res) => {
  try {
    const { coinLstID, coinName } = req.body;

    // Validate required fields
    if (!coinLstID || !coinName) {
      return sendResponse(res, 400, "Coin ID và tên Coin là dữ liệu bắt buộc", true);
    }

    const coinData = { coinLstID, coinName };
    const result = await commonUtil.createData(req, res, coinData, CoinList, "Đồng coin");

    if (result.status === 200) {
      sendResponse(res, 200, result.message);
    } else {
      sendResponse(res, 400, result.message, true);
    }
  } catch (error) {
    sendResponse(res, 500, `Lỗi tạo dữ liệu Coin: ${error.message}`, true);
  }
});

// Update coin
router.put("/:id", auth, async (req, res) => {
  try {
    const { coinLstID, coinName } = req.body;
    const coinId = req.params.id;

    // Validate required fields
    if (!coinLstID || !coinName) {
      return sendResponse(res, 400, "Coin ID và tên Coin là dữ liệu bắt buộc", true);
    }

    // Check if coin ID exists
    if (!coinId) {
      return sendResponse(res, 400, "Coin ID là dữ liệu bắt buộc", true);
    }

    const updateData = { coinLstID, coinName };
    const result = await commonUtil.updateData(req, res, updateData, CoinList, coinId, "Đồng coin");

    if (result.status === 200) {
      sendResponse(res, 200, result.message);
    } else {
      sendResponse(res, 400, result.message, true);
    }
  } catch (error) {
    sendResponse(res, 500, `Lỗi cập nhập dữ liệu Coin: ${error.message}`, true);
  }
});

// Delete coin
router.delete("/:id", auth, async (req, res) => {
  try {
    const coinId = req.params.id;

    // Check if coin ID exists
    if (!coinId) {
      return sendResponse(res, 400, "Coin ID là dữ liệu bắt buộc", true);
    }

    // Fixed the entity name - was "danh mục tổng hợp" in original but should be "đồng coin"
    const result = await commonUtil.deleteData(req, res, CoinList, coinId, "Đồng coin");

    if (result.status === 200) {
      sendResponse(res, 200, result.message);
    } else {
      sendResponse(res, 400, result.message, true);
    }
  } catch (error) {
    sendResponse(res, 500, `Lỗi xóa dữ liệu Coin: ${error.message}`, true);
  }
});

module.exports = router;
