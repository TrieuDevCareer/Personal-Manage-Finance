// import nessesary modules for server
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// setup express server
dotenv.config();
const app = express();
app.use(express.json());

// apply CORS's client access permission
app.use(
  cors({
    origin: ["http://localhost:3000", "https://snippet-manage.netlify.app"],
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
app.use("/dictionaryList", require("./routers/distionaryListRouter"));
app.use("/expense", require("./routers/expenseRouter"));
app.use("/income", require("./routers/incomeRouter"));
app.use("/invesment", require("./routers/investmentRouter"));
app.use("/saving", require("./routers/savingRouter"));

// setup + connect to MongoDB
try {
  mongoose.connect(process.env.MDB_CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
} catch (error) {
  return console.error(err);
}
