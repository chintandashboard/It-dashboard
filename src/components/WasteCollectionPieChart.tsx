import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useWasteData } from "@/context/WasteDataContext";
import { calculateTotals, filterDataByPeriod, TimePeriod } from "@/data/wasteData";
import { Recycle, Leaf, Package } from "lucide-react";

const COLORS = [
  "hsl(199, 89%, 48%)",
  "hsl(160, 84%, 39%)",
  "hsl(45, 93%, 58%)",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
        <p className="text-foreground font-medium">{payload[0].name}</p>
        <p className="text-muted-foreground text-sm">
          {payload[0].value.toLocaleString()} kg
        </p>
      </div>
    );
  }
  return null;
};

const WasteCollectionPieChart = () => {
  const { wasteData } = useWasteData();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("day");

  useEffect(() => {
    const handler = (e: Event) => {
      const period = (e as CustomEvent<TimePeriod>).detail;
      if (period) setTimePeriod(period);
    };
    window.addEventListener("report-period-selected", handler as EventListener);
    return () => window.removeEventListener("report-period-selected", handler as EventListener);
  }, []);

  const filteredData = useMemo(() => filterDataByPeriod(wasteData, timePeriod), [wasteData, timePeriod]);
  const totals = calculateTotals(filteredData);

  const chartData = [
    { name: "Total Waste", value: totals.totalWaste, color: COLORS[0], icon: Package },
    { name: "Recycled", value: totals.recycling, color: COLORS[1], icon: Recycle },
    { name: "Composted", value: totals.composted, color: COLORS[2], icon: Leaf },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="chart-container p-4 flex-1"
    >
      <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3 flex items-center gap-2">
        <Recycle className="w-4 h-4 text-primary" />
        Waste Collection & Processing
      </h3>

      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 sm:gap-6">
        <div className="w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 w-full space-y-2">
          {chartData.map((item, index) => {
            const Icon = item.icon;
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
            return (
              <div key={index} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <Icon className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {item.value.toLocaleString()} kg
                  </span>
                  <span className="text-muted-foreground">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default WasteCollectionPieChart;
