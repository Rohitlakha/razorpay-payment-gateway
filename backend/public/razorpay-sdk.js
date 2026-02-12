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

            amount: config.amount,

            projectId: config.projectId,

            name: config.name,

            email: config.email,

            description: config.description

          })

        });


        const data = await res.json();


        if (!data.orderId) {

          alert("Order creation failed");

          console.error(data);

          return;

        }


        if (!window.Razorpay) {

          alert("Razorpay SDK not loaded");

          return;

        }


        /* PAYMENT OPTIONS */

        const options = {

          key: data.key,

          amount: data.amount,

          currency: data.currency,

          name: data.name,

          description: data.description,

          order_id: data.orderId,


          handler: function () {

            if (config.successUrl)
              window.location.href = config.successUrl;

          },


          modal: {

            ondismiss: function () {

              if (config.cancelUrl)
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
