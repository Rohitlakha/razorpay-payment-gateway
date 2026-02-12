const fs = require("fs");
const path = require("path");

const razorpayInstance =
require("../config/razorpay");

const verifySignature =
require("../utils/verifySignature");

const allowedProjects =
require("../config/projects");


/*
========================================
Ensure logs directory exists
========================================
*/

const logDir =
path.join(__dirname, "../logs");

if (!fs.existsSync(logDir)) {

    fs.mkdirSync(logDir, {
        recursive: true
    });

}

const logFile =
path.join(logDir, "payments.log");


/*
========================================
CREATE ORDER (Universal for students)
========================================
*/

exports.createOrder =
async (req, res) => {

    try {

        const {

            amount,
            projectId,
            name,
            email,
            description

        } = req.body;


        /* Validate required fields */

        if (!amount || !projectId) {

            return res.status(400).json({

                success: false,

                message:
                "amount and projectId are required"

            });

        }


        /* Validate project */

        if (!allowedProjects[projectId]) {

            return res.status(403).json({

                success: false,

                message:
                "Unauthorized project"

            });

        }


        /* Validate amount */

        const parsedAmount =
        Number(amount);

        if (
            isNaN(parsedAmount) ||
            parsedAmount < 1 ||
            parsedAmount > 1000000
        ) {

            return res.status(400).json({

                success: false,

                message:
                "Invalid amount"

            });

        }


        /* Create Razorpay order */

        const options = {

            amount:
            parsedAmount * 100,

            currency: "INR",

            receipt:
            `${projectId}_${Date.now()}`,

            notes: {

                projectId,

                customerName:
                name || "Customer",

                customerEmail:
                email ||
                "customer@email.com",

                description:
                description ||
                "Payment"

            }

        };


        const order =
        await razorpayInstance
        .orders.create(options);


        console.log(
            "Order created:",
            order.id
        );


        /* Send response compatible with SDK */

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
        "Create Order Error:",
        error.message
        );

        res.status(500).json({

            success: false,

            message:
            "Failed to create order"

        });

    }

};



/*
========================================
VERIFY PAYMENT + LOG
========================================
*/

exports.verifyPayment =
(req, res) => {

    try {

        const {

            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,

            projectId,
            amount,
            name,
            email,
            description

        } = req.body;


        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                "Missing payment data"

            });

        }


        /* Verify signature */

        const isValid =
        verifySignature({

            orderId:
            razorpay_order_id,

            paymentId:
            razorpay_payment_id,

            signature:
            razorpay_signature

        });


        if (!isValid) {

            return res.status(400).json({

                success: false,

                message:
                "Invalid payment signature"

            });

        }


        /* Log payment */

        const logEntry = {

            time:
            new Date().toISOString(),

            order_id:
            razorpay_order_id,

            payment_id:
            razorpay_payment_id,

            project:
            projectId || "unknown",

            amount:
            amount || 0,

            customer:
            name || "unknown",

            email:
            email || "unknown",

            description:
            description || "payment"

        };


        fs.appendFileSync(

            logFile,

            JSON.stringify(logEntry)
            + "\n"

        );


        console.log(
        "Payment verified and logged:",
        logEntry
        );


        res.json({

            success: true,

            message:
            "Payment verified successfully"

        });

    }
    catch (error) {

        console.error(
        "Verify Payment Error:",
        error.message
        );

        res.status(500).json({

            success: false,

            message:
            "Verification failed"

        });

    }

};
