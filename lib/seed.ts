import { prisma } from "./db";

async function main() {
  console.log("Seeding database...");

  const categoryData = [
    { name: "Salary", type: "income" as const, color: "#10b981", icon: "trending-up" },
    { name: "Freelance", type: "income" as const, color: "#10b981", icon: "briefcase" },
    { name: "Bonus", type: "income" as const, color: "#10b981", icon: "gift" },
    { name: "Food & Dining", type: "expense" as const, color: "#f59e0b", icon: "utensils" },
    { name: "Transportation", type: "expense" as const, color: "#3b82f6", icon: "car" },
    { name: "Shopping", type: "expense" as const, color: "#ec4899", icon: "shopping-bag" },
    { name: "Entertainment", type: "expense" as const, color: "#8b5cf6", icon: "film" },
    { name: "Utilities", type: "expense" as const, color: "#6366f1", icon: "zap" },
  ];

  let categoryCount = 0;
  for (const category of categoryData) {
    try {
      await prisma.category.create({ data: category });
      categoryCount++;
    } catch (e) {
      // Category might already exist
    }
  }
  console.log("Categories created:", categoryCount);

  const accountData = [
    { name: "Checking Account", type: "checking" as const, balance: 5000, currency: "USD" },
    { name: "Savings Account", type: "savings" as const, balance: 15000, currency: "USD" },
    { name: "Credit Card", type: "credit" as const, balance: -2000, currency: "USD" },
  ];

  let accountCount = 0;
  for (const account of accountData) {
    try {
      await prisma.account.create({ data: account });
      accountCount++;
    } catch (e) {
      // Account might already exist
    }
  }
  console.log("Accounts created:", accountCount);

  const allCategories = await prisma.category.findMany();
  const allAccounts = await prisma.account.findMany();

  if (allCategories.length > 0 && allAccounts.length > 0) {
    const transactionsToCreate = [
      {
        description: "Monthly salary",
        amount: 3500,
        type: "income" as const,
        date: new Date(new Date().setDate(new Date().getDate() - 5)),
        categoryId: allCategories.find((c) => c.name === "Salary")!.id,
        accountId: allAccounts.find((a) => a.name === "Checking Account")!.id,
      },
      {
        description: "Grocery shopping",
        amount: 156.5,
        type: "expense" as const,
        date: new Date(),
        categoryId: allCategories.find((c) => c.name === "Food & Dining")!.id,
        accountId: allAccounts.find((a) => a.name === "Checking Account")!.id,
      },
      {
        description: "Uber ride",
        amount: 24.99,
        type: "expense" as const,
        date: new Date(new Date().setDate(new Date().getDate() - 2)),
        categoryId: allCategories.find((c) => c.name === "Transportation")!.id,
        accountId: allAccounts.find((a) => a.name === "Checking Account")!.id,
      },
      {
        description: "Movie tickets",
        amount: 30,
        type: "expense" as const,
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
        categoryId: allCategories.find((c) => c.name === "Entertainment")!.id,
        accountId: allAccounts.find((a) => a.name === "Checking Account")!.id,
      },
      {
        description: "Freelance project",
        amount: 800,
        type: "income" as const,
        date: new Date(new Date().setDate(new Date().getDate() - 10)),
        categoryId: allCategories.find((c) => c.name === "Freelance")!.id,
        accountId: allAccounts.find((a) => a.name === "Checking Account")!.id,
      },
    ];

    let transactionCount = 0;
    for (const transaction of transactionsToCreate) {
      try {
        await prisma.transaction.create({ data: transaction });
        transactionCount++;
      } catch (e) {
        // Transaction might already exist
      }
    }

    console.log("Transactions created:", transactionCount);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
