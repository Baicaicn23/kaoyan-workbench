import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function PomodoroPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="专注计时"
        code="FOCUS MODE"
        description="番茄工作法 · 专注时长自动计入每日总结"
      />
      <Card className="ak-corner border-border bg-card">
        <CardContent className="p-6 text-sm text-muted-foreground">
          开发中：反漂移番茄钟 + 专注记录（下个里程碑）
        </CardContent>
      </Card>
    </div>
  );
}
