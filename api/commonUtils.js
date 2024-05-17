//validate for case Create data
async function _validateDataCaseCreate(oValidateData, oValidateEntity, sNameEntity) {
  const oResultValidate = { status: true, message: "" };
  // validate input all data
  const aGetDataObj = Object.values(oValidateData);
  const bResultCheck = aGetDataObj.some(
    (item) => item === undefined || item === null || item === ""
  );
  if (bResultCheck) {
    oResultValidate.status = false;
    oResultValidate.message = "Vui lòng điền đủ thông tin!";
    return oResultValidate;
  }

  // // validate existing data in database
  // const oExistEntity = await oValidateEntity.findOne(oValidateData);
  // if (oExistEntity) {
  //   oResultValidate.status = false;
  //   oResultValidate.message = `Dữ liệu ${sNameEntity} đang tạo mới đã có trên hệ thống!`;
  //   return oResultValidate;
  // }
  return oResultValidate;
}

// validate for case Update data
async function _validateDataCaseUpdate(req, oUpdateData, oEntity, sItemId, sNameEntity) {
  // declare varian to store result of function
  const oResultValidate = { status: true, message: "" };

  // Validate input all data
  const aGetDataObj = Object.values(oUpdateData);
  const bResultCheck = aGetDataObj.some((item) => item === undefined);
  if (bResultCheck) {
    oResultValidate.status = false;
    oResultValidate.message = "Vui lòng điền đủ thông tin!";
    return oResultValidate;
  }

  // validate check item's ID exist or not
  if (!sItemId) {
    oResultValidate.status = false;
    oResultValidate.message = `Không xác thực được ID ${sNameEntity}! Vui lòng liên hệ nhà phát triển ứng dụng`;
    return oResultValidate;
  }

  // validate check exist item with item'ID
  const oCurrentItem = await oEntity.findById(sItemId);
  if (!oCurrentItem) {
    oResultValidate.status = false;
    oResultValidate.message = `Không tìm thấy mã ${sNameEntity} nào khớp với ID đang được cung cấp! Vui lòng liên hệ nhà phát triển ứng dụng!`;
    return oResultValidate;
  }

  // validate user fix item
  if (oCurrentItem.user.toString() !== req.user) {
    oResultValidate.status = false;
    oResultValidate.message = "Lỗi xác thực! Vui lòng liên hệ nhà phát triển ứng dụng!";
    return oResultValidate;
  }

  const aExistUpdateData = await oEntity.findOne(oUpdateData);
  if (aExistUpdateData && aExistUpdateData._id !== oCurrentItem._id) {
    oResultValidate.status = false;
    oResultValidate.message = `${sNameEntity} này đã có trên hệ thống`;
    return oResultValidate;
  }
  oResultValidate.oCurrentItem = oCurrentItem;
  return oResultValidate;
}

// validate for case Delete data
async function _validateDatacaseDelete(req, oEntity, sItemId, sNameEntity) {
  // declare varian to store result of function
  const oResultValidate = { status: true, message: "" };

  // validate case not found item's ID need to delete
  if (!sItemId) {
    oResultValidate.status = false;
    oResultValidate.message = `Không xác thực được ID ${sNameEntity}! Vui lòng liên hệ nhà phát triển ứng dụng`;
    return oResultValidate;
  }
  // validate case not found Item data need to delete with item's Id
  const oCurrentItem = await oEntity.findById(sItemId);
  if (!oCurrentItem) {
    oResultValidate.status = false;
    oResultValidate.message = `Không tìm thấy mã ${sNameEntity} nào khớp với ID đang được cung cấp! Vui lòng liên hệ nhà phát triển ứng dụng!`;
    return oResultValidate;
  }

  //validate check item's ID exist or not
  if (oCurrentItem.user.toString() !== req.user) {
    oResultValidate.status = false;
    oResultValidate.message = "Lỗi xác thực! Vui lòng liên hệ nhà phát triển ứng dụng!";
    return oResultValidate;
  }
  oResultValidate.oCurrentItem = oCurrentItem;
  return oResultValidate;
}

function _currencyStringToInt(currencyString) {
  // Remove currency symbol and thousands separator
  var numberString = currencyString.replace(/[\.,\s€]/g, "");
  // Convert to integer
  return parseInt(numberString);
}

// get all data from Entity
async function getAllDataEntity(req, res, oEntity) {
  try {
    const aResultData = await oEntity.find({ user: req.user });
    res.json(aResultData);
  } catch (error) {
    res.status(500).send();
  }
}

// create data from  Entity
async function createData(req, res, oCreateData, oEntity, sNameEntity) {
  // validate before create data
  const oResultValidation = await _validateDataCaseCreate(oCreateData, oEntity, sNameEntity);
  if (!oResultValidation.status) {
    return res.status(400).json({
      errorMessage: oResultValidation.message,
    });
  }
  oCreateData.user = req.user;
  // create data
  const oNewData = new oEntity(oCreateData);
  const oSaveBankList = await oNewData.save();
  return `${sNameEntity} được tạo mới thành công`;
}

