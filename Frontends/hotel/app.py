from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():

    rooms = [
        {"type": "Standard Room", "price": 2000},
        {"type": "Deluxe Room", "price": 4000},
        {"type": "Suite Room", "price": 7000}
    ]

    return render_template("index.html", rooms=rooms)

app.run(port=5503, debug=True)
