import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function PlanPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="周计划"
        description="按周排布任务，月视图总览节奏"
      />
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          M3 里程碑：周视图 + 重复规则 + 月视图
        </CardContent>
      </Card>
    </div>
  );
}
