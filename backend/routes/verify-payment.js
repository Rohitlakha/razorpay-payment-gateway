const express = require("express");
const fs = require("fs");
const path = require("path");

const verifySignature =
require("../utils/verifySignature");

const router = express.Router();


/* Ensure logs directory exists */

const logDir =
path.join(__dirname, "../logs");

if (!fs.existsSync(logDir)) {

  fs.mkdirSync(logDir, {
    recursive: true
  });

}

const logFile =
path.join(logDir, "payments.log");


router.post("/", (req, res) => {

  try {

    const {

      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      projectId,
      amount,
      name,
      email,
      description

    } = req.body;


    /* Validate required fields */

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {

      return res.status(400).json({

        success: false,

        error: "Missing payment data"

      });

    }


    /* Verify signature using utility */

    const isValid =
      verifySignature({

        orderId:
          razorpay_order_id,

        paymentId:
          razorpay_payment_id,

        signature:
          razorpay_signature

      });


    if (!isValid) {

      console.warn(
        "Invalid signature attempt"
      );

      return res.status(400).json({

        success: false,

        error: "Invalid signature"

      });

    }


    /* Prepare log entry */

    const logEntry = {

      time:
        new Date().toISOString(),

      order_id:
        razorpay_order_id,

      payment_id:
        razorpay_payment_id,

      project:
        projectId || "unknown",

      amount:
        amount || 0,

      customer:
        name || "unknown",

      email:
        email || "unknown",

      description:
        description || "payment"

    };


    /* Write log */

    fs.appendFileSync(

      logFile,

      JSON.stringify(logEntry) + "\n"

    );


    console.log(
      "Payment verified and logged:"
    );

    console.log(logEntry);


    res.json({

      success: true

    });

  }
  catch (err) {

    console.error(
      "Verification error:",
      err
    );

    res.status(500).json({

      success: false,

      error:
        "Verification failed"

    });

  }

});


module.exports = router;
