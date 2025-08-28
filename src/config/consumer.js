const { getChannel } = require("./rabbit");
const { saveStatus } = require("../data/storage");

async function ConsumerInit() {
  const channel = getChannel();

  const inputQueue = "fila.notificacao.entrada.BRUNO-SILVEIRA";
  const statusQueue = "fila.notificacao.status.BRUNO-SILVEIRA";

  await channel.assertQueue(inputQueue, { durable: true });
  await channel.assertQueue(statusQueue, { durable: true });

  channel.consume(inputQueue, async (msg) => {
    if (!msg) return;

    const { messageId, messageContent } = JSON.parse(msg.content.toString());

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000)
    );

    const number = Math.floor(Math.random() * 10) + 1;
    console.log(number);
    let status;

    if (number <= 2) {
      status = "FALHA_PROCESSAMENTO";
    } else {
      status = "SUCESSO_PROCESSAMENTO";
    }

    saveStatus(messageId, status);

    const result = { messageId, status };
    channel.sendToQueue(statusQueue, Buffer.from(JSON.stringify(result)));
    console.log("Resultado publicado em", statusQueue, result);

    channel.ack(msg);
  });
}

module.exports = { ConsumerInit };
