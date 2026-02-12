from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

app.secret_key = "razorpay_secret_key"


# Home page
@app.route("/")
def home():

    return render_template("dynamic-payment.html")


# Success page
@app.route("/success")
def success():

    order_id = request.args.get("razorpay_order_id")
    payment_id = request.args.get("razorpay_payment_id")

    return render_template(
        "success.html",
        order_id=order_id,
        payment_id=payment_id
    )


# Cancel page
@app.route("/cancel")
def cancel():

    return render_template("cancel.html")


# Run app
if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
