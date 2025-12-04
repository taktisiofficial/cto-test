import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TrendingUp } from "lucide-react";

export default function TrendsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trends</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track your financial trends and patterns over time.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Financial Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              This page will display charts and trends for your financial data.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
