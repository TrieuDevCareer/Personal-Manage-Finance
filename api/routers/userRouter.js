const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register user

router.post("/", async (req, res) => {
  try {
    const {
      email,
      userName,
      password,
      passwordVerify,
      walletLife,
      walletInvest,
      walletSaving,
      walletFree,
    } = req.body;
    // validation

    if (!email || !userName || !password || !passwordVerify)
      return res.status(400).json({
        errorMessage: "Vui lòng điền đủ thông tin!",
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
      walletLife: walletLife ? walletLife : 0,
      walletInvest: walletInvest ? walletInvest : 0,
      walletSaving: walletSaving ? walletSaving : 0,
      walletFree: walletFree ? walletFree : 0,
    });

    const savedUser = await newUser.save();

    // create a JWT token

    const token = jwt.sign(
      {
        id: savedUser._id,
        userName,
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

    // create a JWT token

    const token = jwt.sign(
      {
        id: existingUser._id,
        userName: existingUser.userName,
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

module.exports = router;
