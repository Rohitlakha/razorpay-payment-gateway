from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():

    fees = [
        {"type": "Semester Fee", "amount": 25000},
        {"type": "Exam Fee", "amount": 3000},
        {"type": "Library Fee", "amount": 1000}
    ]

    return render_template("index.html", fees=fees)

app.run(port=5502, debug=True)
