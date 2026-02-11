const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

require("dotenv").config();

const limiter = require("./middleware/rateLimiter");

const app = express();

/* ====================================
   SECURITY MIDDLEWARE
==================================== */

// Fix SDK blocking issue
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false
  })
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json());

app.use(limiter);

/* ====================================
   SERVE SDK FILE
==================================== */

app.use(
  "/sdk",
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
  })
);

/* ====================================
   ROUTES
==================================== */

const createOrder = require("./routes/create-order");
const verifyPayment = require("./routes/verify-payment");

app.use("/create-order", createOrder);
app.use("/verify-payment", verifyPayment);

/* ====================================
   HEALTH CHECK
==================================== */

app.get("/", (req, res) => {

  res.json({
    status: "Razorpay Gateway Running",
    sdk: `http://localhost:${process.env.PORT}/sdk/razorpay-sdk.js`
  });

});

/* ====================================
   START SERVER
==================================== */

const PORT = process.env.PORT || 4343;

app.listen(PORT, () => {

  console.log("===================================");
  console.log("Razorpay Gateway Running");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`SDK: http://localhost:${PORT}/sdk/razorpay-sdk.js`);
  console.log("===================================");

});
