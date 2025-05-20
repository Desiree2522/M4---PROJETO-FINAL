const {
    createLocal,
    getLocalById,
    getLocais,
    updateLocal,
    deleteLocal
} = require('./locais.fuction');

describe('Locais Functions Integration', () => {
    let localCriado;
    let localId;

    afterAll(async () => {
        if (localId) {
            await deleteLocal(localId);
        }
    });

    test('createLocal deve criar um novo local', async () => {
    const data = {
        cidade: 'TesteCity',
        estado: 'TesteState',
        pais: 'TestePais',
    };
    localCriado = await createLocal(data);
    localId = localCriado.id;
    expect(localCriado).toHaveProperty('id');
    expect(localCriado.cidade).toBe(data.cidade);
    expect(localCriado.estado).toBe(data.estado);
    expect(localCriado.pais).toBe(data.pais);
});

    test('getLocalById deve retornar o local criado', async () => {
    expect(localId).toBeDefined(); // Garante que localId foi definido no teste anterior
    const local = await getLocalById(localId);
    expect(local).toBeDefined();
    expect(local.id).toBe(localId);
});

   test('getLocais deve retornar uma lista incluindo o local criado', async () => {
    expect(localId).toBeDefined();
    expect(localCriado).toBeDefined();
    const locais = await getLocais();
    expect(Array.isArray(locais)).toBe(true);
    const found = locais.find(l => l.id === localId);
    expect(found).toBeDefined();
    expect(found.cidade).toBe(localCriado.cidade);
});

test('updateLocal deve atualizar os campos do local', async () => {
    expect(localId).toBeDefined(); // Garante que localId foi definido
    const atualizado = await updateLocal(localId, { cidade: 'CidadeAtualizada' });
    expect(atualizado).toBeDefined();
    expect(atualizado.cidade).toBe('CidadeAtualizada');
});

    test('deleteLocal deve deletar o local', async () => {
    expect(localId).toBeDefined();
    const deletado = await deleteLocal(localId);
    expect(deletado).toHaveProperty('id', localId);
    const local = await getLocalById(localId);
    expect(local).toBeNull();
    localId = null;
});

    test('getLocalById deve retornar null para local inexistente', async () => {
        const local = await getLocalById('non-existent-id');
        expect(local).toBeNull();
    });

    test('updateLocal deve retornar null para local inexistente', async () => {
        const atualizado = await updateLocal('non-existent-id', { cidade: 'Nada' });
        expect(atualizado).toBeNull();
    });

    test('deleteLocal deve retornar null para local inexistente', async () => {
        const deletado = await deleteLocal('non-existent-id');
        expect(deletado).toBeNull();
    });
});