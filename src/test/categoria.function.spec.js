const {
  createTestCategoria,
  getCategoriaById,
  getCategorias,
  updateCategoria,
  deleteCategoria,
  deleteCategoriasByName,
  prisma,
} = require("./categoria.function.js");

describe("Funções de Categoria", () => {
  let categoria;

  afterAll(async () => {
    if (categoria) {
      try {
        await deleteCategoria(categoria.id);
      } catch (e) {
        // Categoria já pode ter sido deletada, ignore
      }
    }
    await prisma.$disconnect();
  });

  test("Deve criar uma categoria com sucesso", async () => {
    categoria = await createTestCategoria();
    expect(categoria).toBeDefined();
    expect(categoria).toHaveProperty("id");
    expect(categoria.nome).toMatch(/Categoria Teste/);
    expect(categoria.ativo).toBe(true);
  });

  test("Deve buscar uma categoria pelo ID", async () => {
    expect(categoria).toBeDefined();
    const found = await getCategoriaById(categoria.id);
    expect(found).not.toBeNull();
    expect(found.id).toBe(categoria.id);
  });

  test("Deve listar categorias", async () => {
    expect(categoria).toBeDefined();
    const categorias = await getCategorias();
    expect(Array.isArray(categorias)).toBe(true);
    const found = categorias.find(c => c.id === categoria.id);
    expect(found).toBeDefined();
    expect(found.nome).toBe(categoria.nome);
  });

  test("Deve atualizar uma categoria", async () => {
    expect(categoria).toBeDefined();
    const updated = await updateCategoria(categoria.id, { nome: "Categoria Atualizada" });
    expect(updated).toBeDefined();
    expect(updated.nome).toBe("Categoria Atualizada");
    categoria = updated;
  });

  test("Deve deletar uma categoria", async () => {
    expect(categoria).toBeDefined();
    const deletada = await deleteCategoria(categoria.id);
    expect(deletada).toHaveProperty("id", categoria.id);
    const found = await getCategoriaById(categoria.id);
    expect(found).toBeNull();
    categoria = null;
  });
});