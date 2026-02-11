(function () {

  if (window.RazorpayGateway) return;

  console.log("Razorpay SDK Loaded");

  window.RazorpayGateway = {

    startPayment: async function(config) {

      try {

        const backendUrl = config.backendUrl || "http://localhost:4343";

        /* CREATE ORDER */

        const res = await fetch(backendUrl + "/create-order", {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            amount: config.amount
          })

        });

        const data = await res.json();

        if (!data.orderId) {

          alert("Order creation failed");

          console.error(data);

          return;

        }

        /* CHECK RAZORPAY LOADED */

        if (!window.Razorpay) {

          alert("Razorpay SDK not loaded");

          return;

        }

        /* OPTIONS */

        const options = {

          key: data.key,

          amount: data.amount,

          currency: data.currency,

          name: data.name,

          description: data.description,

          order_id: data.orderId,

          handler: function () {

            window.location.href = config.successUrl;

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
      catch (err) {

        console.error(err);

        alert("Payment failed");

      }

    }

  };

})();
