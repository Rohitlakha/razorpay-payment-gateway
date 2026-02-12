const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const projects = require("../config/projects");

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


    /* VALIDATION */

    if (!amount) {

      return res.status(400).json({
        error: "Amount required"
      });

    }


    /* PROJECT VALIDATION */

    let projectName = "Student Payment";
    let currency = "INR";

    if (projectId && projects[projectId]) {

      projectName = projects[projectId].name;
      currency = projects[projectId].currency;

    }


    /* CREATE ORDER */

    const order = await razorpay.orders.create({

      amount: amount * 100,

      currency: currency,

      receipt: "receipt_" + Date.now(),

      notes: {

        projectId: projectId || "default",

        name: name || "",

        email: email || "",

        description: description || ""

      }

    });


    /* RESPONSE (COMPATIBLE WITH YOUR SDK) */

    res.json({

      orderId: order.id,

      amount: order.amount,

      currency: order.currency,

      key: process.env.RAZORPAY_KEY_ID,

      name: projectName,

      description: description || projectName

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
