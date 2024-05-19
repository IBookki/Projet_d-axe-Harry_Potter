const express = require("express");
const routes = require("./routes/start");
const cors = require("cors");
const ip = require("ip");
const app = express();
const ipAddr = ip.address();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", routes);

app.listen(port, () => {
  console.log("Server run:http://" + ipAddr + ":3000");
});
