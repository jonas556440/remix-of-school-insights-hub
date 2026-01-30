import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface APsDeficitChartProps {
  data: { name: string; deficit: number; total: number }[];
}

export function APsDeficitChart({ data }: APsDeficitChartProps) {
  const chartConfig = {
    deficit: {
      label: "Déficit de APs",
      color: "hsl(0, 84%, 60%)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 40, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fontSize: 11 }}
            width={75}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value, name, props) => [
              `${value} APs em déficit (${props.payload.total} escolas)`,
              "Déficit"
            ]}
          />
          <Bar 
            dataKey="deficit" 
            radius={[0, 4, 4, 0]}
            fill="hsl(0, 84%, 60%)"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.deficit > 50 ? "hsl(0, 84%, 50%)" : "hsl(25, 95%, 53%)"}
              />
            ))}
            <LabelList dataKey="deficit" position="right" fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
