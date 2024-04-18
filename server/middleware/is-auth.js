const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  let authHeader = req.header("Authorization");
  let token;
  // let token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjExLCJpYXQiOjE2OTc3NDQ4MTMsImV4cCI6MTY5Nzc4MDgxM30.A1gp8BR0T7CGZtQZaWRFItAKKF0wc2z7ji1vbsBaIqU";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7, authHeader.length).trim();
    // Now use this token for your validation logic
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1); // Remove the quotes from both ends of the string
    }
  } else {
    res.status(401).send({ message: "No token provided." });
  }
  if (!token) {
    return res.status(403).json({
      errors: [
        {
          message: "Unauthorized",
        },
      ],
    });
  }

  // token = token.split(" ")[1];

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUser._id.toString();
    next();
  } catch (error) {
    return res.status(403).json({
      errors: [
        {
          message: error.message,
        },
      ],
    });
  }
};
