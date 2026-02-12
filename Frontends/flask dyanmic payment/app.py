from flask import Flask, render_template

app = Flask(__name__)


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Success page
@app.route("/success")
def success():
    return render_template("success.html")


# Cancel page
@app.route("/cancel")
def cancel():
    return render_template("cancel.html")


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5500,
        debug=True
    )
