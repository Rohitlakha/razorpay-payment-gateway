const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const logFile = path.join(__dirname, "../logs/payments.log");


router.post("/", (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;


    const body =
      razorpay_order_id + "|" + razorpay_payment_id;


    const expected = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(body)
      .digest("hex");


    if (expected === razorpay_signature) {

      /* Log payment */

      const log = {

        order_id: razorpay_order_id,

        payment_id: razorpay_payment_id,

        time: new Date().toISOString()

      };

      fs.appendFileSync(
        logFile,
        JSON.stringify(log) + "\n"
      );


      res.json({
        success: true
      });

    }
    else {

      res.status(400).json({
        success: false
      });

    }

  }
  catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Verification failed"
    });

  }

});


module.exports = router;
