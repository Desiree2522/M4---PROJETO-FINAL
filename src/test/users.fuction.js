const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Cria usuário
async function createUser(data) {
    // Verifica se já existe usuário com o mesmo email
    const exists = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (exists) throw new Error('Email já cadastrado');
    // Criptografa a senha
    const hashed = await bcrypt.hash(data.senha, 10);
    const user = await prisma.usuario.create({
        data: {
            nome: data.nome,
            email: data.email,
            senha: hashed,
            tipo: data.tipo || 'DONATARIO'
        }
    });
    return user;
}

// Busca usuário por ID
async function getLoggedUser(id) {
    const user = await prisma.usuario.findUnique({ where: { id } });
    return user || null;
}

// Lista todos usuários
async function getUsers() {
    return prisma.usuario.findMany();
}

// Edita usuário
async function editUser(id, data) {
    try {
        const user = await prisma.usuario.update({
            where: { id },
            data
        });
        return user;
    } catch (err) {
        return null;
    }
}

// Deleta usuário
async function deleteUser(id) {
    try {
        const user = await prisma.usuario.delete({
            where: { id }
        });
        return user;
    } catch (err) {
        return null;
    }
}

module.exports = {
    createUser,
    getLoggedUser,
    getUsers,
    editUser,
    deleteUser
};
