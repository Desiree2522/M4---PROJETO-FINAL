const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para criar um usuário de teste
async function createTestUser() {
  const user = await prisma.usuario.create({
    data: {
      nome: "Usuário Teste",
      email: `teste${Date.now()}@example.com`,
      senha: "123456",
      tipo: "DONATARIO",
    },
  });
  return user;
}

// Função para deletar um usuário por id
async function deleteUserById(id) {
  await prisma.usuario.delete({
    where: { id },
  });
}

// Função para criar um feedback de teste
async function createTestFeedback(usuarioId, mensagem = "Feedback teste", nota = 5) {
  if (typeof nota !== "number" || nota < 1 || nota > 5) {
    throw new Error("Nota inválida");
  }
  if (!mensagem || typeof mensagem !== "string" || mensagem.trim() === "") {
    throw new Error("Mensagem obrigatória");
  }
  const feedback = await prisma.feedback.create({
    data: {
      usuarioId,
      mensagem,
      nota,
    },
  });
  return feedback;
}

// Função para atualizar um feedback
async function updateFeedback(id, dados) {
  const feedback = await prisma.feedback.update({
    where: { id },
    data: dados,
  });
  return feedback;
}



// Função para deletar feedback por id
async function deleteFeedbackById(id) {
  await prisma.feedback.delete({
    where: { id },
  });
}

// Função para limpar todos os feedbacks de um usuário
async function deleteFeedbacksByUserId(usuarioId) {
  await prisma.feedback.deleteMany({
    where: { usuarioId },
  });
}

module.exports = {
  createTestUser,
  deleteUserById,
  createTestFeedback,
  deleteFeedbackById,
  deleteFeedbacksByUserId,
  updateFeedback
};
