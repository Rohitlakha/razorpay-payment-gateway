(function () {

  /* =====================================
     Prevent duplicate loading
  ===================================== */

  if (window.RazorpayGateway) {
    console.warn("RazorpayGateway already loaded");
    return;
  }

  console.log("Razorpay SDK Loaded");

  /* =====================================
     Main Gateway Object
  ===================================== */

  window.RazorpayGateway = {

    startPayment: async function (config) {

      try {

        /* ================================
           Validate config
        ================================ */

        if (!config) {
          alert("Payment config missing");
          return;
        }

        if (!config.amount) {
          alert("Amount required");
          return;
        }

        /* ================================
           Detect backend URL
        ================================ */

        const backendUrl =
          config.backendUrl || "http://localhost:4343";


        /* ================================
           Create order from backend
        ================================ */

        const response = await fetch(
          `${backendUrl}/create-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              amount: config.amount
            })
          }
        );

        const data = await response.json();

        if (!data.orderId) {

          console.error(data);

          alert("Order creation failed");

          return;
        }


        /* ================================
           Check Razorpay loaded
        ================================ */

        if (typeof Razorpay === "undefined") {

          alert("Razorpay SDK not loaded");

          return;
        }


        /* ================================
           Razorpay options
        ================================ */

        const options = {

          key: data.key,

          amount: data.amount,

          currency: data.currency,

          name: data.name || "Payment",

          description: data.description || "Payment",

          order_id: data.orderId,

          handler: async function (response) {

            console.log("Payment Success", response);

            if (config.successUrl) {

              window.location.href = config.successUrl;

            }

          },

          modal: {

            ondismiss: function () {

              console.log("Payment Cancelled");

              if (config.cancelUrl) {

                window.location.href = config.cancelUrl;

              }

            }

          },

          theme: {
            color: "#3399cc"
          }

        };


        /* ================================
           Open Razorpay
        ================================ */

        const rzp = new Razorpay(options);

        rzp.open();

      }
      catch (error) {

        console.error("RazorpayGateway Error:", error);

        alert("Payment failed");

      }

    }

  };

})();
