(function () {

  /* Prevent duplicate loading */
  if (window.RazorpayGateway) return;

  console.log("Razorpay SDK Loaded");

  window.RazorpayGateway = {

    startPayment: async function (config) {

      try {

        /* VALIDATION */

        if (!config || !config.amount) {

          alert("Payment amount is required");
          return;

        }

        if (!config.successUrl || !config.cancelUrl) {

          alert("Success and Cancel URLs are required");
          return;

        }


        /* BACKEND URL */

        const backendUrl =
          config.backendUrl ||
          window.location.origin ||
          "http://localhost:5000";


        /* CREATE ORDER */

        const res = await fetch(backendUrl + "/create-order", {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            amount: config.amount,
            projectId: config.projectId || "default",
            name: config.name || "",
            email: config.email || "",
            description: config.description || "Payment"

          })

        });


        if (!res.ok) {

          alert("Failed to connect to payment server");
          return;

        }


        const data = await res.json();


        if (!data.orderId) {

          alert("Order creation failed");
          console.error(data);
          return;

        }


        /* RAZORPAY OPTIONS */

        const options = {

          key: data.key,

          amount: data.amount,

          currency: data.currency,

          name: data.name,

          description: data.description,

          order_id: data.orderId,


          /* SUCCESS HANDLER */

          handler: function (response) {

            const params =
              "?razorpay_order_id=" + response.razorpay_order_id +
              "&razorpay_payment_id=" + response.razorpay_payment_id +
              "&razorpay_signature=" + response.razorpay_signature;


            window.location.href = config.successUrl + params;

          },


          /* CANCEL HANDLER */

          modal: {

            ondismiss: function () {

              window.location.href =
                config.cancelUrl +
                "?reason=cancelled_by_user";

            }

          },


          /* OPTIONAL PREFILL */

          prefill: {

            name: config.name || "",

            email: config.email || ""

          },


          /* THEME */

          theme: {

            color: "#3399cc"

          }

        };


        /* OPEN PAYMENT WINDOW */

        const rzp = new Razorpay(options);

        rzp.open();

      }
      catch (err) {

        console.error("Payment Error:", err);

        alert("Payment failed. Please try again.");

      }

    }

  };

})();
