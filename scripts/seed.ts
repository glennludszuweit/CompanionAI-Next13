const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: 'Influencers' },
        { name: 'Celebrities' },
        { name: 'Musicians' },
        { name: 'Sports' },
        { name: 'Techies' },
        { name: 'Scientists' },
        { name: 'Politicians' },
      ],
    });
  } catch (error) {
    console.error(error);
  } finally {
    await db.$disconnect();
  }
}

main();
