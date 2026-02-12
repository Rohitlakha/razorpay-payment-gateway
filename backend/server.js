const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

require("dotenv").config();

const limiter = require("./middleware/rateLimiter");

const app = express();

/* Hide Express fingerprint */
app.disable("x-powered-by");


/* Security headers */
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
  })
);


/*
====================================================
DYNAMIC CORS CONFIGURATION
Supports:
✔ Any localhost project
✔ Any student project
✔ Flask, MERN, HTML, React
✔ Render production deployment
====================================================
*/

app.use(
  cors({

    origin: function(origin, callback) {

      /* Allow requests without origin (Postman, mobile apps) */
      if (!origin) return callback(null, true);


      /* Allow ALL localhost ports */
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }


      /* Allow Render deployment domain */
      if (
        origin.includes("onrender.com") ||
        origin === process.env.FRONTEND_URL
      ) {
        return callback(null, true);
      }


      /* Block others */
      console.warn("Blocked by CORS:", origin);

      return callback(null, false);

    },

    methods: ["GET", "POST", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true

  })
);


/* Rate limiter */
app.use(limiter);


/* JSON parser */
app.use(express.json());


/* Serve SDK for students */
app.use(
  "/sdk",
  express.static(path.join(__dirname, "public"))
);


/* Payment routes */
app.use(
  "/create-order",
  require("./routes/create-order")
);

app.use(
  "/verify-payment",
  require("./routes/verify-payment")
);


/* Health check */
app.get("/", (req, res) => {

  res.json({
    status: "Gateway Running",
    version: "1.0.0",
    sdk: process.env.BASE_URL
      ? process.env.BASE_URL + "/sdk/razorpay-sdk.js"
      : "http://localhost:5000/sdk/razorpay-sdk.js",
    time: new Date()
  });

});


/* Global error handler */
app.use((err, req, res, next) => {

  console.error("Server Error:", err);

  res.status(500).json({
    error: "Internal server error"
  });

});


/* Start server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log("=================================");
  console.log("Gateway running on port:", PORT);
  console.log("SDK URL:", `http://localhost:${PORT}/sdk/razorpay-sdk.js`);
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log("=================================");

});
