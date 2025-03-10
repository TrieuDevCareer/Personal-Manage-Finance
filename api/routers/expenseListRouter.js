const router = require("express").Router();
const ExpenseList = require("../models/expenseListModel");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

/**
 * Hàm xử lý phản hồi
 * @param {object} res - Đối tượng response của Express
 * @param {number} status - Mã HTTP status
 * @param {string|object} message - Thông điệp hoặc dữ liệu phản hồi
 * @param {boolean} isError - Xác định đây có phải là phản hồi lỗi hay không
 */
const sendResponse = (res, status, message, isError = false) => {
  if (isError) {
    return res.status(status).json({ errorMessage: message });
  }
  return res.status(status).json(message);
};

/**
 * Các route xử lý danh mục tiêu dùng
 */

// Lấy tất cả danh mục tiêu dùng
router.get("/", auth, async (req, res) => {
  try {
    await commonUtil.getAllData(req, res, ExpenseList);
  } catch (error) {
    sendResponse(res, 500, `Lỗi khi lấy danh mục tiêu dùng: ${error.message}`, true);
  }
});

// Lấy danh mục theo mã
router.post("/content", auth, async (req, res) => {
  try {
    let { data } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!data || !Array.isArray(data)) {
      return sendResponse(res, 400, "Dữ liệu phải là một mảng", true);
    }

    // Xử lý trường hợp "All"
    data = data[0] === "All" ? ["SO", "TK", "DT", "TD"] : data;

    // Truy vấn cơ sở dữ liệu
    const resultData = await ExpenseList.find({
      user: req.user,
      exelstCode: { $in: data },
    });

    sendResponse(res, 200, resultData);
  } catch (error) {
    sendResponse(res, 500, `Lỗi khi lấy danh mục theo mã: ${error.message}`, true);
  }
});

// Tạo danh mục tiêu dùng mới
router.post("/", auth, async (req, res) => {
  try {
    const { exelstCode, exeLstContent } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!exelstCode || !exeLstContent) {
      return sendResponse(res, 400, "Mã và nội dung danh mục là bắt buộc", true);
    }

    const createData = { exelstCode, exeLstContent };
    const result = await commonUtil.createData(
      req,
      res,
      createData,
      ExpenseList,
      "Danh mục tiêu dùng"
    );

    sendResponse(res, result.status, result.message, result.status !== 200);
  } catch (error) {
    sendResponse(res, 500, `Lỗi khi tạo danh mục tiêu dùng: ${error.message}`, true);
  }
});

// Cập nhật danh mục tiêu dùng
router.put("/:id", auth, async (req, res) => {
  try {
    const { exelstCode, exeLstContent } = req.body;
    const exeId = req.params.id;

    // Kiểm tra dữ liệu đầu vào
    if (!exelstCode || !exeLstContent) {
      return sendResponse(res, 400, "Mã và nội dung danh mục là bắt buộc", true);
    }

    // Kiểm tra ID
    if (!exeId) {
      return sendResponse(res, 400, "ID danh mục là bắt buộc", true);
    }

    const updateData = { exelstCode, exeLstContent };
    const result = await commonUtil.updateData(
      req,
      res,
      updateData,
      ExpenseList,
      exeId,
      "Danh mục tiêu dùng"
    );

    sendResponse(res, result.status, result.message, result.status !== 200);
  } catch (error) {
    sendResponse(res, 500, `Lỗi khi cập nhật danh mục tiêu dùng: ${error.message}`, true);
  }
});

// Xóa danh mục tiêu dùng
router.delete("/:id", auth, async (req, res) => {
  try {
    const exeId = req.params.id;

    // Kiểm tra ID
    if (!exeId) {
      return sendResponse(res, 400, "ID danh mục là bắt buộc", true);
    }

    const result = await commonUtil.deleteData(req, res, ExpenseList, exeId, "danh mục tiêu dùng");

    sendResponse(res, result.status, result.message, result.status !== 200);
  } catch (error) {
    sendResponse(res, 500, `Lỗi khi xóa danh mục tiêu dùng: ${error.message}`, true);
  }
});

module.exports = router;
