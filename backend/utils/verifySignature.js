const crypto = require("crypto");


/*
========================================
Verify Razorpay payment signature
========================================

Parameters:
- orderId
- paymentId
- signature

Returns:
- true (valid)
- false (invalid)

========================================
*/

function verifySignature({

  orderId,
  paymentId,
  signature

}) {

  try {

    if (
      !orderId ||
      !paymentId ||
      !signature
    ) {

      return false;

    }


    const body =
      orderId + "|" + paymentId;


    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env
            .RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");


    return (
      expectedSignature === signature
    );

  }
  catch (error) {

    console.error(
      "Signature verification error:",
      error
    );

    return false;

  }

}


module.exports =
  verifySignature;
