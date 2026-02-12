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


/* Allowed origins */
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  "https://yourdomain.com"
];


/* CORS configuration */
app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {

        return callback(null, true);

      }

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


/* Serve SDK */
app.use(
  "/sdk",
  express.static(path.join(__dirname, "public"))
);


/* Routes */
app.use("/create-order",
  require("./routes/create-order"));

app.use("/verify-payment",
  require("./routes/verify-payment"));


/* Health check */
app.get("/", (req, res) => {

  res.json({
    status: "Gateway Running",
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
  console.log("=================================");

});
