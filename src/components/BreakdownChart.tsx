import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface BreakdownData {
  name: string;
  value: number;
  color: string;
}

interface BreakdownChartProps {
  title: string;
  subtitle: string;
  data: BreakdownData[];
  delay?: number;
}

const BreakdownChart = ({ title, subtitle, data, delay = 0 }: BreakdownChartProps) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const total = data.reduce((a, b) => a + b.value, 0);
      return (
        <div className="glass-card p-3 border border-border/50 bg-card">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.payload.color }}
            />
            <span className="text-foreground font-medium">{item.name}</span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {item.value} kg ({((item.value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.08) return null;

    return (
      <text
        x={x}
        y={y}
        fill="hsl(var(--foreground))"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="chart-container h-full"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={70}
              innerRadius={30}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2 p-1.5 rounded-md bg-secondary/30"
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BreakdownChart;
