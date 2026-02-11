const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/sdk", express.static(path.join(__dirname, "public")));

const createOrder = require("./routes/create-order");

app.use("/create-order", createOrder);

app.get("/", (req, res) => {

  res.send("Razorpay Gateway Running");

});

const PORT = process.env.PORT || 4343;

app.listen(PORT, () => {

  console.log("================================");
  console.log("Razorpay Gateway Running");
  console.log("http://localhost:" + PORT);
  console.log("================================");

});
