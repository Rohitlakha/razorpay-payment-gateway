const express = require("express");
const fs = require("fs");
const path = require("path");

const verifySignature = require("../utils/verifySignature");

const router = express.Router();


/*
========================================
Ensure logs directory exists
(Render filesystem safe)
========================================
*/

const logDir = path.join(__dirname, "../logs");

try {

  if (!fs.existsSync(logDir)) {

    fs.mkdirSync(logDir, {
      recursive: true
    });

  }

} catch (err) {

  console.error("Log directory creation failed:", err);

}

const logFile = path.join(logDir, "payments.log");


/*
========================================
Verify Payment Route
========================================
*/

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


    /*
    ========================================
    Validate required fields
    ========================================
    */

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


    /*
    ========================================
    Verify Razorpay signature
    ========================================
    */

    const isValid = verifySignature({

      orderId: razorpay_order_id,

      paymentId: razorpay_payment_id,

      signature: razorpay_signature

    });


    if (!isValid) {

      console.warn(
        "Invalid payment signature:",
        razorpay_order_id
      );

      return res.status(400).json({

        success: false,
        error: "Invalid signature"

      });

    }


    /*
    ========================================
    Prepare payment log entry
    ========================================
    */

    const logEntry = {

      time: new Date().toISOString(),

      order_id: razorpay_order_id,

      payment_id: razorpay_payment_id,

      project: projectId || "unknown",

      amount: amount || 0,

      customer: name || "unknown",

      email: email || "unknown",

      description: description || "payment",

      ip: req.ip

    };


    /*
    ========================================
    Write log safely
    ========================================
    */

    try {

      fs.appendFileSync(
        logFile,
        JSON.stringify(logEntry) + "\n"
      );

    } catch (logError) {

      console.error(
        "Log write failed:",
        logError
      );

    }


    /*
    ========================================
    Console log (Render logs visible)
    ========================================
    */

    console.log(
      "Payment verified:",
      logEntry.order_id
    );


    /*
    ========================================
    Success response
    ========================================
    */

    res.json({

      success: true,

      message: "Payment verified",

      order_id: razorpay_order_id

    });

  }
  catch (err) {

    console.error(
      "Verification error:",
      err
    );

    res.status(500).json({

      success: false,

      error: "Verification failed"

    });

  }

});


module.exports = router;
