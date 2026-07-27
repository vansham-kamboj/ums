import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const hash = "$2a$12$e./d5tPfnViibFrgyCOsye06ApMvn5WAGxBf35Z/zwY5z8lf2IJRi"; // "password"
    await prisma.user.updateMany({
        where: { email: { in: ['vk@gmail.com', 'adnan@gmail.com'] } },
        data: { password: hash }
    });
    console.log("Updated passwords to 'password'");
}
main().finally(() => prisma.$disconnect());
