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

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      res.json({
        success: true
      });

    } else {

      res.status(400).json({
        success: false
      });

    }

  }
  catch {

    res.status(500).json({
      error: "Verification failed"
    });

  }

});

module.exports = router;
