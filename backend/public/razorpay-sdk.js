(function(){

window.RazorpayGateway = {

startPayment: async function(config){

const res = await fetch(config.backendUrl + "/create-order", {

method: "POST",

headers: {

"Content-Type": "application/json"

},

body: JSON.stringify({

amount: config.amount

})

});

const order = await res.json();

const options = {

key: order.key,

amount: order.amount * 100,

currency: "INR",

order_id: order.orderId,

handler: function(){

window.location.href = config.successUrl;

},

modal: {

ondismiss: function(){

window.location.href = config.cancelUrl;

}

}

};

const rzp = new Razorpay(options);

rzp.open();

}

};

})();
