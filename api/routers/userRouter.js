const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const schedule = require("node-schedule");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

// Constants
const ERRORS = {
  MISSING_FIELDS: "Vui lòng điền đủ thông tin!",
  INVALID_SALARY_DATE: "Ngày nhận lương phải nằm trong tháng, vui lòng nhập lại!",
  SHORT_PASSWORD: "Mật khẩu phải ít nhất 6 kỳ tự!",
  PASSWORD_MISMATCH: "Mật khẩu xác thực chưa trùng khớp. Hãy nhập giống mật khẩu bạn đã dặt!",
  EMAIL_EXISTS: (email) => `Tài khoản với email ${email} đã tồn tại!`,
  INVALID_CREDENTIALS: "Email hoặc mật khẩu sai! Vui lòng thử lại!",
  UNVERIFIED_ACCOUNT: (email) =>
    `Tài khoản chưa được xác thực. Vui lòng check mail ${email} để kích hoạt tài khoản!`,
  LOGIN_REQUIRED: "Nhập đầy đủ thông tin đăng nhập để vào hệ thống!",
};

schedule.scheduleJob(
  { hour: 11, minute: 32, tz: "Asia/Ho_Chi_Minh" },
  async () => {
    const users = await User.find({ verifyMail: true });
    for (const user of users) {
      await commonUtil.sendReminderEmail(user.email, user.userName);
    }
  }
);
// Helper functions
const _createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const _getSecureCookieOptions = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  return {
    httpOnly: true,
    sameSite: isDevelopment ? "lax" : process.env.NODE_ENV === "production" && "none",
    secure: !isDevelopment && process.env.NODE_ENV === "production",
  };
};

// const _calculateWalletAdjustment = (user) => {
//   const day = new Date().getDate();
//   let daysLeft = 0;
//   const now = new Date();
//   const year = now.getFullYear();
//   const month = now.getMonth() + 1;
//   const daysInMonth = new Date(year, month, 0).getDate();

//   if (user.salaryDate > day) {
//     daysLeft = user.salaryDate - day;
//   } else {
//     daysLeft = daysInMonth - day + user.salaryDate;
//   }

//   const adjustment = user.walletLife - user.dailyBudget * daysLeft;
//   return adjustment > 0 ? adjustment : 0;
// };

// Routes
// Get user data
router.get("/", auth, async (req, res) => {
  try {
    const userData = await User.findById(req.user);
    if (!userData) {
      return res.status(404).json({ errorMessage: "User not found" });
    }
    res.json(userData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

// Register user
router.post("/", async (req, res) => {
  try {
    const {
      email,
      userName,
      password,
      passwordVerify,
      salaryDate,
      walletLife = 0,
      walletInvest = 0,
      walletSaving = 0,
      walletFree = 0,
      dailyBudget = 0,
    } = req.body;

    // Validation
    if (!email || !userName || !password || !passwordVerify || !salaryDate) {
      return res.status(400).json({ errorMessage: ERRORS.MISSING_FIELDS });
    }

    const salaryDateNum = parseInt(salaryDate);
    if (salaryDateNum < 1 || salaryDateNum > 31) {
      return res.status(400).json({ errorMessage: ERRORS.INVALID_SALARY_DATE });
    }

    if (password.length < 6) {
      return res.status(400).json({ errorMessage: ERRORS.SHORT_PASSWORD });
    }

    if (password !== passwordVerify) {
      return res.status(400).json({ errorMessage: ERRORS.PASSWORD_MISMATCH });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errorMessage: ERRORS.EMAIL_EXISTS(email) });
    }

    // Hash password and create user
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      userName,
      passwordHash,
      salaryDate: salaryDateNum,
      dailyBudget,
      walletLife,
      walletInvest,
      walletSaving,
      walletFree,
      role: 0,
      verifyMail: false,
    });

    const savedUser = await newUser.save();

    // Send verification email
    const token = _createToken({
      id: savedUser._id,
    });
    const verificationLink = `${req.protocol}://${req.get("host")}/auth/${token}`;
    await commonUtil.sendVerificationEmail(email, verificationLink, userName);

    res.json(
      `Chúng tôi đã gửi email ${email} xác thực đến bạn, hãy kiểm tra và xác thực tài khoản của mình!`
    );
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ errorMessage: ERRORS.LOGIN_REQUIRED });
    }

    // Authentication
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ errorMessage: ERRORS.INVALID_CREDENTIALS });
    }

    const correctPassword = await bcrypt.compare(password, user.passwordHash);
    if (!correctPassword) {
      return res.status(401).json({ errorMessage: ERRORS.INVALID_CREDENTIALS });
    }

    if (!user.verifyMail) {
      return res.status(400).json({ errorMessage: ERRORS.UNVERIFIED_ACCOUNT(email) });
    }

    // Calculate wallet adjustments
    // const walletAdjustment = _calculateWalletAdjustment(user);

    // if (walletAdjustment > 0) {
    //   await User.updateOne(
    //     { _id: user._id },
    //     {
    //       $inc: {
    //         walletFree: walletAdjustment,
    //         walletLife: -walletAdjustment,
    //       },
    //     }
    //   );
    // }

    // Create JWT token with user data
    const token = _createToken({
      id: user._id,
      userName: user.userName,
      dailyBudget: user.dailyBudget,
      salaryDate: user.salaryDate,
      walletLife: user.walletLife,
      walletInvest: user.walletInvest,
      walletSaving: user.walletSaving,
      walletFree: user.walletFree,
      role: user.role,
    });

    // Set cookie and send response
    res.cookie("token", token, _getSecureCookieOptions()).send();
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

// Update user data
router.put("/", auth, async (req, res) => {
  try {
    const { walletLife, walletInvest, walletSaving, walletFree, salaryDate } = req.body;

    const updateData = {
      walletLife,
      walletInvest,
      walletSaving,
      walletFree,
      salaryDate,
    };

    const userId = req.user;
    const updateResult = await commonUtil.updateData(
      req,
      res,
      updateData,
      User,
      userId,
      "Thông tin"
    );

    if (updateResult.status === 200) {
      res.json(updateResult.message);
    } else {
      res.status(400).json({ errorMessage: updateResult.message });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

// Check logged in status
router.get("/loggedIn", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(null);

    const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
    res.json(validatedUser);
  } catch (error) {
    return res.json(null);
  }
});

// Logout user
router.get("/logOut", (req, res) => {
  try {
    const cookieOptions = {
      ..._getSecureCookieOptions(),
      expires: new Date(0),
    };

    res.cookie("token", "", cookieOptions).send();
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
});

// Verify email
router.get("/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
    await User.updateOne({ _id: validatedUser.id }, { $set: { verifyMail: true } });
    res.json(
      "Đã xác thực tài khoản thành công! Hãy tắt trang này và đăng nhập để sử dụng ứng dụng của chúng tôi"
    );
  } catch (error) {
    res.status(400).json({ errorMessage: "Invalid or expired verification token" });
  }
});

module.exports = router;
