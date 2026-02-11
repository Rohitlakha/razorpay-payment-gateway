const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET

});

router.post("/", async (req, res) => {

  try {

    const { amount } = req.body;

    if (!amount) {

      return res.status(400).json({
        error: "Amount required"
      });

    }

    const options = {

      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()

    };

    const order = await razorpay.orders.create(options);

    res.json({

      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      name: "Student Payment",
      description: "Course Fee"

    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Order creation failed"
    });

  }

});

module.exports = router;
