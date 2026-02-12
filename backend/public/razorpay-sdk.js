(function () {

  if (window.RazorpayGateway) return;

  console.log("Universal Razorpay Gateway Loaded");

  window.RazorpayGateway = {

    startPayment: async function (config) {

      try {

        if (!config.amount)
          throw new Error("Amount required");

        if (!config.projectId)
          throw new Error("ProjectId required");


        const backendUrl =
          config.backendUrl ||
          window.location.origin;


        /*
        ==========================
        CREATE ORDER
        ==========================
        */

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

              name: config.name,

              email: config.email,

              description: config.description

            })
          }
        );


        const data = await res.json();

        if (!data.success)
          throw new Error(data.error || "Order failed");


        /*
        ==========================
        RAZORPAY OPTIONS
        ==========================
        */

        const options = {

          key: data.key,

          amount: data.amount,

          currency: data.currency,

          name: data.name,

          description: data.description,

          order_id: data.orderId,


          /*
          ==========================
          SUCCESS HANDLER
          ==========================
          */

          handler: async function (response) {

            try {

              await fetch(
                backendUrl + "/verify-payment",
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


              console.log("Payment verified");


              if (config.successUrl) {

                window.location.href =
                  config.successUrl +
                  "?payment_id=" +
                  response.razorpay_payment_id;

              }

            }
            catch (err) {

              console.error(err);

              alert("Verification failed");

            }

          },


          /*
          ==========================
          CANCEL HANDLER
          ==========================
          */

          modal: {

            ondismiss: function () {

              console.log("Payment cancelled");

              if (config.cancelUrl) {

                window.location.href =
                  config.cancelUrl +
                  "?reason=cancelled";

              }

            }

          }

        };


        const rzp =
          new Razorpay(options);


        /*
        ==========================
        PAYMENT FAILED HANDLER
        ==========================
        */

        rzp.on("payment.failed",
        function () {

          console.log("Payment failed");

          if (config.cancelUrl) {

            window.location.href =
              config.cancelUrl +
              "?reason=failed";

          }

        });


        /*
        ==========================
        OPEN PAYMENT WINDOW
        ==========================
        */

        rzp.open();


      }
      catch (err) {

        console.error(err);

        alert(err.message);

      }

    }

  };

})();
