import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface MunicipioData {
  name: string;
  value: number;
}

interface MunicipiosChartProps {
  data: MunicipioData[];
}

export function MunicipiosChart({ data }: MunicipiosChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground border rounded-lg shadow-lg p-3">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value.toLocaleString('pt-BR')} escolas
          </p>
        </div>
      );
    }
    return null;
  };

  const colors = [
    'hsl(217, 91%, 48%)',
    'hsl(217, 91%, 53%)',
    'hsl(217, 91%, 58%)',
    'hsl(217, 91%, 63%)',
    'hsl(217, 91%, 68%)',
    'hsl(217, 91%, 73%)',
    'hsl(217, 91%, 78%)',
    'hsl(217, 91%, 83%)',
    'hsl(217, 91%, 88%)',
    'hsl(217, 91%, 90%)',
  ];

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis 
            type="number"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            width={75}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
