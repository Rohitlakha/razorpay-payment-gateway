const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

require("dotenv").config();

const limiter = require("./middleware/rateLimiter");

const app = express();

/* Security middleware */

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(limiter);

/* Serve SDK */

app.use("/sdk", express.static(path.join(__dirname, "public")));

/* Routes */

const createOrder = require("./routes/create-order");

const verifyPayment = require("./routes/verify-payment");

app.use("/create-order", createOrder);

app.use("/verify-payment", verifyPayment);

/* Health check */

app.get("/", (req, res) => {

  res.json({

    status: "Secure Razorpay Gateway Running"

  });

});

app.listen(process.env.PORT || 4343, () => {

  console.log("Secure Razorpay Gateway Running on port 4343");

});
