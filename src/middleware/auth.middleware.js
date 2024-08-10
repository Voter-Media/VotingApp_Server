import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({
      ok: false,
      message: "No token provided, authorization denied",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        ok: false,
        message: "Token is not valid",
      });
    }

    req.user = user;
    next();
  });
};
