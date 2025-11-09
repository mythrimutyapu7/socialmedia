const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ msg: "No token, authorization denied" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ msg: "Invalid token format" });

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ support both "id" and "_id" token formats
    req.user = {
      id: decoded.id || decoded._id,
      name: decoded.name || decoded.email || "User",
    };

    next();
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
