"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Zap, Plus, Send, FileText, BarChart3 } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-[var(--warning-500)]" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/transactions?action=new">
            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
            disabled
          >
            <Send className="h-4 w-4" />
            <span>Transfer Money</span>
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            disabled
          >
            <FileText className="h-4 w-4" />
            <span>Pay Bills</span>
          </Button>
          <Link href="/analytics">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>View Reports</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
