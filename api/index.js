// import nessesary modules for server
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

import { User } from "./models/userModel";
import commonUtil from "./commonUtils";

// setup express server
dotenv.config();
const app = express();
app.use(express.json());

// apply CORS's client access permission
app.use(
  cors({
    origin: ["http://localhost:3000", "https://justmeapp.netlify.app"],
    credentials: true,
  })
);
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// setup and access to Router API
app.use("/auth", require("./routers/userRouter"));
app.use("/banklist", require("./routers/bankListRouter"));
app.use("/coinlist", require("./routers/coinListRouter"));
app.use("/incomelist", require("./routers/incomeListRouter"));
app.use("/expenselist", require("./routers/expenseListRouter"));
app.use("/expense", require("./routers/expenseRouter"));
app.use("/income", require("./routers/incomeRouter"));
app.use("/investment", require("./routers/investmentRouter"));
app.use("/saving", require("./routers/savingRouter"));
app.use("/inbodymetric", require("./routers/bodyMetricsRouter"));

app.use("/api/sendReminder", async (req, res) => {
  try {
    await commonUtil.sendReminderEmail('lehaitrieu48@gmail.com', "Test User");
    res.status(200).json({ success: true, message: "Reminders sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// setup + connect to MongoDB
try {
  mongoose.connect(process.env.MDB_CONNECT_STRING);
  console.log("Connected to MongoDB");
} catch (error) {
  return console.error(err);
}
