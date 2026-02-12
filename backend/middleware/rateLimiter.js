const rateLimit = require("express-rate-limit");


const limiter = rateLimit({

  /* Time window: 15 minutes */
  windowMs: 15 * 60 * 1000,


  /* Max requests per IP per window */
  max: 200,


  /* Standard headers */
  standardHeaders: true,


  /* Disable legacy headers */
  legacyHeaders: false,


  /* Custom message */
  message: {
    success: false,
    error: "Too many requests. Please try again after 15 minutes."
  },


  /* Skip successful payments from strict counting (optional safety) */
  skipSuccessfulRequests: false,


  /* Skip failed requests counting */
  skipFailedRequests: false

});


module.exports = limiter;
