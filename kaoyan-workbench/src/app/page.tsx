import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="今日看板"
        description="考试倒计时、今日任务、打卡与专注总览"
      />
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          M1 里程碑：倒计时 + 今日任务 + 打卡 + 热力图
        </CardContent>
      </Card>
    </div>
  );
}
