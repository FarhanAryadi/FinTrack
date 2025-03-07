import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Hapus data yang ada
  await prisma.category.deleteMany();

  // Buat kategori default
  const categories = [
    { name: 'Food', icon: 'food', type: 'EXPENSE' },
    { name: 'Transport', icon: 'car', type: 'EXPENSE' },
    { name: 'Shopping', icon: 'shopping-outline', type: 'EXPENSE' },
    { name: 'Entertainment', icon: 'movie-open', type: 'EXPENSE' },
    { name: 'Bills', icon: 'file-document-outline', type: 'EXPENSE' },
    { name: 'Salary', icon: 'cash-multiple', type: 'INCOME' },
    { name: 'Investment', icon: 'chart-line', type: 'INCOME' },
    { name: 'Other Income', icon: 'plus-circle-outline', type: 'INCOME' },
    { name: 'Other Expense', icon: 'minus-circle-outline', type: 'EXPENSE' }
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: category
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 