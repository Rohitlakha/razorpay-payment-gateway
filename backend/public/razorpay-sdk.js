(function () {

  if (window.RazorpayGateway) return;

  window.RazorpayGateway = {

    startPayment: async function(config) {

      const backendUrl = config.backendUrl || "http://localhost:4343";

      const orderResponse = await fetch(`${backendUrl}/create-order`, {

        method: "POST",

        headers: {

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          projectId: config.projectId,

          amount: config.amount

        })

      });

      const order = await orderResponse.json();

      const options = {

        key: order.key,

        amount: config.amount * 100,

        currency: "INR",

        order_id: order.orderId,

        handler: async function (response) {

          const verifyResponse = await fetch(`${backendUrl}/verify-payment`, {

            method: "POST",

            headers: {

              "Content-Type": "application/json"

            },

            body: JSON.stringify(response)

          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {

            window.location.href = config.successUrl;

          }
          else {

            window.location.href = config.cancelUrl;

          }

        },

        modal: {

          ondismiss: function () {

            window.location.href = config.cancelUrl;

          }

        }

      };

      const rzp = new Razorpay(options);

      rzp.open();

    }

  };

})();
