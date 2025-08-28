require("dotenv").config();
const express = require("express");
const { connectionRabbit } = require("./config/rabbit");
const { ConsumerInit } = require("./config/consumer");
const routes = require("./routes/router");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

(async () => {
  await connectionRabbit();
  await ConsumerInit();

  app.listen(8080, () => console.log(`Servidor rodando...`));
})();

