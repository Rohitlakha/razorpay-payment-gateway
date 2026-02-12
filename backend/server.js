const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

require("dotenv").config();

const limiter = require("./middleware/rateLimiter");

const app = express();


/*
========================================
PORT & BASE URL
========================================
*/

const PORT = process.env.PORT || 5000;

const BASE_URL =
  process.env.BASE_URL ||
  `http://localhost:${PORT}`;


/*
========================================
Trust proxy (REQUIRED for Render)
========================================
*/

app.set("trust proxy", 1);


/*
========================================
Hide Express fingerprint
========================================
*/

app.disable("x-powered-by");


/*
========================================
Security headers
========================================
*/

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
========================================
Dynamic CORS configuration
Supports ALL student projects
========================================
*/

app.use(
  cors({

    origin: function(origin, callback) {

      /* Allow Postman / mobile */
      if (!origin)
        return callback(null, true);


      /* Allow ALL localhost ports */
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }


      /* Allow Render frontend */
      if (
        origin.includes("onrender.com") ||
        origin === process.env.FRONTEND_URL
      ) {
        return callback(null, true);
      }


      console.warn("Blocked by CORS:", origin);

      return callback(null, false);

    },

    methods: ["GET", "POST", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ],

    credentials: true

  })
);


/*
========================================
Rate limiter
========================================
*/

app.use(limiter);


/*
========================================
JSON parser
========================================
*/

app.use(express.json());


/*
========================================
Request logger
========================================
*/

app.use((req, res, next) => {

  console.log(
    `[${new Date().toISOString()}]`,
    req.method,
    req.url,
    req.ip
  );

  next();

});


/*
========================================
Serve SDK
========================================
*/

app.use(
  "/sdk",
  express.static(
    path.join(__dirname, "public")
  )
);


/*
========================================
Routes
========================================
*/

app.use(
  "/create-order",
  require("./routes/create-order")
);

app.use(
  "/verify-payment",
  require("./routes/verify-payment")
);


/*
========================================
Health check
========================================
*/

app.get("/", (req, res) => {

  res.json({

    status: "Gateway Running",

    version: "1.0.0",

    sdk:
      BASE_URL +
      "/sdk/razorpay-sdk.js",

    time:
      new Date()

  });

});


/*
========================================
Global error handler
========================================
*/

app.use(
  (err, req, res, next) => {

    console.error(
      "Server Error:",
      err
    );

    res.status(500).json({

      success: false,

      error:
        "Internal server error"

    });

  }
);


/*
========================================
Start server
========================================
*/

app.listen(PORT, () => {

  console.log(
    "================================="
  );

  console.log(
    "Gateway running on:",
    BASE_URL
  );

  console.log(
    "SDK URL:",
    BASE_URL +
    "/sdk/razorpay-sdk.js"
  );

  console.log(
    "Environment:",
    process.env.NODE_ENV ||
    "development"
  );

  console.log(
    "================================="
  );

});
