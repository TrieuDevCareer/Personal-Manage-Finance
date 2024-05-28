import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./areaChart.scss";

function AreaChartType({ data, pageChart }) {
  const frsPoint = [];
  const lstPoint = [];
  switch (pageChart) {
    case "income":
      frsPoint.push({
        name: 0,
        "Nguồn sống": 0,
        "Tiết kiệm": 0,
        "Đầu tư": 0,
        "Tự do": 0,
        SOContent: "Điểm bắt đầu",
        TDContent: "Điểm bắt đầu",
        TKContent: "Điểm bắt đầu",
        DTContent: "Điểm bắt đầu",
      });
      lstPoint.push({
        name: data.length,
        "Nguồn sống": 0,
        "Tiết kiệm": 0,
        "Đầu tư": 0,
        "Tự do": 0,
        SOContent: "Điểm kết thúc",
        TDContent: "Điểm kết thúc",
        TKContent: "Điểm kết thúc",
        DTContent: "Điểm kết thúc",
      });
      break;
    case "expense":
      frsPoint.push({
        name: 0,
        "Nguồn sống": 0,
        "Tự do": 0,
        SOContent: "Điểm bắt đầu",
        TDContent: "Điểm bắt đầu",
      });
      lstPoint.push({
        name: data.length,
        "Nguồn sống": 0,
        "Tự do": 0,
        SOContent: "Điểm kết thúc",
        TDContent: "Điểm kết thúc",
      });
      break;
  }
  if (pageChart !== "saving" && pageChart !== "invest") {
    data = frsPoint.concat(data);
    data = data.concat(lstPoint);
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      switch (pageChart) {
        case "saving":
          return (
            <div className="custom-tooltip">
              <div className="custom-tooltip">
                {payload.map((item, i) => {
                  if (i !== 0) {
                    return (
                      <>
                        <div
                          className="desc SO"
                          style={{ color: `${payload[payload.length - i].stroke}` }}
                        >
                          {"Ngân hàng " +
                            payload[payload.length - i].dataKey +
                            ": " +
                            payload[payload.length - i].payload[
                              payload[payload.length - i].dataKey
                            ].toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                            })}
                        </div>
                      </>
                    );
                  }
                })}
              </div>
            </div>
          );
        case "invest":
          return (
            <div className="custom-tooltip">
              <div className="custom-tooltip">
                {payload.map((_, i) => {
                  if (i !== 0 && pageChart === "saving") {
                    return (
                      <>
                        <div
                          className="desc SO"
                          style={{ color: `${payload[payload.length - i].stroke}` }}
                        >
                          {"Ngân hàng " +
                            payload[payload.length - i].dataKey +
                            ": " +
                            payload[payload.length - i].payload[
                              payload[payload.length - i].dataKey
                            ].toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                            })}
                        </div>
                      </>
                    );
                  } else if (i !== 0 && pageChart === "invest") {
                    return (
                      <>
                        <div
                          className="desc SO"
                          style={{ color: `${payload[payload.length - i].stroke}` }}
                        >
                          {"Đồng coin " +
                            payload[payload.length - i].dataKey +
                            ": " +
                            payload[payload.length - i].payload[
                              payload[payload.length - i].dataKey
                            ].toLocaleString("it-IT", {
                              style: "currency",
                              currency: "VND",
                            })}
                        </div>
                      </>
                    );
                  }
                  return;
                })}
              </div>
            </div>
          );
        default:
          return (
            <div className="custom-tooltip">
              {pageChart !== "expense" && (
                <>
                  <div className="desc TK">
                    {payload[3].dataKey +
                      " - " +
                      data[label].TKContent +
                      ": " +
                      payload[3].value.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                  </div>
                  <div className="desc DT">
                    {payload[2].dataKey +
                      "  - " +
                      data[label].DTContent +
                      ": " +
                      payload[2].value.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                  </div>
                </>
              )}
              <div className="desc TD">
                {payload[1].dataKey +
                  " - " +
                  data[label].TDContent +
                  ": " +
                  payload[1].value.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
              </div>
              <div className="desc SO">
                {payload[0].dataKey +
                  " - " +
                  data[label].SOContent +
                  ": " +
                  payload[0].value.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
              </div>
            </div>
          );
      }
    }

    return null;
  };
  function renderAreaItem() {
    if (data.length > 0) {
      const a = ["#8884d8", "#ffc658", "#ff007f", "#82ca9d"];
      return Object.keys(data[0]).map((item, i) => {
        return (
          <>
            <Area
              type="monotone"
              dataKey={item}
              stackId="2"
              stroke={a[(i + 1) % a.length]}
              fill={a[(i + 1) % a.length]}
            />
          </>
        );
      });
    }
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
    >
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <>
          {pageChart === "income" && (
            <>
              <Area
                type="monotone"
                dataKey="Nguồn sống"
                stackId="2"
                stroke="#8884d8"
                fill="#8884d8"
              />
              ;
              <Area type="monotone" dataKey="Tự do" stackId="2" stroke="#ffc658" fill="#ffc658" />
              ;
              <Area type="monotone" dataKey="Đầu tư" stackId="2" stroke="#ff007f" fill="#ff007f" />
              ;
              <Area
                type="monotone"
                dataKey="Tiết kiệm"
                stackId="2"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
            </>
          )}
          {pageChart === "expense" && (
            <>
              <Area
                type="monotone"
                dataKey="Nguồn sống"
                stackId="2"
                stroke="#8884d8"
                fill="#8884d8"
              />
              ;
              <Area type="monotone" dataKey="Tự do" stackId="2" stroke="#ffc658" fill="#ffc658" />;
            </>
          )}
          {pageChart === "saving" && renderAreaItem()}
          {pageChart === "invest" && renderAreaItem()}
        </>
      </AreaChart>
    </ResponsiveContainer>
  );
}
export default AreaChartType;
