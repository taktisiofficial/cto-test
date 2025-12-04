import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Wallet } from "lucide-react";

export default function WalletPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage your wallets and payment methods.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-secondary" />
              Your Wallets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              This page will display your wallet information and payment methods.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
