const nodemailer = require("nodemailer");

/**
 * Transporter configuration for sending emails
 */
const _transporterMail = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "manageeconomic@gmail.com",
    pass: "bcmj mkpd hfdy wctm",
  },
});

/**
 * Validates data before creation
 */
async function _validateForCreation(data, entity, entityName) {
  if (Object.values(data).some((item) => item === undefined || item === null || item === "")) {
    return { status: false, message: "Vui lòng điền đủ thông tin!" };
  }
  return { status: true, message: "" };
}

/**
 * Validates data before update
 */
async function _validateForUpdate(req, updateData, entity, itemId, entityName) {
  if (Object.values(updateData).some((item) => item === undefined)) {
    return { status: false, message: "Vui lòng điền đủ thông tin!" };
  }

  if (!itemId) {
    return { status: false, message: `Không xác thực được ID ${entityName}! Vui lòng liên hệ nhà phát triển ứng dụng` };
  }

  const currentItem = await entity.findById(itemId);
  if (!currentItem) {
    return { status: false, message: `Không tìm thấy mã ${entityName} nào khớp với ID đang được cung cấp! Vui lòng liên hệ nhà phát triển ứng dụng!` };
  }

  if (currentItem.user && currentItem.user.toString() !== req.user) {
    return { status: false, message: "Lỗi xác thực! Vui lòng liên hệ nhà phát triển ứng dụng!" };
  }

  // Check for duplicates
  const existingItem = await entity.findOne({ ...updateData, user: req.user });
  if (existingItem && existingItem._id.toString() !== currentItem._id.toString()) {
    return { status: false, message: `${entityName} này đã có trên hệ thống` };
  }

  return { status: true, message: "", currentItem };
}

/**
 * Validates data before deletion
 */
async function _validateForDeletion(req, entity, itemId, entityName) {
  if (!itemId) {
    return { status: false, message: `Không xác thực được ID ${entityName}! Vui lòng liên hệ nhà phát triển ứng dụng` };
  }

  const currentItem = await entity.findById(itemId);
  if (!currentItem) {
    return { status: false, message: `Không tìm thấy mã ${entityName} nào khớp với ID đang được cung cấp! Vui lòng liên hệ nhà phát triển ứng dụng!` };
  }

  if (currentItem.user.toString() !== req.user) {
    return { status: false, message: "Lỗi xác thực! Vui lòng liên hệ nhà phát triển ứng dụng!" };
  }

  return { status: true, message: "", currentItem };
}

/**
 * Converts currency string to integer
 */
function _currencyStringToInt(currencyString) {
  if (typeof currencyString === "number") return currencyString;
  if (!currencyString) return 0;
  return parseInt(currencyString.toString().replace(/[.,\s€]/g, ""));
}

/**
 * Fetches all data for an entity
 */
