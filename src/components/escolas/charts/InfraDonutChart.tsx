import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface InfraData {
  name: string;
  value: number;
  color: string;
}

interface InfraDonutChartProps {
  data: InfraData[];
}

export function InfraDonutChart({ data }: InfraDonutChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-popover text-popover-foreground border rounded-lg shadow-lg p-3">
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            {item.value}% adequado
          </p>
        </div>
      );
    }
    return null;
  };
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-sm font-bold"
      >
        {`${value}%`}
      </text>
    );
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={3} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value, entry: any) => (
              <span className="text-sm text-foreground">
                {value}: {entry.payload.value}%
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
