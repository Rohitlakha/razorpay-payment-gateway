(function () {

  if (window.RazorpayGateway) return;

  console.log("Universal Razorpay Gateway Loaded");

  window.RazorpayGateway = {

    startPayment: async function (config) {

      try {

        /* Validate required fields */

        if (!config.amount)
          throw new Error("Amount is required");

        if (!config.projectId)
          throw new Error("ProjectId is required");


        /* Detect backend URL automatically */

        const backendUrl =
          config.backendUrl ||
          window.RAZORPAY_GATEWAY_URL ||
          "http://localhost:5000";


        /* Create order */

        const res = await fetch(
          backendUrl + "/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({

              amount: config.amount,

              projectId: config.projectId,

              name: config.name || "Customer",

              email: config.email || "customer@email.com",

              description:
                config.description || "Payment"

            })
          }
        );


        const data = await res.json();


        if (!data.orderId)
          throw new Error("Order creation failed");


        /* Razorpay options */

        const options = {

          key: data.key,

          amount: data.amount,

          currency: data.currency,

          name: data.name,

          description: data.description,

          order_id: data.orderId,


          /* SUCCESS HANDLER */

          handler: async function (response) {

            try {

              /* Verify payment with backend */

              const verifyRes =
                await fetch(
                  backendUrl +
                  "/verify-payment",
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({

                      razorpay_order_id:
                        response.razorpay_order_id,

                      razorpay_payment_id:
                        response.razorpay_payment_id,

                      razorpay_signature:
                        response.razorpay_signature,

                      projectId:
                        config.projectId,

                      amount:
                        config.amount,

                      name:
                        config.name,

                      email:
                        config.email,

                      description:
                        config.description

                    })

                  }
                );


              const verifyData =
                await verifyRes.json();


              if (!verifyData.success)
                throw new Error(
                  "Verification failed"
                );


              console.log(
                "Payment verified and logged"
              );


              /* Redirect */

              if (config.successUrl) {

                const params =
                  "?payment_id=" +
                  response.razorpay_payment_id;

                window.location.href =
                  config.successUrl +
                  params;

              }

            }
            catch (err) {

              console.error(err);

              alert(
                "Payment verification failed"
              );

            }

          },


          /* CANCEL HANDLER */

          modal: {

            ondismiss: function () {

              if (config.cancelUrl)
                window.location.href =
                  config.cancelUrl;

            }

          }

        };


        /* Open Razorpay popup */

        new Razorpay(options).open();

      }
      catch (err) {

        console.error(err);

        alert(err.message);

      }

    }

  };

})();
