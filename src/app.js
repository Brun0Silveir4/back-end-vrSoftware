const express = require("express");
const routes = require("./routes/router");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);


module.exports = app; // exporta só o app, sem inicializar RabbitMQ
