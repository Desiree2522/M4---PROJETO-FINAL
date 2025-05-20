const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Cria usuário de teste
async function createTestUser() {
  return await prisma.usuario.create({
    data: {
      nome: "Usuário Teste",
      email: `doacao${Date.now()}@example.com`,
      senha: "123456",
      tipo: "DOADOR",
    },
  });
}

// Cria campanha de teste
async function createTestCampanha(criadorId) {
  return await prisma.campanha.create({
    data: {
      titulo: "Campanha Teste",
      descricao: "Descrição teste",
      meta: 1000,
      criadorId,
    },
  });
}

// Cria categoria de teste
async function createTestCategoria() {
  return await prisma.categoria.create({
    data: {
      nome: `Categoria Teste ${Date.now()}`,
    },
  });
}

// Cria local de teste
async function createTestLocal() {
  return await prisma.local.create({
    data: {
      cidade: "Cidade Teste",
      estado: "Estado Teste",
      pais: "Brasil",
    },
  });
}

// Cria doação de teste
async function createTestDoacao({
  valor = 100,
  tipoProduto = "LIVRO",
  produto = "Livro Teste",
  status = "PENDENTE",
  usuarioId,
  campanhaId,
  categoriaId,
  localId,
} = {}) {
  return await prisma.doacao.create({
    data: {
      valor,
      tipoProduto,
      produto,
      status,
      usuarioId,
      campanhaId,
      categoriaId,
      localId,
    },
  });
}

// Busca doação por ID
async function getDoacaoById(id) {
  return await prisma.doacao.findUnique({ where: { id } });
}

// Atualiza doação
async function updateDoacao(id, dados) {
  return await prisma.doacao.update({
    where: { id },
    data: dados,
  });
}

// Deleta doação por id
async function deleteDoacaoById(id) {
  await prisma.doacao.delete({ where: { id } });
}

// Limpa todas as doações de um usuário
async function deleteDoacoesByUserId(usuarioId) {
  await prisma.doacao.deleteMany({ where: { usuarioId } });
}

module.exports = {
  prisma,
  createTestUser,
  createTestCampanha,
  createTestCategoria,
  createTestLocal,
  createTestDoacao,
  getDoacaoById,
  updateDoacao,
  deleteDoacaoById,
  deleteDoacoesByUserId,
};