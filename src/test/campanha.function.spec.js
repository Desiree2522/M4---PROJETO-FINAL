const {
  prisma,
  createTestCampanha,
  getCampanhaById,
  updateCampanha,
  deleteCampanhaById,
  deleteCampanhasByUserId,
} = require("./campanha.function.js");

describe("Funções de Campanhas", () => {
  let user, campanha;

  beforeAll(async () => {
    // Crie um usuário de teste realista conforme seu schema
    user = await prisma.usuario.create({
      data: {
        nome: "Usuário Teste",
        email: `campanha_teste_${Date.now()}@mail.com`,
        senha: "123456",
        tipo: "DOADOR"
      }
    });
  });

  afterAll(async () => {
    await deleteCampanhasByUserId(user.id);
    await prisma.usuario.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  });

  test("Deve criar uma campanha com sucesso (POST)", async () => {
    campanha = await createTestCampanha(user.id);
    expect(campanha).toHaveProperty("id");
    expect(campanha.criadorId).toBe(user.id);
  });

  test("Deve buscar uma campanha pelo ID (GET)", async () => {
    const found = await getCampanhaById(campanha.id);
    expect(found).not.toBeNull();
    expect(found.id).toBe(campanha.id);
  });

  test("Deve atualizar uma campanha (PUT)", async () => {
    const updated = await updateCampanha(campanha.id, {
      titulo: "Campanha Atualizada",
      meta: 999.99,
    });
    expect(updated.titulo).toBe("Campanha Atualizada");
    expect(updated.meta).toBeCloseTo(999.99);
  });

  test("Deve deletar uma campanha (DELETE)", async () => {
    await deleteCampanhaById(campanha.id);
    const found = await getCampanhaById(campanha.id);
    expect(found).toBeNull();
  });
});