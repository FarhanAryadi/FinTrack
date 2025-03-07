import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	try {
		// Buat tabel kategori jika belum ada
		await prisma.$executeRaw`
			CREATE TABLE IF NOT EXISTS "fintrack"."Category" (
				"id" TEXT NOT NULL,
				"name" TEXT NOT NULL,
				"icon" TEXT NOT NULL,
				"type" TEXT NOT NULL,
				"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
				"updatedAt" TIMESTAMP(3) NOT NULL,
				CONSTRAINT "Category_pkey" PRIMARY KEY ("id"),
				CONSTRAINT "Category_name_key" UNIQUE ("name")
			)
		`;

		// Hapus data kategori yang ada
		await prisma.$executeRaw`TRUNCATE TABLE "fintrack"."Category" CASCADE`;

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
			{ name: 'Other Expense', icon: 'minus-circle-outline', type: 'EXPENSE' },
		];

		for (const category of categories) {
			// @ts-ignore
			await prisma.category.create({
				data: category,
			});
		}

		console.log('Seed data created successfully');
	} catch (error) {
		console.error('Error seeding data:', error);
	} finally {
		await prisma.$disconnect();
	}
}

main();
