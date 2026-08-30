import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="统计"
        description="打卡热力图、专注时长趋势、各科分布"
      />
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          M5 里程碑：热力图 + 趋势 + 科目分布
        </CardContent>
      </Card>
    </div>
  );
}
