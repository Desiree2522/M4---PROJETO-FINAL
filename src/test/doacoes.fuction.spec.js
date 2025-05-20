const {
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
} = require("./doacoes.fuction.js");

describe("Funções de Doações", () => {
  let user, campanha, categoria, local, doacao;

  beforeAll(async () => {
    user = await createTestUser();
    campanha = await createTestCampanha(user.id);
    categoria = await createTestCategoria();
    local = await createTestLocal();
  });

 afterAll(async () => {
  await deleteDoacoesByUserId(user.id);
  await prisma.campanha.delete({ where: { id: campanha.id } });
  await prisma.usuario.delete({ where: { id: user.id } });
  await prisma.categoria.delete({ where: { id: categoria.id } });
  await prisma.local.delete({ where: { id: local.id } });
  await prisma.$disconnect();
});

  test("Deve criar uma doação com sucesso (POST)", async () => {
    doacao = await createTestDoacao({
      valor: 150,
      tipoProduto: "LIVRO",
      produto: "Livro Teste",
      status: "PENDENTE",
      usuarioId: user.id,
      campanhaId: campanha.id,
      categoriaId: categoria.id,
      localId: local.id,
    });

    expect(doacao).toHaveProperty("id");
    expect(doacao.valor).toBe(150);
    expect(doacao.usuarioId).toBe(user.id);
  });

  test("Deve buscar uma doação pelo ID (GET)", async () => {
    const found = await getDoacaoById(doacao.id);
    expect(found).not.toBeNull();
    expect(found.id).toBe(doacao.id);
  });

  test("Deve atualizar uma doação (PUT)", async () => {
    const updated = await updateDoacao(doacao.id, {
      valor: 200,
      produto: "Livro Atualizado",
      status: "FEITA",
    });
    expect(updated.valor).toBe(200);
    expect(updated.produto).toBe("Livro Atualizado");
    expect(updated.status).toBe("FEITA");
  });

  test("Deve deletar uma doação (DELETE)", async () => {
    await deleteDoacaoById(doacao.id);
    const found = await getDoacaoById(doacao.id);
    expect(found).toBeNull();
  });
});