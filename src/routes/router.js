// src/routes/router.js
const express = require("express");
const uuid = require("uuid").v4;
const { getChannel } = require("../config/rabbit");
const { saveStatus, getStatus, resetStatus } = require("../data/storage");

const router = express.Router();

router.post("/notificar", async (req, res) => {
  const { messageContent } = req.body;
  if (!messageContent || messageContent.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  const channel = getChannel();
  const inputQueue = "fila.notificacao.entrada.BRUNO-SILVEIRA";

  const messageId = uuid();
  const payload = { messageId, messageContent };

  await channel.assertQueue(inputQueue, { durable: true });
  channel.sendToQueue(inputQueue, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });

  saveStatus(messageId, "AGUARDANDO_PROCESSAMENTO");

  res.status(202).json({ messageId, status: "AGUARDANDO_PROCESSAMENTO" });
});

router.get("/status/:id", (req, res) => {
  const mensagemId = req.params.id;
  const status = getStatus(mensagemId);

  if (status === null) {
    return res.status(404).json({ mensagemId, status: "NAO_REGISTRADO" });
  }

  if (status === "FALHA_PROCESSAMENTO") {
    return res.status(400).json({
      message: "Your message has failed",
      mensagemId,
      status,
    });
  }

  res.json({ mensagemId, status });
});

router.post("/teste", (req, res) => res.json({ message: "oi" }));

module.exports = router;
