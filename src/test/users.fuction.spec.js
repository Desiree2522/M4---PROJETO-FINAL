// c:\Users\WINDOWS\M4---PROJETO-FINAL\src\test\users.fuction.spec.js
const { createUser, 
    getLoggedUser, 
    getUsers, 
    editUser, 
    deleteUser
 } = require('./users.fuction');

 // Descreve os testes de integração
describe('User Functions Integration', () => {
    let createdUser;
    let userId;

    afterAll(async () => {
        if (userId) {
            await deleteUser(userId);
        }
    });

    // Testes de integração
    test('createUser should create a new user', async () => {
        const userData = {
            nome: 'Test User',
            email: `testuser_${Date.now()}@mail.com`,
            senha: '123456',
            tipo: 'DONATARIO'
        };
        createdUser = await createUser(userData);
        userId = createdUser.id;
        expect(createdUser).toHaveProperty('id');
        expect(createdUser.nome).toBe(userData.nome);
        expect(createdUser.email).toBe(userData.email);
        expect(createdUser.tipo).toBe(userData.tipo);
    });

    // Testa se o usuário foi criado corretamente
    test('getLoggedUser should return the created user', async () => {
        const user = await getLoggedUser(userId);
        expect(user).toBeDefined();
        expect(user.id).toBe(userId);
        expect(user.nome).toBe(createdUser.nome);
    });

    // Testa se o usuário foi criado corretamente
    test('getUsers should return a list including the created user', async () => {
        const users = await getUsers();
        expect(Array.isArray(users)).toBe(true);
        const found = users.find(u => u.id === userId);
        expect(found).toBeDefined();
        expect(found.email).toBe(createdUser.email);
    });

    // Testa se o usuário foi criado corretamente
    test('editUser should update user fields', async () => {
        const updated = await editUser(userId, { nome: 'Updated Name' });
        expect(updated).toBeDefined();
        expect(updated.nome).toBe('Updated Name');
    });


    // deleta o usuário criado
    // Testa se o usuário foi deletado corretamente
    test('deleteUser should delete the user', async () => {
        const deleted = await deleteUser(userId);
        expect(deleted).toHaveProperty('id', userId);
        // Confirm deletion
        const user = await getLoggedUser(userId);
        expect(user).toBeNull();
        userId = null; // Prevent afterAll from trying to delete again
    });

    test('getLoggedUser should return null for non-existent user', async () => {
        const user = await getLoggedUser('non-existent-id');
        expect(user).toBeNull();
    });

    test('editUser should return null for non-existent user', async () => {
        const updated = await editUser('non-existent-id', { nome: 'Does Not Exist' });
        expect(updated).toBeNull();
    });

    test('deleteUser should return null for non-existent user', async () => {
        const deleted = await deleteUser('non-existent-id');
        expect(deleted).toBeNull();
    });

   // ...existing code...

test('createUser should not allow duplicate emails', async () => {
    // Garante que o mesmo email será usado nas duas tentativas
    const email = `duplicate_${Date.now()}@mail.com`;
    const userData = {
        nome: 'Duplicate User',
        email,
        senha: '123456',
        tipo: 'DONATARIO'
    };
    const user = await createUser(userData);
    // Tenta criar outro com o MESMO email
    await expect(createUser(userData)).rejects.toThrow();
    // Limpa o usuário criado
    await deleteUser(user.id);
});
});

