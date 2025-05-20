const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Cria local
async function createLocal(data) {
    return prisma.local.create({ data });
}

// Busca local por ID
async function getLocalById(id) {
    return prisma.local.findUnique({ where: { id } });
}

// Lista todos os locais
async function getLocais() {
    return prisma.local.findMany();
}

// Atualiza local
async function updateLocal(id, data) {
    try {
        return await prisma.local.update({
            where: { id },
            data
        });
    } catch (err) {
        return null;
    }
}

// Deleta local
async function deleteLocal(id) {
    try {
        return await prisma.local.delete({ where: { id } });
    } catch (err) {
        return null;
    }
}

module.exports = {
    createLocal,
    getLocalById,
    getLocais,
    updateLocal,
    deleteLocal
};
