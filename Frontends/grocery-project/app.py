from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def grocery():
    return render_template("grocery.html")


@app.route("/success")
def success():
    return render_template("success.html")


@app.route("/cancel")
def cancel():
    return render_template("cancel.html")


if __name__ == "__main__":
    app.run(port=5600, debug=True)
