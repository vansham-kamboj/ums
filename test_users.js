import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.user.findMany({take: 10});
    console.log(users.map(u => `${u.email} (${u.scope})`));
}
main().finally(() => prisma.$disconnect());
