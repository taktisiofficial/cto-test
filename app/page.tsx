import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Activity } from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Welcome back! Here's your financial overview.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Balance
                </p>
                <h3 className="mt-1 text-2xl font-bold text-foreground">
                  $24,563.00
                </h3>
                <div className="mt-1 flex items-center text-sm text-success">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="rounded-full bg-secondary/10 p-3">
                <DollarSign className="h-6 w-6 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Income
                </p>
                <h3 className="mt-1 text-2xl font-bold text-foreground">
                  $8,234.00
                </h3>
                <div className="mt-1 flex items-center text-sm text-success">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+8.2%</span>
                </div>
              </div>
              <div className="rounded-full bg-success/10 p-3">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Expenses
                </p>
                <h3 className="mt-1 text-2xl font-bold text-foreground">
                  $3,456.00
                </h3>
                <div className="mt-1 flex items-center text-sm text-danger">
                  <TrendingDown className="mr-1 h-4 w-4" />
                  <span>-3.1%</span>
                </div>
              </div>
              <div className="rounded-full bg-danger/10 p-3">
                <TrendingDown className="h-6 w-6 text-danger" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Cards
                </p>
                <h3 className="mt-1 text-2xl font-bold text-foreground">3</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  All active
                </p>
              </div>
              <div className="rounded-full bg-accent/10 p-3">
                <CreditCard className="h-6 w-6 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Grocery Store",
                    amount: "-$156.00",
                    date: "Today, 2:30 PM",
                    type: "expense",
                  },
                  {
                    name: "Salary Deposit",
                    amount: "+$3,500.00",
                    date: "Yesterday",
                    type: "income",
                  },
                  {
                    name: "Electric Bill",
                    amount: "-$89.00",
                    date: "Dec 2",
                    type: "expense",
                  },
                  {
                    name: "Freelance Work",
                    amount: "+$1,200.00",
                    date: "Dec 1",
                    type: "income",
                  },
                ].map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-800"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.date}
                      </p>
                    </div>
                    <span
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Food & Dining", amount: "$856", percent: 35, color: "bg-secondary" },
                  { name: "Transportation", amount: "$432", percent: 20, color: "bg-accent" },
                  { name: "Shopping", amount: "$654", percent: 25, color: "bg-warning" },
                  { name: "Entertainment", amount: "$234", percent: 15, color: "bg-info" },
                  { name: "Others", amount: "$123", percent: 5, color: "bg-gray-400" },
                ].map((category, index) => (
                  <div key={index}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {category.name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {category.amount}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                      <div
                        className={`h-full ${category.color}`}
                        style={{ width: `${category.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="primary" className="w-full">
                Add Transaction
              </Button>
              <Button variant="secondary" className="w-full">
                Transfer Money
              </Button>
              <Button variant="outline" className="w-full">
                Pay Bills
              </Button>
              <Button variant="outline" className="w-full">
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
