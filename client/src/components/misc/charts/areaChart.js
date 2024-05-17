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

function AreaChartType({ data, contentKey, moneyKey, nameKey, color }) {
  data = [{ inLstContent: "", incMoney: 0 }].concat(data);
  data = data.concat([{ inLstContent: "", incMoney: 0 }]);
  data.map((item) => {
    return (item[nameKey] = item[moneyKey]);
  });
  console.log(data);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis dataKey={contentKey} />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey={nameKey} stackId="2" stroke={color} fill={color} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
export default AreaChartType;
