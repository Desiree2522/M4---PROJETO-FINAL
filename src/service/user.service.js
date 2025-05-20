import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

export async function getAllUsersService() {
  return prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      tipo: true,
      criadoEm: true,
      telefone: true,
      ativo: true,
      fotoUrl: true
    }
  });
}

export async function getUserByIdService(id) {
  return prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      tipo: true,
      criadoEm: true,
      telefone: true,
      ativo: true,
      fotoUrl: true,
      doacoes: true,
    }
  });
}

export async function createUserService(data) {
  return prisma.usuario.create({
    data: {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      tipo: data.tipo || 'DONATARIO', // String direta ao invés do enum
      telefone: data.telefone,
      fotoUrl: data.fotoUrl
    }
  });
}

export async function updateUserService(id, data) {
  return prisma.usuario.update({
    where: { id },
    data
  });
}

export async function deleteUserService(id) {
  return prisma.usuario.delete({
    where: { id }
  });
}

export async function getUserByEmailService(email) {
  return prisma.usuario.findUnique({
    where: { email }
  });
}