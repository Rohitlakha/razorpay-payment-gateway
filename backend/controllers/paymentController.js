const razorpayInstance = require("../config/razorpay");
const verifySignature = require("../utils/verifySignature");
const allowedProjects = require("../config/projects");

// CREATE ORDER (Dynamic)
exports.createOrder = async (req, res) => {

    try {

        const {
            amount,
            projectId,
            customerName,
            customerEmail,
            description
        } = req.body;

        // Validate required fields
        if (!amount || !projectId) {
            return res.status(400).json({
                success: false,
                message: "amount and projectId are required"
            });
        }

        // Check project authorization
        if (!allowedProjects[projectId]) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized project"
            });
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // convert to paisa
            currency: "INR",
            receipt: `${projectId}_${Date.now()}`,
            notes: {
                projectId,
                customerName: customerName || "",
                customerEmail: customerEmail || "",
                description: description || ""
            }
        };

        const order = await razorpayInstance.orders.create(options);

        res.json({
            success: true,
            order
        });

    } catch (error) {

        console.error("Create Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create order"
        });
    }
};


// VERIFY PAYMENT
exports.verifyPayment = (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing payment data"
            });
        }

        const isValid = verifySignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (isValid) {

            return res.json({
                success: true,
                message: "Payment verified successfully"
            });

        } else {

            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });

        }

    } catch (error) {

        console.error("Verify Payment Error:", error);

        res.status(500).json({
            success: false,
            message: "Verification failed"
        });

    }

};
