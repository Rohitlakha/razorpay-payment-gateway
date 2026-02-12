const Razorpay = require("razorpay");

require("dotenv").config();


/*
========================================
Validate environment variables
========================================
*/

if (
  !process.env.RAZORPAY_KEY_ID ||
  !process.env.RAZORPAY_KEY_SECRET
) {

  console.error(
    "❌ Razorpay keys missing in .env"
  );

  process.exit(1);

}


/*
========================================
Create Razorpay instance
========================================
*/

const razorpayInstance =
new Razorpay({

  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_KEY_SECRET

});


/*
========================================
Export instance
========================================
*/

module.exports =
razorpayInstance;
