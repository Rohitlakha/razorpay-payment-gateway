const express = require("express");
const crypto = require("crypto");

const router = express.Router();

router.post("/", (req, res) => {

  try {

    const {

      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature

    } = req.body;


    if (!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature) {

      return res.status(400).json({
        success: false,
        error: "Missing payment data"
      });

    }


    const body = razorpay_order_id + "|" + razorpay_payment_id;


    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");


    if (expectedSignature === razorpay_signature) {

      res.json({
        success: true,
        message: "Payment verified"
      });

    }
    else {

      res.status(400).json({
        success: false,
        message: "Invalid signature"
      });

    }

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: "Verification failed"
    });

  }

});

module.exports = router;
