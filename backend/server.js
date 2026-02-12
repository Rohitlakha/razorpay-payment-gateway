const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

require("dotenv").config();

const limiter = require("./middleware/rateLimiter");

const app = express();

/* SECURITY */

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
  })
);

app.use(cors());
app.use(express.json());
app.use(limiter);

/* SERVE SDK */

app.use("/sdk", express.static(path.join(__dirname, "public")));

/* ROUTES */

const createOrder = require("./routes/create-order");
const verifyPayment = require("./routes/verify-payment");

app.use("/create-order", createOrder);
app.use("/verify-payment", verifyPayment);

/* HEALTH CHECK */

app.get("/", (req, res) => {

  res.json({
    status: "Gateway Running",
    sdk: process.env.BASE_URL + "/sdk/razorpay-sdk.js"
  });

});

/* START SERVER */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log("===================================");
  console.log("Gateway Running");
  console.log("http://localhost:" + PORT);
  console.log("===================================");

});
