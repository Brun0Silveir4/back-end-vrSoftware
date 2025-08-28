const request = require("supertest");
const app = require("../app");
const { saveStatus, resetStatus } = require("../data/storage");

// Mock do RabbitMQ
jest.mock("../config/rabbit", () => ({
  getChannel: () => ({
    assertQueue: jest.fn().mockResolvedValue(),
    sendToQueue: jest.fn(),
  }),
}));

beforeEach(() => {
  resetStatus();
});

describe("Rotas /api", () => {
  it("POST /notificar deve publicar mensagem e salvar status", async () => {
    const res = await request(app)
      .post("/api/notificar")
      .send({ messageContent: "teste" });

    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty("messageId");
    expect(res.body.status).toBe("AGUARDANDO_PROCESSAMENTO");
  });

  it("GET /status/:id retorna status correto", async () => {
    saveStatus("ok-id", "AGUARDANDO_PROCESSAMENTO");

    const res = await request(app).get("/api/status/ok-id");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("AGUARDANDO_PROCESSAMENTO");
  });

  it("GET /status/:id retorna 404 se não registrado", async () => {
    const res = await request(app).get("/api/status/não-existe");
    expect(res.status).toBe(404);
    expect(res.body.status).toBe("NAO_REGISTRADO");
  });
});
