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
 * @param {Object} data - Data to validate
 * @param {Object} entity - Database entity model
 * @param {String} entityName - Entity name for error messages
 * @returns {Object} Validation result with status and message
 */
async function _validateForCreation(data, entity, entityName) {
  const result = { status: true, message: "" };

  // Check for empty fields
  if (Object.values(data).some((item) => item === undefined || item === null || item === "")) {
    result.status = false;
    result.message = "Vui lòng điền đủ thông tin!";
    return result;
  }

  return result;
}

/**
 * Validates data before update
 * @param {Object} req - Request object
 * @param {Object} updateData - Data to update
 * @param {Object} entity - Database entity model
 * @param {String} itemId - ID of item to update
 * @param {String} entityName - Entity name for error messages
 * @returns {Object} Validation result with status and message
 */
async function _validateForUpdate(req, updateData, entity, itemId, entityName) {
  const result = { status: true, message: "" };

  // Check for undefined fields
  if (Object.values(updateData).some((item) => item === undefined)) {
    result.status = false;
    result.message = "Vui lòng điền đủ thông tin!";
    return result;
  }

  // Check if ID exists
  if (!itemId) {
    result.status = false;
    result.message = `Không xác thực được ID ${entityName}! Vui lòng liên hệ nhà phát triển ứng dụng`;
    return result;
  }

  // Check if item exists
  const currentItem = await entity.findById(itemId);
  if (!currentItem) {
    result.status = false;
    result.message = `Không tìm thấy mã ${entityName} nào khớp với ID đang được cung cấp! Vui lòng liên hệ nhà phát triển ứng dụng!`;
    return result;
  }

  // Check if user has permission
  if (currentItem.user && currentItem.user.toString() !== req.user) {
    result.status = false;
    result.message = "Lỗi xác thực! Vui lòng liên hệ nhà phát triển ứng dụng!";
    return result;
  }

  // Check for duplicates
  const existingItem = await entity.findOne(updateData);
  if (existingItem && existingItem._id !== currentItem._id) {
    result.status = false;
    result.message = `${entityName} này đã có trên hệ thống`;
    return result;
  }

  result.currentItem = currentItem;
  return result;
}

/**
 * Validates data before deletion
 * @param {Object} req - Request object
 * @param {Object} entity - Database entity model
 * @param {String} itemId - ID of item to delete
 * @param {String} entityName - Entity name for error messages
 * @returns {Object} Validation result with status and message
 */
async function _validateForDeletion(req, entity, itemId, entityName) {
  const result = { status: true, message: "" };

  // Check if ID exists
  if (!itemId) {
    result.status = false;
    result.message = `Không xác thực được ID ${entityName}! Vui lòng liên hệ nhà phát triển ứng dụng`;
    return result;
  }

  // Check if item exists
  const currentItem = await entity.findById(itemId);
  if (!currentItem) {
    result.status = false;
    result.message = `Không tìm thấy mã ${entityName} nào khớp với ID đang được cung cấp! Vui lòng liên hệ nhà phát triển ứng dụng!`;
    return result;
  }

  // Check if user has permission
  if (currentItem.user.toString() !== req.user) {
    result.status = false;
    result.message = "Lỗi xác thực! Vui lòng liên hệ nhà phát triển ứng dụng!";
    return result;
  }

  result.currentItem = currentItem;
  return result;
}

/**
 * Converts currency string to integer
 * @param {String} currencyString - Currency string to convert
 * @returns {Number} Converted integer value
 */
function _currencyStringToInt(currencyString) {
  return parseInt(currencyString.replace(/[.,\s€]/g, ""));
}

/**
 * Fetches all data for an entity
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Object} entity - Database entity model
 */
async function getAllData(req, res, entity) {
  try {
    const data = await entity.find({ user: req.user });
    res.json(data);
  } catch (error) {
    res.status(500).send();
  }
}

/**
 * Creates a new entity
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Object} createData - Data to create
 * @param {Object} entity - Database entity model
 * @param {String} entityName - Entity name for messages
 * @returns {Object} Result with status and message
 */
