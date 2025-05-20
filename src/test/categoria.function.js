const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Cria uma categoria de teste
async function createTestCategoria(nome = `Categoria Teste ${Date.now()}`, descricao = "Descrição teste", iconeUrl = null) {
  return await prisma.categoria.create({
    data: {
      nome,
      descricao,
      iconeUrl,
      ativo: true,
    },
  });
}

// Busca categoria por ID
async function getCategoriaById(id) {
  return await prisma.categoria.findUnique({ where: { id } });
}

// Lista todas as categorias
async function getCategorias() {
  return await prisma.categoria.findMany();
}

// Atualiza categoria
async function updateCategoria(id, data) {
  return await prisma.categoria.update({
    where: { id },
    data,
  });
}

// Deleta categoria
async function deleteCategoria(id) {
  return await prisma.categoria.delete({ where: { id } });
}

// Deleta todas as categorias de teste (por nome)
async function deleteCategoriasByName(nome) {
  return await prisma.categoria.deleteMany({ where: { nome } });
}

module.exports = {
  createTestCategoria,
  getCategoriaById,
  getCategorias,
  updateCategoria,
  deleteCategoria,
  deleteCategoriasByName,
  prisma,
};