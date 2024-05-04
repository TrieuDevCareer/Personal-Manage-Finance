//validate for case Create data
async function _validateDataCaseCreate(
  oValidateData,
  oValidateEntity,
  sNameEntity
) {
  const oResultValidate = { status: true, message: "" };
  // validate input all data
  const aGetDataObj = Object.values(oValidateData);
  const bResultCheck = aGetDataObj.some((item) => item === undefined);
  if (bResultCheck) {
    oResultValidate.status = false;
    oResultValidate.message = "Vui lòng điền đủ thông tin!";
    return oResultValidate;
  }

  // validate existing data in database
  const oExistEntity = await oValidateEntity.findOne(oValidateData);
  if (oExistEntity) {
    oResultValidate.status = false;
    oResultValidate.message = `Dữ liệu ${sNameEntity} đang tạo mới đã có trên hệ thống!`;
    return oResultValidate;
  }
  return oResultValidate;
}

// validate for case Update data
async function _validateDataCaseUpdate(
  req,
  oUpdateData,
  oEntity,
  sItemId,
  sNameEntity
) {
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
    oResultValidate.message =
      "Lỗi xác thực! Vui lòng liên hệ nhà phát triển ứng dụng!";
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
    oResultValidate.message =
      "Lỗi xác thực! Vui lòng liên hệ nhà phát triển ứng dụng!";
    return oResultValidate;
  }
  oResultValidate.oCurrentItem = oCurrentItem;
  return oResultValidate;
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
  const oResultValidation = await _validateDataCaseCreate(
    oCreateData,
    oEntity,
    sNameEntity
  );
  if (!oResultValidation.status) {
    return res.status(400).json({
      errorMessage: oResultValidation.message,
    });
  }
  oCreateData.user = req.user;
  // create data
  const oNewData = new oEntity(oCreateData);
  const oSaveBankList = await oNewData.save();
  res.json(oSaveBankList);
}

// update data from Entity
async function updateData(
  req,
  res,
  oUpdateData,
  oEntity,
  sItemId,
  sNameEntity
) {
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
  res.json(oUpdateData);
}

// delete data from Entity
async function deleteData(req, res, oEntity, sItemId, sNameEntity) {
  // validate before delete data
  const oResultValidate = await _validateDatacaseDelete(
    req,
    oEntity,
    sItemId,
    sNameEntity
  );
  if (!oResultValidate.status) {
    return res.status(400).json({
      errorMessage: oResultValidate.message,
    });
  }
  await oResultValidate.oCurrentItem.deleteOne();
  res.json(oResultValidate.oCurrentItem);
}
module.exports = {
  getAllResult: getAllDataEntity,
  createDataCase: createData,
  updateDataCase: updateData,
  deleteDataCase: deleteData,
};