// update data from Entity
async function updateData(req, res, oUpdateData, oEntity, sItemId, sNameEntity) {
  // validate data before update
  const oResultValidate = await _validateDataCaseUpdate(
    req,
    oUpdateData,
    oEntity,
    sItemId,
    sNameEntity
  );
  if (!oResultValidate.status) {
    return res.status(400).json({
      errorMessage: oResultValidate.message,
    });
  }

  // update data
  await oEntity.findOneAndUpdate({ _id: sItemId }, oUpdateData);
  return `${sNameEntity} được cập nhập thành công`;
}

// delete data from Entity
async function deleteData(req, res, oEntity, sItemId, sNameEntity) {
  // validate before delete data
  const oResultValidate = await _validateDatacaseDelete(req, oEntity, sItemId, sNameEntity);
  if (!oResultValidate.status) {
    return res.status(400).json({
      errorMessage: oResultValidate.message,
    });
  }
  await oResultValidate.oCurrentItem.deleteOne();
  return `${sNameEntity} xóa thành công`;
}
//  wallet when user add income or get saving aor invesment
async function UpdateUserWalletCaseCreate(req, res, listCode, iChangeMoney, oEntity) {
  try {
    let oUserData = await oEntity.findById(req.user);
    switch (listCode) {
      case "SO":
        oUserData.walletLife = oUserData.walletLife + iChangeMoney;
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      case "TK":
        oUserData.walletSaving = oUserData.walletSaving + iChangeMoney;
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      case "DT":
        oUserData.walletInvest = oUserData.walletInvest + iChangeMoney;
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      case "TD":
        oUserData.walletFree = oUserData.walletFree + iChangeMoney;
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      default:
        break;
    }
    return "Đã cập nhập ví của bạn";
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    });
  }
}
//  wallet when user add income or get saving aor invesment
async function UpdateUserWalletCaseUpdate(req, res, listCode, iChangeMoney, oEntity) {
  try {
    let oUserData = await oEntity.findById(req.user);
    switch (listCode) {
      case "SO":
        oUserData.walletLife = oUserData.walletLife + parseInt(iChangeMoney);
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      case "TK":
        oUserData.walletSaving = oUserData.walletSaving + parseInt(iChangeMoney);
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      case "DT":
        oUserData.walletInvest = oUserData.walletInvest + parseInt(iChangeMoney);
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      case "TD":
        oUserData.walletFree = oUserData.walletFree + parseInt(iChangeMoney);
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      default:
        break;
    }
    return "Đã cập nhập ví của bạn";
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    });
  }
}
async function UpdateUserWalletCaseDelete(req, res, data, oCodeDis, oChangeMoney, oEntity) {
  try {
    const sSourceCode = data[oCodeDis];
    const iChangeMoney = _currencyStringToInt(data[oChangeMoney]);
    const oUserData = await oEntity.findById(req.user);

    switch (sSourceCode) {
      case "SO":
        oUserData.walletLife = oUserData.walletLife - parseInt(iChangeMoney);
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      case "TK":
        oUserData.walletSaving = oUserData.walletSaving - parseInt(iChangeMoney);
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      case "DT":
        oUserData.walletInvest = oUserData.walletInvest - parseInt(iChangeMoney);
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      case "TD":
        oUserData.walletFree = oUserData.walletFree - parseInt(iChangeMoney);
        await oEntity.findOneAndUpdate({ _id: req.user }, oUserData);
        break;
      default:
        break;
    }
    return "Đã cập nhập ví của bạn";
  } catch (error) {
    return res.status(400).json({
      errorMessage: error,
    });
  }
}

async function UpdateWalletUser(req, title, iMoney, data, User) {
  const totals = {
    SO: 0,
    DT: 0,
    TK: 0,
    TD: 0,
  };
  switch (title) {
    case "exelstCode":
      data.forEach((element) => {
        totals[element[title]] += parseInt(_currencyStringToInt(element[iMoney]));
      });
      break;
    case "inlstCode":
      data.forEach((element) => {
        totals[element[title]] -= parseInt(_currencyStringToInt(element[iMoney]));
      });
      break;
    case "bnkLstID":
      data.forEach((element) => {
        if (!element.savStatus) {
          totals.TK += parseInt(_currencyStringToInt(element[iMoney]));
        }
      });
      break;
    case "coinLstID":
      data.forEach((element) => {
        if (!element.investStatus) {
          totals.DT += parseInt(_currencyStringToInt(element[iMoney]));
        }
      });
      break;
    default:
      break;
  }

  const oUserData = await User.findById(req.user);
  oUserData.walletLife += totals.SO;
  oUserData.walletSaving += totals.TK;
  oUserData.walletInvest += totals.DT;
  oUserData.walletFree += totals.TD;

  await User.findOneAndUpdate({ _id: req.user }, oUserData);
}

module.exports = {
  getAllResult: getAllDataEntity,
  createDataCase: createData,
  updateDataCase: updateData,
  deleteDataCase: deleteData,
  UpdateUserWalletNew: UpdateUserWalletCaseCreate,
  UpdateUserWalletUpdate: UpdateUserWalletCaseUpdate,
  UpdateWalletUser: UpdateWalletUser,
  UpdateUserWalletDelete: UpdateUserWalletCaseDelete,
};
