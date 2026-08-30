import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="数据统计"
        code="STATISTICS"
        description="打卡热力图、专注时长趋势、模块分布"
      />
      <Card className="ak-corner border-border bg-card">
        <CardContent className="p-6 text-sm text-muted-foreground">
          开发中：热力图完整视图 + 时长趋势 + 模块分布
        </CardContent>
      </Card>
    </div>
  );
}
