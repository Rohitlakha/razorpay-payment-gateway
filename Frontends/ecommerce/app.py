from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    products = [
        {"name": "Laptop", "price": 50000},
        {"name": "Phone", "price": 15000},
        {"name": "Headphones", "price": 2000}
    ]
    return render_template("index.html", products=products)

app.run(port=5501, debug=True)
