const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const allowedProjects = require("../config/projects");

const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_KEY_SECRET

});


router.post("/", async (req, res) => {

  try {

    const {
      amount,
      projectId,
      name,
      email,
      description
    } = req.body;


    /* Validate amount */

    if (!amount || amount < 1 || amount > 1000000) {

      return res.status(400).json({
        error: "Invalid amount"
      });

    }


    /* Validate project */

    if (!allowedProjects[projectId]) {

      return res.status(403).json({
        error: "Unauthorized project"
      });

    }


    /* Create order */

    const order = await razorpay.orders.create({

      amount: amount * 100,

      currency: "INR",

      receipt: "rcpt_" + Date.now(),

      notes: {
        projectId,
        name,
        email,
        description
      }

    });


    res.json({

      orderId: order.id,

      amount: order.amount,

      currency: order.currency,

      key: process.env.RAZORPAY_KEY_ID,

      name: projectId,

      description: description || "Secure Payment"

    });

  }
  catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Order creation failed"
    });

  }

});


module.exports = router;
