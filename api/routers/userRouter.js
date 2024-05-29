const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const commonUtils = require("../commonUtils");

router.get("/", auth, async (req, res) => {
  const aResultData = await User.findById(req.user);
  res.json(aResultData);
});
// register user
router.post("/", async (req, res) => {
  try {
    const {
      email,
      userName,
      password,
      passwordVerify,
      salaryDate,
      walletLife,
      walletInvest,
      walletSaving,
      walletFree,
    } = req.body;
    // validation

    if (!email || !userName || !password || !passwordVerify || !salaryDate)
      return res.status(400).json({
        errorMessage: "Vui lòng điền đủ thông tin!",
      });
    if (parseInt(salaryDate) < 0 || parseInt(salaryDate) > 31)
      return res.status(400).json({
        errorMessage: "Ngày nhận lương phải nằm trong tháng, vui lòng nhập lại!",
      });

    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "Mật khẩu phải ít nhất 6 kỳ tự!",
      });

    if (password !== passwordVerify)
      return res.status(400).json({
        errorMessage: "Mật khẩu xác thực chưa trùng khớp. Hãy nhập giống mật khẩu bạn đã dặt!",
      });
    // verify: none account exist for this email

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        errorMessage: `Tài khoản với email ${email} đã tồn tại!`,
      });
    }
    // hash the password

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // save the user in the database

    const newUser = new User({
      email,
      userName,
      passwordHash,
      salaryDate: parseInt(salaryDate),
      walletLife: walletLife ? walletLife : 0,
      walletInvest: walletInvest ? walletInvest : 0,
      walletSaving: walletSaving ? walletSaving : 0,
      walletFree: walletFree ? walletFree : 0,
      role: 0,
    });

    const savedUser = await newUser.save();

    // create a JWT token

    const token = jwt.sign(
      {
        id: savedUser._id,
      },
      process.env.JWT_SECRET
    );
    const link = `${req.protocol}://${req.get("host")}/auth/${token}`;
    await commonUtils.verifyMail(email, link, userName);
    res.json(
      `Chúng tôi đã gửi email ${email} xác thực đến bạn, hãy kiểm tra và xác thực tài khoản của mình!`
    );
  } catch (error) {
    res.status(500).send();
  }
});

// login user

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation

    if (!email || !password)
      return res.status(400).json({
        errorMessage: "Nhập đầy đủ thông tin đăng nhập để vào hệ thống!",
      });

    // get user account

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json({
        errorMessage: "Email hoặc mật khẩu sai! Vui lòng thử lại!",
      });

    const correctPassword = await bcrypt.compare(password, existingUser.passwordHash);

    if (!correctPassword)
      return res.status(401).json({
        errorMessage: "Email hoặc mật khẩu sai! Vui lòng thử lại!",
      });

    if (!existingUser.verifyMail)
      return res.status(400).json({
        errorMessage: `Tài khoản chưa được xác thực. Vui lòng check mail ${email} để kích hoạt tài khoản!`,
      });

    // create a JWT token

    const token = jwt.sign(
      {
        id: existingUser._id,
        userName: existingUser.userName,
        salaryDate: existingUser.salaryDate,
        walletLife: existingUser.walletLife,
        walletInvest: existingUser.walletInvest,
        walletSaving: existingUser.walletSaving,
        walletFree: existingUser.walletFree,
        role: existingUser.role,
      },
      process.env.JWT_SECRET
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === "development"
            ? "lax"
            : process.env.NODE_ENV === "production" && "none",
        secure:
          process.env.NODE_ENV === "development"
            ? false
            : process.env.NODE_ENV === "production" && true,
      })
      .send();
  } catch (err) {
    res.status(500).send();
  }
});

// get userID after login

router.get("/loggedIn", (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.json(null);

    const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
    res.json(validatedUser);
  } catch (err) {
    return res.json(null);
  }
});

// logout user

router.get("/logOut", (req, res) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === "development"
            ? "lax"
            : process.env.NODE_ENV === "production" && "none",
        secure:
          process.env.NODE_ENV === "development"
            ? false
            : process.env.NODE_ENV === "production" && true,
        expires: new Date(0),
      })
      .send();
  } catch (err) {
    return res.json(null);
  }
});

router.get("/:token", async (req, res) => {
  const token = req.params.token;
  const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
  await User.updateOne({ _id: validatedUser.id }, { $set: { verifyMail: true } });
  res.json(
    "Đã xác thực tài khoản thành công! Hãy tắt trang này và đăng nhập để sử dụng ứng dụng của chúng tôi"
  );
});

module.exports = router;
