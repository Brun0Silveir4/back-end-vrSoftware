const ampq = require("amqplib");

let channel;

async function connectionRabbit() {
  if (channel) return channel;

  try {
    const connection = await ampq.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("Successfull conection");
    return channel;
  } catch (e) {
    console.log("Connection error:", e);
    process.exit(1);
  }
}

function getChannel() {
  if (!channel) throw new Error("Initialization error");
  return channel;
}

module.exports = {
  connectionRabbit,
  getChannel,
};
