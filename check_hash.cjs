const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
    const user = await prisma.user.findUnique({ where: { email: 'vk@gmail.com' } });
    console.log('Hash in DB:', user.password);
    console.log('Matches "password":', bcrypt.compareSync('password', user.password));
    
    // Also check test@test.com
    const emp = await prisma.user.findUnique({ where: { email: 'test@test.com' } });
    console.log('Emp Hash in DB:', emp.password);
    console.log('Emp Matches "password":', bcrypt.compareSync('password', emp.password));
}
main().finally(() => prisma.$disconnect());
