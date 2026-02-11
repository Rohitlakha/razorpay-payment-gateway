from flask import Flask, render_template, redirect, session, url_for

app = Flask(__name__)

app.secret_key = "secure_secret_key"


@app.route("/")
def home():

    return render_template("index.html")


@app.route("/success")
def success():

    return render_template("success.html")


@app.route("/cancel")
def cancel():

    return render_template("cancel.html")


if __name__ == "__main__":

    app.run(port=5000, debug=True)
