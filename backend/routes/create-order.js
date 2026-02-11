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

    const order = await razorpay.orders.create({

      amount: amount * 100,

      currency: "INR"

    });

    res.json({

      orderId: order.id,

      key: process.env.RAZORPAY_KEY_ID,

      amount

    });

  }
  catch (error) {

    res.status(500).json({

      error: "Order creation failed"

    });

  }

});

module.exports = router;
