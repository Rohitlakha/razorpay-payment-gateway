(function () {

  if (window.RazorpayGateway) return;

  window.RazorpayGateway = {

    startPayment: async function(config) {

      try {

        if (!config.amount)
          throw new Error("Amount required");

        const backendUrl =
          config.backendUrl ||
          "http://localhost:5000";


        const res = await fetch(
          backendUrl + "/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(config)
          }
        );

        const data = await res.json();

        if (!data.orderId)
          throw new Error("Order failed");


        const options = {

          key: data.key,

          amount: data.amount,

          currency: data.currency,

          name: data.name,

          description: data.description,

          order_id: data.orderId,


          handler: function(response) {

            const params =
              "?razorpay_order_id=" +
              response.razorpay_order_id +
              "&razorpay_payment_id=" +
              response.razorpay_payment_id +
              "&razorpay_signature=" +
              response.razorpay_signature;

            window.location.href =
              config.successUrl + params;

          },


          modal: {

            ondismiss: function() {

              window.location.href =
                config.cancelUrl;

            }

          }

        };

        new Razorpay(options).open();

      }
      catch (err) {

        alert(err.message);

      }

    }

  };

})();
