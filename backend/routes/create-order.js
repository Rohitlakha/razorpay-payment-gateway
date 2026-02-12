const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const allowedProjects =
require("../config/projects");


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

    const parsedAmount = Number(amount);

    if (

      isNaN(parsedAmount) ||
      parsedAmount < 1 ||
      parsedAmount > 1000000

    ) {

      return res.status(400).json({

        success: false,
        error: "Invalid amount"

      });

    }


    /* Get project automatically */

    const project =
      allowedProjects[projectId];


    /* LOG request (IMPORTANT) */

    console.log("=================================");
    console.log("New Payment Request");
    console.log("Project:", projectId);
    console.log("Amount:", parsedAmount);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("IP:", req.ip);
    console.log("=================================");


    /* Create Razorpay order */

    const order =
      await razorpay.orders.create({

        amount:
          parsedAmount * 100,

        currency: "INR",

        receipt:
          "rcpt_" +
          projectId +
          "_" +
          Date.now(),

        notes: {

          projectId,
          customerName: name,
          customerEmail: email,
          description

        }

      });


    res.json({

      success: true,

      orderId: order.id,

      amount: order.amount,

      currency: order.currency,

      key: process.env.RAZORPAY_KEY_ID,

      name: project.name,

      description: description

    });

  }
  catch (err) {

    console.error(
      "Create order error:",
      err
    );

    res.status(500).json({

      success: false,
      error: "Order creation failed"

    });

  }

});


module.exports = router;
