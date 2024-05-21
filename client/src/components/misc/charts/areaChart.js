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
  data = [
    {
      name: 0,
      "Nguồn sống": 0,
      "Tiết kiệm": 0,
      "Đầu tư": 0,
      "Tự do": 0,
      SOContent: "Điểm bắt đầu",
      TDContent: "Điểm bắt đầu",
      TKContent: "Điểm bắt đầu",
      DTContent: "Điểm bắt đầu",
    },
  ].concat(data);
  data = data.concat([
    {
      name: data.length,
      "Nguồn sống": 0,
      "Tiết kiệm": 0,
      "Đầu tư": 0,
      "Tự do": 0,
      SOContent: "Điểm kết thúc",
      TDContent: "Điểm kết thúc",
      TKContent: "Điểm kết thúc",
      DTContent: "Điểm kết thúc",
    },
  ]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          {pageChart !== "expense" && (
            <>
              {" "}
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

    return null;
  };

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
        <Area type="monotone" dataKey="Nguồn sống" stackId="2" stroke="#8884d8" fill="#8884d8" />;
        <Area type="monotone" dataKey="Tự do" stackId="2" stroke="#ffc658" fill="#ffc658" />;
        {pageChart !== "expense" && (
          <>
            <Area type="monotone" dataKey="Đầu tư" stackId="2" stroke="#ff007f" fill="#ff007f" />;
            <Area type="monotone" dataKey="Tiết kiệm" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
            ;
          </>
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
export default AreaChartType;
