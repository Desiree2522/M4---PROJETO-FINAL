const {
  createTestUser,
  deleteUserById,
  createTestFeedback,
  deleteFeedbackById,
  deleteFeedbacksByUserId,
    updateFeedback,
} = require("./feedbacks.function.js");

const { PrismaClient } = require ("@prisma/client");
const prisma = new PrismaClient();

describe("Funções de Feedback", () => {
  let user;
  let feedback;

  beforeAll(async () => {
    user = await createTestUser();
  });

  afterAll(async () => {
    await deleteFeedbacksByUserId(user.id);
    await deleteUserById(user.id);
    await prisma.$disconnect();
  });

  test("Deve criar um feedback com sucesso", async () => {
    feedback = await createTestFeedback(user.id, "Feedback de teste", 4);

    expect(feedback).toHaveProperty("id");
    expect(feedback.mensagem).toBe("Feedback de teste");
    expect(feedback.nota).toBe(4);
    expect(feedback.usuarioId).toBe(user.id);
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

     // Limpa feedbacks criados
    await deleteFeedbackById(feedback1.id);
    await deleteFeedbackById(feedback2.id);
  });

  test("Deve deletar o feedback criado", async () => {
    // Cria um novo feedback para deletar
    const fb = await createTestFeedback(user.id, "Feedback para deletar", 2);
    await deleteFeedbackById(fb.id);

    // Verifica se feedback foi deletado
    const found = await prisma.feedback.findUnique({
      where: { id: fb.id },
    });

    expect(found).toBeNull();
  });

  test("Deve atualizar o feedback criado", async () => {
    // Cria um novo feedback para atualizar
    const fb = await createTestFeedback(user.id, "Feedback para atualizar", 3);
    const updatedFeedback = await updateFeedback(fb.id, {
      mensagem: "Feedback atualizado",
      nota: 5,
    });

    expect(updatedFeedback).toHaveProperty("id", fb.id);
    expect(updatedFeedback).toHaveProperty("mensagem", "Feedback atualizado");
    expect(updatedFeedback).toHaveProperty("nota", 5);

    // Limpa feedback criado
    await deleteFeedbackById(fb.id);
  });
});

