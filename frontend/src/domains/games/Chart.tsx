import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import type { GameType } from "@/domains/types";
import { calculateUserScore } from "@/domains/games/helpers";

const chartConfig = {
  tap: {
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function ChartView({ game }: { game: GameType }) {
  const chartData = game.users.map((user) => {
    return {
      username: user.user.username,
      tap: calculateUserScore(user.userId, game),
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users scores</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full max-h-1/2 md:h-50"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 20,
            }}
          >
            <XAxis type="number" dataKey="tap" hide />
            <YAxis
              dataKey="username"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <Bar dataKey="tap" fill="var(--color-primary)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
