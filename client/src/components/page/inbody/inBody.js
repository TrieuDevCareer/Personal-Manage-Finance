/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import Table from "../../misc/Table.js";
import InBodyEditor from "./inBodyEditor.js";
import AuthPage from "../../auth/authPage.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import UserContext from "../../../context/UserContext.js";
import domain from "../../../util/domain.js";
import "./inBody.scss";

function InBody({ isCheck, setIsCheck }) {
  const [inbodyMetricData, setInbodyMetricData] = useState();
  const [inbodyMetricEditorOpen, setInbodyMetricEditorOpen] = useState(false);
  const [editInbodyMetricData, setEditInbodyMetricData] = useState(null);
  const { user } = useContext(UserContext);

  const aTitle = [
    "Cân nặng(kg)",
    "Vòng eo(cm)",
    "Vòng mông(cm)",
    "Vòng cổ(cm)",
    "Vòng bắp tay(cm)",
    "Vòng đùi(cm)",
    "TDEE(Tổng calo tiêu hao)",
    "BMR(Tỷ lệ trao đổi chất)",
    "SMM(Tổng khối cơ bắp)",
    "TBW(Tổng nước trong cơ thể)",
    "BF % (Tỷ lệ mỡ)",
    "VFA(Mỡ nội tạng)",
    "LBM(Khối lượng cơ không mỡ)",
    "FFMI(Chỉ số cơ không mỡ)",
    "WHR(Tỷ lệ eo / mông)",
    "WHtR(Tỷ lệ eo / chiều cao)",
  ];
  const aKeyItem = [
    "stt",
    "weight",
    "waist",
    "hip",
    "neck",
    "arm",
    "thigh",
    "tdee",
    "bmr",
    "smm",
    "tbw",
    "bf",
    "vfa",
    "lbm",
    "ffmi",
    "whr",
    "whtr"
  ];

  const oRouter = {
    router: "bodyMetricsRouter",
    name: "Chi Số Cơ Thể",
  };

  function editInbodyMetric(inbodyMetricData) {
    setEditInbodyMetricData(inbodyMetricData);
    setInbodyMetricEditorOpen(true);
  }

  const transformDecimalFields = (data) => {
    const decimalFields = [
      'bf', 'vfa', 'lbm', 'smm', 'tbw', 'bmr',
      'tdee', 'ffmi', 'whr', 'whtr', 'weight',
      'height', 'waist', 'hip', 'neck', 'arm', 'thigh'
    ];

    return data.map(item => {
      const transformedItem = { ...item };

      decimalFields.forEach(field => {
        if (transformedItem[field]?.$numberDecimal) {
          transformedItem[field] = transformedItem[field].$numberDecimal;
        }
      });

      return transformedItem;
    });
  };

  // Hàm chính đã được refactor
  async function getInbodyMetrics() {
    const response = await Axios.get(`${domain}/inbodyMetric/`);
    const transformedData = transformDecimalFields(response.data);
    setInbodyMetricData(transformedData);
  }

  useEffect(() => {
    if (!user) setInbodyMetricData();
    else {
      getInbodyMetrics();
    }
  }, [user]);
  return (
    <>
      {user && !inbodyMetricData && <LoadingProgess />}
      {user && inbodyMetricData && (
        <div className="inbodyMetric-container">
          <div className="title-inbodyMetric">DANH SÁCH CHỈ SỐ CƠ THỂ</div>
          {inbodyMetricEditorOpen ? (
            <InBodyEditor
              getInbodyMetrics={getInbodyMetrics}
              setInbodyMetricEditorOpen={setInbodyMetricEditorOpen}
              editInbodyMetricData={editInbodyMetricData}
            />
          ) : (
            <>
              <Table
                oData={inbodyMetricData}
                aKeyItem={aKeyItem}
                aTitle={aTitle}
                rowsPerPage={8}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                editModel={editInbodyMetric}
                oRouter={oRouter}
                colorTitle={"#0ecb74"}
                navFooter={"/inbodyList"}
                titleFooter={"DANH MỤC CHỈ SỐ CƠ THỂ"}
              />
            </>
          )}
        </div>
      )}
      {user === null && <AuthPage />}
    </>
  );
}

export default InBody;
