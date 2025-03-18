import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Box, TextField, Stack, Button, MenuItem } from "@mui/material";
import domain from "../../../util/domain.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import ErrorMessage from "../../misc/ErrorMessage";
import "./inBodyEditor.scss";

const GenderOption = [
  {
    value: "male",
    label: "Nam giới",
  },
  {
    value: "female",
    label: "Nữ giới",
  },
];

function InBodyEditor({ getInbodyMetrics, setInbodyMetricEditorOpen, editInbodyMetricData }) {
  // Đổi sang dùng một state object thay vì nhiều state riêng biệt
  const [formData, setFormData] = useState({
    // Input fields
    gender: "",
    age: "",
    weight: "",
    height: "",
    waist: "",
    hip: "",
    neck: "",
    arm: "",
    thigh: "",

    // Calculated fields
    bf: 0,
    vfa: 0,
    lbm: 0,
    smm: 0,
    tbw: 0,
    bmr: 0,
    tdee: 0,
    ffmi: 0,
    whr: 0,
    whtr: 0,
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneWidth, setIsPhoneWidth] = useState(false);

  // Unified handler for all form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Calculate all metrics when input values change
  useEffect(() => {
    calculateInbodyMetrics();
  }, [
    formData.gender,
    formData.age,
    formData.weight,
    formData.height,
    formData.waist,
    formData.hip,
    formData.neck,
  ]);

  // Calculate all body metrics
  function calculateInbodyMetrics() {
    const updatedData = { ...formData };
    const { gender, age, weight, height, waist, hip, neck } = updatedData;

    // Convert string values to numbers for calculations
    const numWeight = parseFloat(weight) || 0;
    const numHeight = parseFloat(height) || 0;
    const numAge = parseFloat(age) || 0;
    const numWaist = parseFloat(waist) || 0;
    const numHip = parseFloat(hip) || 0;
    const numNeck = parseFloat(neck) || 0;

    // Calculate BMR (Mifflin-St Jeor)
    if (numWeight && numHeight && numAge && gender) {
      updatedData.bmr =
        gender === "male"
          ? 10 * numWeight + 6.25 * numHeight - 5 * numAge + 5
          : 10 * numWeight + 6.25 * numHeight - 5 * numAge - 161;
    } else {
      updatedData.bmr = 0;
    }

    // Calculate TDEE
    if (updatedData.bmr) {
      updatedData.tdee = updatedData.bmr * 1.2;
    } else {
      updatedData.tdee = 0;
    }

    // Calculate BF% (Công thức U.S. Navy)
    if (gender && numWaist && numHeight && numNeck) {
      if (gender === "male" && numWaist > numNeck) {
        updatedData.bf =
          495 /
          (1.0324 - 0.19077 * Math.log10(numWaist - numNeck) + 0.15456 * Math.log10(numHeight)) -
          450;
      } else if (gender === "female" && numWaist && numHip && numNeck) {
        updatedData.bf =
          495 /
          (1.29579 -
            0.35004 * Math.log10(numWaist + numHip - numNeck) +
            0.221 * Math.log10(numHeight)) -
          450;
      }
    } else {
      updatedData.bf = 0;
    }

    // Calculate LBM (Lean Body Mass)
    if (updatedData.bf !== undefined && numWeight) {
      updatedData.lbm = (numWeight * (100 - updatedData.bf)) / 100;
    } else {
      updatedData.lbm = 0;
    }

    // Calculate SMM (Skeletal Muscle Mass)
    if (updatedData.lbm) {
      updatedData.smm = updatedData.lbm * 0.52;
    } else {
      updatedData.smm = 0;
    }

    // Calculate WHR (Waist-to-Hip Ratio)
    if (numWaist && numHip) {
      updatedData.whr = numWaist / numHip;
    } else {
      updatedData.whr = 0;
    }

    // Calculate WHtR (Waist-to-Height Ratio)
    if (numWaist && numHeight) {
      updatedData.whtr = numWaist / numHeight;
    } else {
      updatedData.whtr = 0;
    }

    // Calculate FFMI (Fat-Free Mass Index)
    if (updatedData.lbm && numHeight) {
      const heightInMeters = numHeight / 100;
      updatedData.ffmi = updatedData.lbm / Math.pow(heightInMeters, 2);
    } else {
      updatedData.ffmi = 0;
    }

    // Calculate TBW (Total Body Water)
    if (updatedData.lbm) {
      updatedData.tbw = updatedData.lbm * 0.73;
    } else {
      updatedData.tbw = 0;
    }

    // Calculate VFA (Visceral Fat Area)
    if (numWeight && numHeight && numAge && numWaist && gender) {
      const bmi = numWeight / Math.pow(numHeight / 100, 2);
      const genderFactor = gender === "male" ? 1 : 0;

      const vfaEstimate =
        -453.7 + 6.37 * bmi + 6.06 * numAge + 9.4 * genderFactor + 97.8 * Math.log10(numWaist);

      updatedData.vfa = Math.max(0, vfaEstimate); // Ensure non-negative value
    } else {
      updatedData.vfa = 0;
    }

    // Format numeric values for display
    Object.keys(updatedData).forEach((key) => {
      if (
        typeof updatedData[key] === "number" &&
        !["age", "weight", "height", "waist", "hip", "neck", "arm", "thigh"].includes(key)
      ) {
        updatedData[key] = parseFloat(updatedData[key].toFixed(2));
      }
    });

    setFormData(updatedData);
  }

  function closeEditor() {
    setInbodyMetricEditorOpen(false);
  }

  async function saveInbody(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = editInbodyMetricData
        ? `${domain}/inbodymetric/${editInbodyMetricData._id}`
        : `${domain}/inbodymetric/`;

      const method = editInbodyMetricData ? Axios.put : Axios.post;
      await method(endpoint, formData);

      getInbodyMetrics();
      closeEditor();
    } catch (err) {
      setIsLoading(false);
      if (err.response?.data?.errorMessage) {
        setMessage(err.response.data.errorMessage);
      }
    }
  }

  // Load data for editing
  useEffect(() => {
    if (editInbodyMetricData) {
      const initialData = {};

      // Map existing data to our form fields
      Object.keys(formData).forEach((key) => {
        initialData[key] = editInbodyMetricData[key] || formData[key];
      });

      setFormData(initialData);
    }

    // Check if device is phone width
    setIsPhoneWidth(window.outerWidth <= 739);
  }, [editInbodyMetricData]);

  // Input field generator to reduce repetition
  const renderTextField = (
    label,
    name,
    value,
    isDisabled = false,
    isSelect = false,
    options = []
  ) => {
    const baseProps = {
      className: isDisabled ? "popup-text-disable" : "popup-text",
      fullWidth: true,
      label: label,
      name: name,
      value: formData[name] || "",
      onChange: handleInputChange,
      disabled: isDisabled,
    };

    if (isSelect) {
      return (
        <TextField {...baseProps} id="outlined-select-currency" select>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    return <TextField {...baseProps} id="fullWidth" type={name === "age" ? "number" : "string"} />;
  };

  return (
    <>
      <div className="popup-container-inbody">
        {isLoading && <LoadingProgess />}
        {!isLoading && (
          <Box
            className="popup-form-inbody"
            component="form"
            sx={{
              "& > :not(style)": {
                m: 1,
                width: isPhoneWidth ? "70vw" : "55vw",
                paddingRight: "2%",
              },
            }}
            noValidate
            autoComplete="off"
            onSubmit={saveInbody}
          >
            <ErrorMessage message={message} setMessage={setMessage} />
            <div className="text-container">
              <div className="left-group-input">
                {renderTextField("Giới tính", "gender", formData.gender, false, true, GenderOption)}
                {renderTextField("Cân nặng (kg)", "weight", formData.weight)}
                {renderTextField("Vòng eo (cm)", "waist", formData.waist)}
                {renderTextField("TDEE (Tổng calo tiêu hao)", "tdee", formData.tdee, true)}
                {renderTextField("LBM (Khối lượng cơ không mỡ)", "lbm", formData.lbm, true)}
                {renderTextField("VFA (Mỡ nội tạng)", "vfa", formData.vfa, true)}
              </div>
              <div className="right-group-input">
                {renderTextField("Tuổi", "age", formData.age)}
                {renderTextField("Vòng cổ (cm)", "neck", formData.neck)}
                {renderTextField("Vòng bắp tay (cm)", "arm", formData.arm)}
                {renderTextField("BMR (Tỷ lệ trao đổi chất)", "bmr", formData.bmr, true)}
                {renderTextField("SMM (Tổng khối cơ bắp)", "smm", formData.smm, true)}
                {renderTextField("TBW (Tổng nước trong cơ thể)", "tbw", formData.tbw, true)}
                {renderTextField("WHtR (Tỷ lệ eo/chiều cao)", "whtr", formData.whtr, true)}
              </div>
              <div className="right-group-input">
                {renderTextField("Chiều cao (cm)", "height", formData.height)}
                {renderTextField("Vòng mông (cm)", "hip", formData.hip)}
                {renderTextField("Vòng đùi (cm)", "thigh", formData.thigh)}
                {renderTextField("BF% (Tỷ lệ mỡ)", "bf", formData.bf, true)}
                {renderTextField("FFMI (Chỉ số cơ không mỡ)", "ffmi", formData.ffmi, true)}
                {renderTextField("WHR (Tỷ lệ eo/mông)", "whr", formData.whr, true)}
              </div>
            </div>
            <Stack className="btn-control" spacing={2} direction="row" justifyContent="right">
              <Button variant="outlined" color="success" type="submit">
                Lưu thay đổi
              </Button>
              <Button variant="outlined" color="error" onClick={closeEditor}>
                Hủy thay đổi
              </Button>
            </Stack>
          </Box>
        )}
      </div>
    </>
  );
}

export default InBodyEditor;
