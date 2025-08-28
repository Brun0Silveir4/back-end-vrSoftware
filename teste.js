require("dotenv").config();
const amqplib = require("amqplib");

(async () => {
  try {
    const conn = await amqplib.connect(process.env.RABBITMQ_URL);
    console.log("Connected");
    await conn.close();
  } catch (err) {
    console.error("Error:", err.message);
  }
})();


// arquivo apenas para verificação da conexão a parte