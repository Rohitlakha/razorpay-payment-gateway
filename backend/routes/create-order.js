const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

const projects = require("../config/projects");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/", async (req, res) => {

  try {

    const { projectId, amount } = req.body;

    if (!projectId || !amount) {

      return res.status(400).json({
        error: "Missing projectId or amount"
      });

    }

    const project = projects[projectId];

    if (!project) {

      return res.status(400).json({
        error: "Invalid project"
      });

    }

    if (!project.allowedAmounts.includes(amount)) {

      return res.status(400).json({
        error: "Invalid amount"
      });

    }

    const order = await razorpay.orders.create({

      amount: amount * 100,
      currency: project.currency,
      receipt: "receipt_" + Date.now()

    });

    res.json({
      orderId: order.id,
      key: process.env.RAZORPAY_KEY_ID
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