async function getAllData(req, res, entity) {
  try {
    const data = await entity.find({ user: req.user });
    res.json(data);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
}

/**
 * Creates a new entity
 */
async function createData(req, res, createData, entity, entityName) {
  const validationResult = await _validateForCreation(createData, entity, entityName);
  if (!validationResult.status) {
    return { status: 400, message: validationResult.message };
  }

  createData.user = req.user;
  const newData = new entity(createData);
  await newData.save();

  return { status: 200, message: `${entityName} được tạo mới thành công` };
}

/**
 * Updates an entity
 */
async function updateData(req, res, updateData, entity, itemId, entityName) {
  const validationResult = await _validateForUpdate(req, updateData, entity, itemId, entityName);
  if (!validationResult.status) {
    return { status: 400, message: validationResult.message };
  }

  await entity.findByIdAndUpdate(itemId, updateData);
  return { status: 200, message: `${entityName} được cập nhập thành công` };
}

/**
 * Deletes an entity
 */
async function deleteData(req, res, entity, itemId, entityName) {
  const validationResult = await _validateForDeletion(req, entity, itemId, entityName);
  if (!validationResult.status) {
    return { status: 400, message: validationResult.message };
  }

  await validationResult.currentItem.deleteOne();
  return { status: 200, message: `${entityName} được xóa thành công` };
}

/**
 * Updates user wallet after creation using atomic $inc
 */
async function updateWalletAfterCreation(req, res, listCode, changeMoney, entity) {
  try {
    const amount = parseInt(changeMoney);
    const incQuery = {};

    switch (listCode) {
      case "SO": incQuery.walletLife = amount; break;
      case "TK": incQuery.walletSaving = amount; break;
      case "DT": incQuery.walletInvest = amount; break;
      case "TD": incQuery.walletFree = amount; break;
    }

    if (Object.keys(incQuery).length > 0) {
      await entity.findByIdAndUpdate(req.user, { $inc: incQuery });
    }
    return { status: 200, message: "Đã cập nhập ví của bạn" };
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

/**
 * Updates user wallet after update using atomic $inc
 */
async function updateWalletAfterUpdate(req, res, listCode, changeMoney, entity) {
  try {
    const amount = parseInt(changeMoney);
    const incQuery = {};

    switch (listCode) {
      case "SO": incQuery.walletLife = amount; break;
      case "TK": incQuery.walletSaving = amount; break;
      case "DT": incQuery.walletInvest = amount; break;
      case "TD": incQuery.walletFree = amount; break;
    }

    if (Object.keys(incQuery).length > 0) {
      await entity.findByIdAndUpdate(req.user, { $inc: incQuery });
    }
    return { status: 200, message: "Đã cập nhập ví của bạn" };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

/**
 * Updates user wallet after deletion using atomic $inc
 */
async function updateWalletAfterDeletion(req, res, data, codeField, moneyField, entity) {
  try {
    const sourceCode = data[codeField];
    const amount = parseInt(_currencyStringToInt(data[moneyField]));
    const incQuery = {};

    switch (sourceCode) {
      case "SO": incQuery.walletLife = -amount; break;
      case "TK": incQuery.walletSaving = -amount; break;
      case "DT": incQuery.walletInvest = -amount; break;
      case "TD": incQuery.walletFree = -amount; break;
    }

    if (Object.keys(incQuery).length > 0) {
      await entity.findByIdAndUpdate(req.user, { $inc: incQuery });
    }
    return { status: 200, message: "Đã cập nhập ví của bạn" };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

/**
 * Updates wallet based on multiple entries using atomic $inc
 */
async function updateWalletBatch(req, codeField, moneyField, data, User) {
  try {
    const totals = { SO: 0, DT: 0, TK: 0, TD: 0 };

    switch (codeField) {
      case "exelstCode":
        data.forEach((item) => { totals[item[codeField]] += parseInt(_currencyStringToInt(item[moneyField])); });
        break;
      case "inlstCode":
        data.forEach((item) => { totals[item[codeField]] -= parseInt(_currencyStringToInt(item[moneyField])); });
        break;
      case "bnkLstID":
        data.forEach((item) => { if (!item.savStatus) totals.TK += parseInt(_currencyStringToInt(item[moneyField])); });
        break;
      case "coinLstID":
        data.forEach((item) => { if (!item.investStatus) totals.DT += parseInt(_currencyStringToInt(item[moneyField])); });
        break;
    }

    const incQuery = {
      walletLife: totals.SO,
      walletSaving: totals.TK,
      walletInvest: totals.DT,
      walletFree: totals.TD,
    };

    await User.findByIdAndUpdate(req.user, { $inc: incQuery });
    return { status: 200, message: "Đã cập nhập ví của bạn" };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

/**
 * Sends verification email
 */
async function sendVerificationEmail(email, link, userName) {
  try {
    const htmlTemplate = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Kích hoạt tài khoản Personal Economic</title>
          </head>
          <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0;padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eaeaea;">
                <h1 style="color: #2c3e50; margin-bottom: 20px; font-size: 24px;">PERSONAL ECONOMIC</h1>
              </div>

              <div style="padding: 30px 20px;">
                <p style="font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #2c3e50;">Xin chào bạn ${userName},</p>

                <p style="margin-bottom: 25px;">
                  Chúng tôi xin gửi lời cảm ơn chân thành vì bạn đã lựa chọn sử dụng dịch vụ Personal Economic!
                </p>

                <p style="margin-bottom: 25px;">
                  Chỉ còn một bước nữa thôi, bạn sẽ có thể sử dụng đầy đủ các tính năng của ứng dụng để quản lý tài chính cá nhân một cách hiệu quả.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Kích hoạt tài khoản ngay</a>
                </div>

                <p style="margin-bottom: 25px;">
                  Nếu bạn không thể nhấp vào nút trên, vui lòng sao chép đường link dưới đây và dán vào trình duyệt:
                </p>

                <p style="word-break: break-all; text-align: center; font-size: 12px; background-color: #f8f9fa; padding: 10px;  border-radius: 4px;">
                  ${link}
                </p>
              </div>

              <div style="font-style: italic; font-weight: 600; margin: 30px 0 15px; color: #3498db; text-align: center;">
                Personal Economic - Đồng hành cùng tài chính của bạn
              </div>

              <div style="border-top: 1px dashed #e0e0e0; margin: 20px 0;"></div>

              <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #7f8c8d;">
                <p>Đây là email tự động. Vui lòng không trả lời email này.</p>
                <p>&copy; 2025 Personal Economic. Tất cả các quyền được bảo lưu.</p>
              </div>
            </div>
          </body>
          </html>
    `;

    await _transporterMail.sendMail({
      from: '"Personal Economic" <manageeconomic@gmail.com>',
      to: email,
      subject: "KÍCH HOẠT TÀI KHOẢN",
      text: `Xin chào ${userName}! Link: ${link}`,
      html: htmlTemplate,
    });
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    throw error;
  }
}

/**
 * Sends Reminder email
 */
async function sendReminderEmail(email, userName) {
  try {
    const html = `
      <!DOCTYPE html>
      <html><body>
        <h2>Xin chào ${userName},</h2>
        <p>Đây là lời nhắc hằng ngày từ Personal Economic</p>
      </body></html>
    `;

    await _transporterMail.sendMail({
      from: '"Personal Economic" <manageeconomic@gmail.com>',
      to: email,
      subject: "Lời nhắc hằng ngày",
      text: `Xin chào ${userName}, đây là lời nhắc hằng ngày.`,
      html,
    });
  } catch (error) {
    console.error("❌ Failed to send reminder email:", error);
    throw error;
  }
}

/**
 * Format currency to VND
 */
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "0 VND";
  return amount.toLocaleString("vi-VN") + " VND";
};

/**
 * Handle Multiple Operation Results 
 */
const handleMultipleResults = (res, results) => {
  const hasErrors = results.some((result) => result.status !== 200);

  if (!hasErrors) {
    const messages = results
      .filter((r) => r.message)
      .map((r) => r.message)
      .join(" và ");
    return res.json(messages || "Thao tác thành công");
  }

  const errorResult = results.find((r) => r.status !== 200);
  return res.status(errorResult.status || 400).json({
    errorMessage: errorResult.message || "Hãy liên hệ nhà phát triển ứng dụng để xử lý",
  });
};

module.exports = {
  getAllData,
  createData,
  updateData,
  deleteData,
  updateWalletAfterCreation,
  updateWalletAfterUpdate,
  updateWalletBatch,
  updateWalletAfterDeletion,
  sendVerificationEmail,
  sendReminderEmail,
  formatCurrency,
  handleMultipleResults
};
