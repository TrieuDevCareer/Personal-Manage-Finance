/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from "react";
import AuthPage from "../../auth/authPage.js";
import Table from "../../misc/Table.js";
import LoadingProgess from "../../misc/loadingProgess.js";
import UserContext from "../../../context/UserContext.js";
import "./inbodyList.scss";

function IncomeList({ isCheck, setIsCheck, isCatalogPage }) {
  const [incomeListData, setIncomeListData] = useState();

  const { user } = useContext(UserContext);

  const aTitle = ["CHỈ SỐ", "NỘI DUNG", "VÙNG CHỈ SỐ AN TOÀN NAM", "VÙNG CHỈ SỐ AN TOÀN NỮ"];
  const aKeyItem = ["stt", "inBodyLstCode", "inBodyLstContent", "indicatorZoneMale", "indicatorZoneFemale"];
  const oRouter = {
    router: "incomelist",
    name: "Danh mục thu nhập",
  };

  async function getIncomeLists() {
    const incomeLists = [
      {
        "inBodyLstCode": "TDEE(Tổng calo tiêu hao)",
        "inBodyLstContent": "Tổng số calo bạn đốt cháy trong một ngày",
        "indicatorZoneMale": "",
        "indicatorZoneFemale": ""
      },
      {
        "inBodyLstCode": "BF % (Tỷ lệ mỡ)",
        "inBodyLstContent": "Đánh giá tình trạng béo phì và thành phần cơ thể",
        "indicatorZoneMale": "5% < 10-20% > 25%",
        "indicatorZoneFemale": "12% < 18-28% > 32%"
      },
      {
        "inBodyLstCode": "BMR(Tỷ lệ trao đổi chất)",
        "inBodyLstContent": "Số lượng calo duy trì các chức năng",
        "indicatorZoneMale": "",
        "indicatorZoneFemale": ""
      },
      {
        "inBodyLstCode": "SMM(Tổng khối cơ bắp)",
        "inBodyLstContent": "Tổng khối lượng cơ bắp",
        "indicatorZoneMale": "",
        "indicatorZoneFemale": ""
      },
      {
        "inBodyLstCode": "TBW(Tổng nước trong cơ thể)",
        "inBodyLstContent": "Tổng lượng nước trong cơ thể",
        "indicatorZoneMale": "... < 50-65% > ...",
        "indicatorZoneFemale": "... < 45-60% > ..."
      },
      {
        "inBodyLstCode": "VFA(Mỡ nội tạng)",
        "inBodyLstContent": "Liên quan đến nguy cơ bệnh tim mạch, tiểu đường,...",
        "indicatorZoneMale": "100-150 < 100cm2 > 150",
        "indicatorZoneFemale": "100-150 < 100cm2 > 150",
      },
      {
        "inBodyLstCode": "LBM(Khối lượng cơ không mỡ)",
        "inBodyLstContent": "đánh giá sức khỏe trao đổi chất",
        "indicatorZoneMale": "... < 50-65% > ...",
        "indicatorZoneFemale": "... < 45-60% > ..."
      },
      {
        "inBodyLstCode": "FFMI(Chỉ số cơ không mỡ)",
        "inBodyLstContent": "Đánh giá độ phát triển cơ bắp và sức khỏe trao đổi chất",
        "indicatorZoneMale": "22-23 < 18-21 > 25",
        "indicatorZoneFemale": "22 < 19-20 > ..."
      },
      {
        "inBodyLstCode": "WHR(Tỷ lệ eo / mông)",
        "inBodyLstContent": "Chỉ ra sự tích tụ mỡ vùng bụng, rủi ro sức khỏe hơn",
        "indicatorZoneMale": "0.9 - 1.0 < 0.9 > 1.0",
        "indicatorZoneFemale": "0.8-0.85 < 0.8 > 1.85",
      },
      {
        "inBodyLstCode": "WHtR(Tỷ lệ eo / chiều cao)",
        "inBodyLstContent": "Nguy cơ sức khỏe liên quan đến béo phì, bệnh tim mạch",
        "indicatorZoneMale": " 0.5 - 0.6 < 0.5> 0.6",
        "indicatorZoneFemale": " 0.5 - 0.6 < 0.5> 0.6",
      }
    ]
    setIncomeListData(incomeLists);
  }

  useEffect(() => {
    if (!user) setIncomeListData();
    else getIncomeLists();
  }, [user]);
  return (
    <>
      {user && !incomeListData && !isCatalogPage && <LoadingProgess />}
      {user && incomeListData && (
        <div className="incomeList-container">
          <div className="title-container">
            {!isCatalogPage && <div className="title-incomeList">DANH MỤC CHỈ SỐ CƠ THỂ</div>}
          </div>
          <>
            <Table
              oData={incomeListData}
              aKeyItem={aKeyItem}
              aTitle={aTitle}
              rowsPerPage={10}
              isCheck={isCheck}
              setIsCheck={setIsCheck}
              editModel={""}
              oRouter={oRouter}
              isCatalogPage={isCatalogPage}
              colorTitle={"#0ecb74"}
              navFooter={isCatalogPage ? "isCatalogPage" : "/inbody"}
              titleFooter={"DANH SÁCH CHỈ SỐ CƠ THỂ"}
            />
          </>
        </div>
      )}

      {user === null && <AuthPage />}
    </>
  );
}

export default IncomeList;
