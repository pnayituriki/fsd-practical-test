import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useUserStats } from "../hooks/useUserStats";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "../components/ui/skeleton";
import { cn } from "../lib/utils";

export default function UserStats7d() {
  const { data, isLoading, isError, error } = useUserStats();

  if (isLoading) return <Skeleton className="h-60 w-full rounded-lg" />;
  if (isError)
    return (
      <Card className="p-6 text-destructive">
        {(error as Error).message || "Failed to load stats"}
      </Card>
    );

  const stats = data?.data || [];
  const total = stats.reduce((a, b) => a + b.count, 0);
  const avg = stats.length ? (total / stats.length).toFixed(1) : "0";
  const max = stats.length ? Math.max(...stats.map((d) => d.count)) : 0;
  const peakDay = stats.find((d) => d.count === max)?.day ?? "";
  const updatedAt = data?.meta?.timestamp
    ? new Date(data.meta.timestamp).toLocaleString()
    : "";

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* KPI CARDS */}
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
        <KpiCard title="New Users (7d)" value={total} accent />
        <KpiCard title="Average / Day" value={avg} />
        <KpiCard
          title="Peak"
          value={max}
          subtitle={
            max > 0
              ? `${new Date(peakDay).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}`
              : "No activity yet"
          }
        />
      </div>

      {/* CHART */}
      <Card className="p-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            User Creation (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          {stats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <XAxis
                  dataKey="day"
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString("en-US", {
                      weekday: "short",
                    })
                  }
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))", opacity: 0.15 }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    borderRadius: "0.5rem",
                    border: "1px solid hsl(var(--border))",
                    fontSize: "0.8rem",
                  }}
                  labelFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <Bar
                  dataKey="count"
                   fill="#0E3A5F"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No user activity in the last 7 days
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-5 text-right">
            Last updated: {updatedAt}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

type KpiCardProps = {
  title: string;
  value: string | number;
  accent?: boolean;
  subtitle?: string;
};
const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  accent = false,
  subtitle,
}) => {
  return (
    <Card
      className={cn(
        "p-6 h-full transition-all border-border hover:shadow-md bg-card",
        accent && "bg-primary/5 border-primary/30"
      )}
    >
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          {title}
          {accent && (
            <span className="inline-block w-2 h-2 bg-primary rounded-full ml-1" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-5xl font-bold leading-tight tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};
