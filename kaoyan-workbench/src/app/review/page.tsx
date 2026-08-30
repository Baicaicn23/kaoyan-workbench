import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="错题本"
        description="错题归档与 FSRS 间隔复习队列"
      />
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          M4 里程碑：错题录入 + 复习打分 + 间隔排期
        </CardContent>
      </Card>
    </div>
  );
}
