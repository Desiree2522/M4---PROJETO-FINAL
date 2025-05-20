const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {
  createTestFeedback,
  deleteFeedbackById,
  deleteFeedbacksByUserId,
  updateFeedback,
} = require("./feedbacks.function.js");

describe("Funções de Feedback", () => {
  let user;

  beforeAll(async () => {
    user = await prisma.usuario.create({
      data: {
        nome: "Usuário Feedback Teste",
        email: `feedback_teste_${Date.now()}@mail.com`,
        senha: "123456",
        tipo: "DOADOR",
      },
    });
  });

  afterAll(async () => {
    await deleteFeedbacksByUserId(user.id);
    await prisma.usuario.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  });

  test("Deve criar um feedback com sucesso", async () => {
    const feedback = await createTestFeedback(user.id, "Feedback de teste", 4);

    expect(feedback).toHaveProperty("id");
    expect(feedback.mensagem).toBe("Feedback de teste");
    expect(feedback.nota).toBe(4);
    expect(feedback.usuarioId).toBe(user.id);

    await deleteFeedbackById(feedback.id);
  });

  test("Não deve criar feedback com nota inválida", async () => {
    await expect(createTestFeedback(user.id, "Nota inválida", 10)).rejects.toThrow();
    await expect(createTestFeedback(user.id, "Nota inválida", -1)).rejects.toThrow();
  });

  test("Não deve criar feedback sem mensagem", async () => {
    await expect(createTestFeedback(user.id, "", 3)).rejects.toThrow();
    await expect(createTestFeedback(user.id, null, 3)).rejects.toThrow();
  });

  test("Não deve criar feedback para usuário inexistente", async () => {
    await expect(createTestFeedback(999999, "Usuário inexistente", 5)).rejects.toThrow();
  });

  test("Deve permitir múltiplos feedbacks para o mesmo usuário", async () => {
    const feedback1 = await createTestFeedback(user.id, "Primeiro feedback", 5);
    const feedback2 = await createTestFeedback(user.id, "Segundo feedback", 3);

    expect(feedback1).toHaveProperty("id");
    expect(feedback2).toHaveProperty("id");
    expect(feedback1.id).not.toBe(feedback2.id);

    await deleteFeedbackById(feedback1.id);
    await deleteFeedbackById(feedback2.id);
  });

  test("Deve deletar o feedback criado", async () => {
    const fb = await createTestFeedback(user.id, "Feedback para deletar", 2);
    expect(fb).toHaveProperty("id");

    await deleteFeedbackById(fb.id);

    const found = await prisma.feedback.findUnique({ where: { id: fb.id } });
    expect(found).toBeNull();
  });

  test("Deve atualizar o feedback criado", async () => {
    const fb = await createTestFeedback(user.id, "Feedback para atualizar", 3);
    expect(fb).toHaveProperty("id");

    const updated = await updateFeedback(fb.id, {
      mensagem: "Feedback atualizado",
      nota: 5,
    });

    expect(updated).toHaveProperty("id", fb.id);
    expect(updated.mensagem).toBe("Feedback atualizado");
    expect(updated.nota).toBe(5);

    await deleteFeedbackById(fb.id);
  });
});