const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTestCampanha(criadorId) {
  return await prisma.campanha.create({
    data: {
      titulo: "Campanha de Teste",
      descricao: "Uma campanha teste",
      meta: 1000,
      criadorId,
    },
  });
}

async function getCampanhaById(id) {
  return await prisma.campanha.findUnique({ where: { id } });
}

async function updateCampanha(id, dados) {
  return await prisma.campanha.update({ where: { id }, data: dados });
}

async function deleteCampanhaById(id) {
  return await prisma.campanha.delete({ where: { id } });
}

async function deleteCampanhasByUserId(userId) {
  await prisma.campanha.deleteMany({ where: { criadorId: userId } });
}

module.exports = {
  prisma,
  createTestCampanha,
  getCampanhaById,
  updateCampanha,
  deleteCampanhaById,
  deleteCampanhasByUserId,
};
