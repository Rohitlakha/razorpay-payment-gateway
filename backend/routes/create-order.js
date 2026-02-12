const express = require("express");
const Razorpay = require("razorpay");

const router = express.Router();

const allowedProjects =
  require("../config/projects");


/* Initialize Razorpay instance */

const razorpay = new Razorpay({

  key_id:
    process.env.RAZORPAY_KEY_ID,

  key_secret:
    process.env.RAZORPAY_KEY_SECRET

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


    /* Validate project */

    if (
      !projectId ||
      !allowedProjects[projectId]
    ) {

      console.warn(
        "Unauthorized project attempt:",
        projectId
      );

      return res.status(403).json({

        success: false,

        error:
          "Unauthorized project"

      });

    }


    /* Validate amount */

    const parsedAmount =
      Number(amount);

    if (
      !parsedAmount ||
      isNaN(parsedAmount) ||
      parsedAmount < 1 ||
      parsedAmount > 1000000
    ) {

      return res.status(400).json({

        success: false,

        error:
          "Invalid amount"

      });

    }


    /* Create order */

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

          customerName:
            name ||
            "Customer",

          customerEmail:
            email ||
            "customer@email.com",

          description:
            description ||
            "Payment"

        }

      });


    console.log(
      "Order created:",
      order.id,
      "Project:",
      projectId,
      "Amount:",
      parsedAmount
    );


    /* Send response */

    res.json({

      success: true,

      orderId:
        order.id,

      amount:
        order.amount,

      currency:
        order.currency,

      key:
        process.env
          .RAZORPAY_KEY_ID,

      name:
        allowedProjects[
          projectId
        ].name,

      description:
        description ||
        allowedProjects[
          projectId
        ].name

    });

  }
  catch (error) {

    console.error(
      "Create order error:",
      error.message
    );

    res.status(500).json({

      success: false,

      error:
        "Order creation failed"

    });

  }

});


module.exports = router;