async function createData(req, res, createData, entity, entityName) {
  // Validate data
  const validationResult = await _validateForCreation(createData, entity, entityName);
  if (!validationResult.status) {
    return { status: 400, message: validationResult.message };
  }

  // Create data
  createData.user = req.user;
  const newData = new entity(createData);
  await newData.save();

  return { status: 200, message: `${entityName} được tạo mới thành công` };
}

/**
 * Updates an entity
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Object} updateData - Data to update
 * @param {Object} entity - Database entity model
 * @param {String} itemId - ID of item to update
 * @param {String} entityName - Entity name for messages
 * @returns {Object} Result with status and message
 */
async function updateData(req, res, updateData, entity, itemId, entityName) {
  // Validate data
  const validationResult = await _validateForUpdate(req, updateData, entity, itemId, entityName);

  if (!validationResult.status) {
    return { status: 400, message: validationResult.message };
  }

  // Update data
  await entity.findOneAndUpdate({ _id: itemId }, updateData);
  return { status: 200, message: `${entityName} được cập nhập thành công` };
}

/**
 * Deletes an entity
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Object} entity - Database entity model
 * @param {String} itemId - ID of item to delete
 * @param {String} entityName - Entity name for messages
 * @returns {Object} Result with status and message
 */
async function deleteData(req, res, entity, itemId, entityName) {
  // Validate data
  const validationResult = await _validateForDeletion(req, entity, itemId, entityName);
  if (!validationResult.status) {
    return { status: 400, message: validationResult.message };
  }

  await validationResult.currentItem.deleteOne();
  return { status: 200, message: `${entityName} được xóa thành công` };
}

/**
 * Updates user wallet after creation
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {String} listCode - Wallet type code
 * @param {Number} changeMoney - Amount to change
 * @param {Object} entity - User entity model
 * @returns {Object} Result with status and message
 */
async function updateWalletAfterCreation(req, res, listCode, changeMoney, entity) {
  try {
    const userData = await entity.findById(req.user);

    // Update appropriate wallet based on code
    switch (listCode) {
      case "SO":
        userData.walletLife += changeMoney;
        break;
      case "TK":
        userData.walletSaving += changeMoney;
        break;
      case "DT":
        userData.walletInvest += changeMoney;
        break;
      case "TD":
        userData.walletFree += changeMoney;
        break;
    }

    await entity.findOneAndUpdate({ _id: req.user }, userData);
    return { status: 200, message: "Đã cập nhập ví của bạn" };
  } catch (error) {
    return { status: 500, message: error };
  }
}

/**
 * Updates user wallet after update
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {String} listCode - Wallet type code
 * @param {Number} changeMoney - Amount to change
 * @param {Object} entity - User entity model
 * @returns {Object} Result with status and message
 */
async function updateWalletAfterUpdate(req, res, listCode, changeMoney, entity) {
  try {
    const userData = await entity.findById(req.user);
    const amount = parseInt(changeMoney);

    // Update appropriate wallet based on code
    switch (listCode) {
      case "SO":
        userData.walletLife += amount;
        break;
      case "TK":
        userData.walletSaving += amount;
        break;
      case "DT":
        userData.walletInvest += amount;
        break;
      case "TD":
        userData.walletFree += amount;
        break;
    }

    await entity.findOneAndUpdate({ _id: req.user }, userData);
    return { status: 200, message: "Đã cập nhập ví của bạn" };
  } catch (error) {
    return { status: 400, message: error };
  }
}

/**
 * Updates user wallet after deletion
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Object} data - Item data
 * @param {String} codeField - Field name containing code
 * @param {String} moneyField - Field name containing amount
 * @param {Object} entity - User entity model
 * @returns {Object} Result with status and message
 */
async function updateWalletAfterDeletion(req, res, data, codeField, moneyField, entity) {
  try {
    const sourceCode = data[codeField];
    const amount = parseInt(_currencyStringToInt(data[moneyField]));
    const userData = await entity.findById(req.user);

    // Update appropriate wallet based on code
    switch (sourceCode) {
      case "SO":
        userData.walletLife -= amount;
        break;
      case "TK":
        userData.walletSaving -= amount;
        break;
      case "DT":
        userData.walletInvest -= amount;
        break;
      case "TD":
        userData.walletFree -= amount;
        break;
    }

    await entity.findOneAndUpdate({ _id: req.user }, userData);
    return { status: 200, message: "Đã cập nhập ví của bạn" };
  } catch (error) {
    return { status: 400, message: error };
  }
}

