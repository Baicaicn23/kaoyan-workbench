import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function PomodoroPage() {
  return (
    <div className="p-8">
      <PageHeader
        title="番茄钟"
        description="25+5 专注法，专注时长自动计入打卡"
      />
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          M2 里程碑：反漂移计时 + 专注记录
        </CardContent>
      </Card>
    </div>
  );
}
