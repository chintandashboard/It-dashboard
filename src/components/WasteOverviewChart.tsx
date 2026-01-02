import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { getChartData, filterDataByPeriod, TimePeriod } from "@/data/wasteData";
import { useWasteData } from "@/context/WasteDataContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { key: "plastic", label: "Plastic", color: "hsl(340, 82%, 52%)", icon: "🧴" },
  { key: "paper", label: "Paper", color: "hsl(45, 93%, 58%)", icon: "📄" },
  { key: "glass", label: "Glass", color: "hsl(199, 89%, 48%)", icon: "🫙" },
  { key: "metal", label: "Metal", color: "hsl(220, 70%, 55%)", icon: "🥫" },
  { key: "ewaste", label: "E-Waste", color: "hsl(280, 65%, 60%)", icon: "🔋" },
  { key: "others", label: "Others", color: "hsl(15, 80%, 55%)", icon: "📦" },
];

const timePeriods = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "quarter", label: "Quarter" },
  { key: "year", label: "Year" },
];

// Category summary cards at top of chart
const CategorySummaryCards = ({ data }: { data: any[] }) => {
  const totals = categories.map(cat => ({
    ...cat,
    total: data.reduce((sum, row) => sum + (row[cat.key] || 0), 0)
  }));

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
      {totals.map((cat, index) => (
        <motion.div
          key={cat.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="relative p-2 sm:p-3 rounded-xl text-center overflow-hidden"
          style={{ backgroundColor: `${cat.color}15` }}
        >
          {/* Background icon */}
          <div className="absolute top-1 right-1 text-2xl opacity-20">{cat.icon}</div>
          
          <div className="relative z-10">
            <div className="text-lg sm:text-xl font-bold" style={{ color: cat.color }}>
              {cat.total.toLocaleString()}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">
              {cat.label}
            </div>
          </div>
          
          {/* Bottom accent line */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: cat.color }}
          />
        </motion.div>
      ))}
    </div>
  );
};

const WasteOverviewChart = () => {
  const { wasteData } = useWasteData();
  const [activeCategories, setActiveCategories] = useState<string[]>(
    categories.map((c) => c.key)
  );
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

  const chartData = useMemo(() => getChartData(filteredData), [filteredData]);

  const toggleCategory = (key: string) => {
    setActiveCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/95 backdrop-blur-md p-4 border border-border rounded-xl shadow-2xl z-50"
        >
          <p className="text-foreground font-semibold mb-2 border-b border-border pb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            const cat = categories.find(c => c.key === entry.dataKey);
            return (
              <div key={index} className="flex items-center gap-2 text-sm py-1">
                <span className="text-lg">{cat?.icon}</span>
                <span className="text-muted-foreground">{entry.name}:</span>
                <span className="text-foreground font-medium ml-auto">{entry.value} kg</span>
              </div>
            );
          })}
          <div className="border-t border-border mt-2 pt-2">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-muted-foreground">Total:</span>
              <span className="text-foreground">
                {payload.reduce((sum: number, entry: any) => sum + entry.value, 0)} kg
              </span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Custom legend with icons
  const CustomLegend = () => (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
      {categories.map((cat) => (
        <motion.button
          key={cat.key}
          onClick={() => toggleCategory(cat.key)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
            activeCategories.includes(cat.key)
              ? "shadow-sm"
              : "opacity-40"
          }`}
          style={{
            backgroundColor: activeCategories.includes(cat.key) ? `${cat.color}20` : 'transparent',
            color: activeCategories.includes(cat.key) ? cat.color : undefined,
          }}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </motion.button>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="chart-container p-3 sm:p-4 md:p-6"
    >

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <div>
            <h3 className="text-sm sm:text-base md:text-xl font-bold text-foreground">Waste Category Trends</h3>
            <p className="text-xs text-muted-foreground hidden sm:block">Material breakdown by category</p>
          </div>
        </div>
        
        {/* Time Period Dropdown */}
        <Select value={timePeriod} onValueChange={(val) => setTimePeriod(val)}>
          <SelectTrigger className="w-32 bg-gradient-to-r from-primary/10 to-accent/10 border-border text-sm font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timePeriods.map((period) => (
              <SelectItem key={period.key} value={period.key}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Summary Cards */}
      <CategorySummaryCards data={chartData} />

      {/* Chart */}
      <div className="h-[300px] sm:h-[320px] md:h-[360px] relative overflow-x-auto">
        <div className="min-w-[500px] h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              {categories.map((cat) => (
                <linearGradient key={`${cat.key}Grad`} id={`${cat.key}Grad`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={cat.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={cat.color} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={45}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
            {categories.map((cat) =>
              activeCategories.includes(cat.key) ? (
                <Bar
                  key={cat.key}
                  dataKey={cat.key}
                  name={cat.label}
                  fill={`url(#${cat.key}Grad)`}
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                  animationBegin={100}
                />
              ) : null
            )}
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Custom Legend */}
      <CustomLegend />
    </motion.div>
  );
};

export default WasteOverviewChart;