const jwt = require("jsonwebtoken");
//ddd
function auth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ errorMessage: "Lỗi xác thực tài khoản! Hãy đăng nhập lại!" });

    const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = validatedUser.id;

    next();
  } catch (err) {
    return res.status(401).json({ errorMessage: "Lỗi xác thực tài khoản! Hãy đăng nhập lại!" });
  }
}

module.exports = auth;