/**
 * Updates wallet based on multiple entries
 * @param {Object} req - Request object
 * @param {String} codeField - Field name containing code
 * @param {String} moneyField - Field name containing amount
 * @param {Array} data - Array of items
 * @param {Object} User - User entity model
 * @returns {Object} Result with status and message
 */
async function updateWalletBatch(req, codeField, moneyField, data, User) {
  try {
    // Initialize totals for each wallet type
    const totals = {
      SO: 0,
      DT: 0,
      TK: 0,
      TD: 0,
    };

    // Calculate totals based on operation type
    switch (codeField) {
      case "exelstCode":
        data.forEach((item) => {
          totals[item[codeField]] += parseInt(_currencyStringToInt(item[moneyField]));
        });
        break;
      case "inlstCode":
        data.forEach((item) => {
          totals[item[codeField]] -= parseInt(_currencyStringToInt(item[moneyField]));
        });
        break;
      case "bnkLstID":
        data.forEach((item) => {
          if (!item.savStatus) {
            totals.TK += parseInt(_currencyStringToInt(item[moneyField]));
          }
        });
        break;
      case "coinLstID":
        data.forEach((item) => {
          if (!item.investStatus) {
            totals.DT += parseInt(_currencyStringToInt(item[moneyField]));
          }
        });
        break;
    }

    // Apply changes to user's wallets
    const userData = await User.findById(req.user);
    userData.walletLife += totals.SO;
    userData.walletSaving += totals.TK;
    userData.walletInvest += totals.DT;
    userData.walletFree += totals.TD;

    await User.findOneAndUpdate({ _id: req.user }, userData);
    return { status: 200, message: "Đã cập nhập ví của bạn" };
  } catch (error) {
    return { status: 400, message: error };
  }
}

/**
 * Sends verification email
 * @param {String} email - Recipient email
 * @param {String} link - Verification link
 * @param {String} userName - User's name
 */
async function sendVerificationEmail(email, userName) {
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
                <!-- Nếu có logo, thêm vào đây -->
                <!-- <img src="https://example.com/logo.png" alt="Personal Economic Logo" style="width: 150px; height: auto; margin-bottom:15px;"> -->
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
                  <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Kích hoạt  tài khoản ngay</a>
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
      from: `"Personal Economic" <manageeconomic@gmail.com>`,
      to: email,
      subject: "KÍCH HOẠT TÀI KHOẢN NGƯỜI DÙNG PERSONAL ECONOMIC",
      text: `Xin chào ${userName}! Truy cập vào đường link sau để kích hoạt: ${link}`,
      html: htmlTemplate,
    });

    console.log(`✅ Verification email sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send verification  email:", error);
    throw error;
  }
};

/**
 * Sends Reminder email
 * @param {String} email - Recipient email
 * @param {String} userName - User's name
 */
async function sendReminderEmail(email, userName) {
  try {
    const html = `
      <!DOCTYPE html>
      <html><body>
        <h2>Xin chào ${userName},</h2>
        <p>Đây là lời nhắc hằng ngày từ Personal Economic</p>
        <p>Hãy nhớ kiểm tra lại chi tiêu và kế hoạch tài chính của bạn hôm nay nhé!</p>
      </body></html>
    `;

    await _transporterMail.sendMail({
      from: `"Personal Economic" <manageeconomic@gmail.com>`,
      to: email,
      subject: "Lời nhắc hằng ngày từ Personal Economic",
      text: `Xin chào ${userName}, đây là lời nhắc hằng ngày của bạn.`,
      html,
    });

  } catch (error) {
    console.error("❌ Failed to send reminder email:", error);
    throw error;
  }
}



module.exports = {
  getAllData,
  createData,
  updateData,
  deleteData,
  updateWalletAfterCreation: updateWalletAfterCreation,
  updateWalletAfterUpdate: updateWalletAfterUpdate,
  updateWalletBatch,
  updateWalletAfterDeletion,
  sendVerificationEmail,
  sendReminderEmail
};
