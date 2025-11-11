const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const schedule = require("node-schedule");
const auth = require("../middleware/auth");
const commonUtil = require("../commonUtils");

//-------------------------------- CONSTANTS --------------------------------//
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

//-------------------------------- INTERNAL FUNCTION --------------------------------//

/**
 * Schedule daily reminder email at 22:00 Asia/Ho_Chi_Minh time
 */
schedule.scheduleJob(
  { hour: 9, minute: 42, tz: "Asia/Ho_Chi_Minh" },
  async () => {
    const users = await User.find({ verifyMail: true });
    for (const user of users) {
      console.log(`Sending reminder email to ${user.email}`);
      await commonUtil.sendReminderEmail(user.email, user.userName);
    }
  }
);

/**
 * Create JWT token
 * @param {*} payload 
 * @returns 
 */
const _createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

/**
 * Get secure cookie options based on environment
 * @returns 
 */
const _getSecureCookieOptions = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  return {
    httpOnly: true,
    sameSite: isDevelopment ? "lax" : process.env.NODE_ENV === "production" && "none",
    secure: !isDevelopment && process.env.NODE_ENV === "production",
  };
};

//-------------------------------- ROUTES --------------------------------//

/** 
 * Get user data
 * @route GET /api/users
 * @header { token }
 */
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

/**
 * Register a new user
 * @route POST /api/users
 * @body { email, userName, password, passwordVerify, salaryDate, walletLife, walletInvest, walletSaving, walletFree, dailyBudget }
 */
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

/**
 * Login user
 * @route POST /api/users/login
 * @body { email, password }
 */
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

/**
 * Update user data
 * @route PUT /api/users
 * @header { token }
 * @body { walletLife, walletInvest, walletSaving, walletFree, salaryDate }
 */
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

/**
 * Get logged in user data
 * @route GET /api/users/loggedIn
 * @header { token }
 */
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

/**
 * Log out user
 * @route GET /api/users/logOut
 */
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

/**
 * Verify user email
 * @route GET /api/users/:token
 */
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

/**
 * Send reminder emails to all verified users
 * @route GET /api/reminders
 */
router.get("/sendReminder", auth, async (req, res) => {
  try {
    const users = await User.find({ verifyMail: true });
    for (const user of users) {
      console.log(`Sending reminder email to ${user.email}`);
      await commonUtil.sendReminderEmail(user.email, user.userName);
    }
    res.status(200).json({ success: true, message: "Reminders sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
