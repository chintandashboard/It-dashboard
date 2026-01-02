import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useWasteData } from "@/context/WasteDataContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Flame, FileText, Cpu, Wine, Wrench, MoreHorizontal } from "lucide-react";
import {
  getPlasticBreakdown,
  getPaperBreakdown,
  getGlassBreakdown,
  getMetalBreakdown,
  getEwasteBreakdown,
  getOthersBreakdown,
  WasteDataRow,
} from "@/data/wasteData";

type TimePeriod = "day" | "week" | "month" | "quarter" | "year";

type CategoryType = "Plastic" | "Paper" | "Metal" | "Glass" | "E-Waste" | "Others";

// Parse date in "DD-Mon-YYYY" format
const parseDate = (dateStr: string): Date => {
  const months: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]] ?? 0;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
};

const filterDataByPeriod = (data: WasteDataRow[], period: TimePeriod): WasteDataRow[] => {
  if (!data || data.length === 0) return [];
  
  const sortedData = [...data].sort((a, b) => 
    parseDate(b.date).getTime() - parseDate(a.date).getTime()
  );
  
  const latestDate = parseDate(sortedData[0].date);
  
  switch (period) {
    case "day":
      return sortedData.slice(0, 1);
    case "week":
      const weekAgo = new Date(latestDate);
      weekAgo.setDate(weekAgo.getDate() - 6);
      return sortedData.filter(row => parseDate(row.date) >= weekAgo);
    case "month":
      const monthAgo = new Date(latestDate);
      monthAgo.setDate(monthAgo.getDate() - 29);
      return sortedData.filter(row => parseDate(row.date) >= monthAgo);
    case "quarter":
      const quarterAgo = new Date(latestDate);
      quarterAgo.setDate(quarterAgo.getDate() - 89);
      return sortedData.filter(row => parseDate(row.date) >= quarterAgo);
    case "year":
      return sortedData;
    default:
      return sortedData;
  }
};

const DryWasteMethaneSection = () => {
  const { wasteData } = useWasteData();
  const [methaneTimePeriod, setMethaneTimePeriod] = useState<TimePeriod>("day");
  const [categoryTimePeriod, setCategoryTimePeriod] = useState<TimePeriod>("day");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sync both charts when a global report period is selected from the header dialog
  useEffect(() => {
    const handleReportPeriod = (event: Event) => {
      const detail = (event as CustomEvent<TimePeriod>).detail;
      if (!detail) return;
      setCategoryTimePeriod(detail);
      setMethaneTimePeriod(detail);
    };

    window.addEventListener("report-period-selected", handleReportPeriod);
    return () => window.removeEventListener("report-period-selected", handleReportPeriod);
  }, []);

  const calculateMethaneReduction = (totalWaste: number) => {
    return Math.round(((totalWaste / 1000) * (0.6 * 0.5)) * 28);
  };

  // Filter data based on category time period
  const filteredCategoryData = useMemo(() => {
    return filterDataByPeriod(wasteData, categoryTimePeriod);
  }, [wasteData, categoryTimePeriod]);

  // Calculate dry waste category totals
  const dryWasteTotals = useMemo(() => {
    if (!filteredCategoryData || filteredCategoryData.length === 0) return [];

    const plasticData = getPlasticBreakdown(filteredCategoryData);
    const paperData = getPaperBreakdown(filteredCategoryData);
    const glassData = getGlassBreakdown(filteredCategoryData);
    const metalData = getMetalBreakdown(filteredCategoryData);
    const ewasteData = getEwasteBreakdown(filteredCategoryData);
    const othersData = getOthersBreakdown(filteredCategoryData);

    const plasticTotal = plasticData.reduce((sum, item) => sum + item.value, 0);
    const paperTotal = paperData.reduce((sum, item) => sum + item.value, 0);
    const glassTotal = glassData.reduce((sum, item) => sum + item.value, 0);
    const metalTotal = metalData.reduce((sum, item) => sum + item.value, 0);
    const ewasteTotal = ewasteData.reduce((sum, item) => sum + item.value, 0);
    const othersTotal = othersData.reduce((sum, item) => sum + item.value, 0);

    return [
      { name: "Plastic" as CategoryType, value: plasticTotal, icon: Package, color: "hsl(160, 84%, 39%)" },
      { name: "Paper" as CategoryType, value: paperTotal, icon: FileText, color: "hsl(45, 93%, 58%)" },
      { name: "Metal" as CategoryType, value: metalTotal, icon: Wrench, color: "hsl(220, 70%, 55%)" },
      { name: "Glass" as CategoryType, value: glassTotal, icon: Wine, color: "hsl(340, 82%, 52%)" },
      { name: "E-Waste" as CategoryType, value: ewasteTotal, icon: Cpu, color: "hsl(280, 65%, 60%)" },
      { name: "Others" as CategoryType, value: othersTotal, icon: MoreHorizontal, color: "hsl(25, 95%, 53%)" },
    ];
  }, [filteredCategoryData]);

  // Get subcategory breakdown for selected category
  const subcategoryData = useMemo(() => {
    if (!selectedCategory || !filteredCategoryData || filteredCategoryData.length === 0) return [];

    switch (selectedCategory) {
      case "Plastic":
        return getPlasticBreakdown(filteredCategoryData);
      case "Paper":
        return getPaperBreakdown(filteredCategoryData);
      case "Glass":
        return getGlassBreakdown(filteredCategoryData);
      case "Metal":
        return getMetalBreakdown(filteredCategoryData);
      case "E-Waste":
        return getEwasteBreakdown(filteredCategoryData);
      case "Others":
        return getOthersBreakdown(filteredCategoryData);
      default:
        return [];
    }
  }, [selectedCategory, filteredCategoryData]);

  // Filter data for methane chart based on selected period
  const filteredMethaneData = useMemo(() => {
    return filterDataByPeriod(wasteData, methaneTimePeriod);
  }, [wasteData, methaneTimePeriod]);

  // Prepare methane chart data
  const methaneChartData = useMemo(() => {
    if (!filteredMethaneData || filteredMethaneData.length === 0) return [];

    const sortedData = [...filteredMethaneData].sort((a, b) => 
      parseDate(a.date).getTime() - parseDate(b.date).getTime()
    );

    if (methaneTimePeriod === "day") {
      return sortedData.map((row) => ({
        date: row.date.split("-")[0] + " " + row.date.split("-")[1],
        methaneReduction: calculateMethaneReduction(row.totalWaste),
      }));
    }

    const groupedData: { [key: string]: { methaneReduction: number; count: number } } = {};

    sortedData.forEach((row) => {
      const dateParts = row.date.split("-");
      const day = parseInt(dateParts[0]);
      const month = dateParts[1];
      const year = dateParts[2] || "2024";

      let groupKey = "";
      if (methaneTimePeriod === "week") {
        const weekNum = Math.ceil(day / 7);
        groupKey = `W${weekNum} ${month}`;
      } else if (methaneTimePeriod === "month") {
        groupKey = `${month} ${year}`;
      } else if (methaneTimePeriod === "quarter") {
        const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);
        const quarter = Math.floor(monthIndex / 3) + 1;
        groupKey = `Q${quarter} ${year}`;
      } else if (methaneTimePeriod === "year") {
        groupKey = year;
      }

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = { methaneReduction: 0, count: 0 };
      }

      groupedData[groupKey].methaneReduction += calculateMethaneReduction(row.totalWaste);
      groupedData[groupKey].count += 1;
    });

    return Object.entries(groupedData).map(([date, data]) => ({
      date,
      methaneReduction: data.methaneReduction,
    }));
  }, [wasteData, methaneTimePeriod]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <div className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "hsl(160, 84%, 39%)" }}
            />
            <span className="text-muted-foreground">CO₂e Reduction:</span>
            <span className="font-medium text-primary">
              {payload[0].value} kg
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleCategoryClick = (categoryName: CategoryType) => {
    setSelectedCategory(categoryName);
    setDialogOpen(true);
  };

  const getTimePeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case "day": return "Today";
      case "week": return "Last 7 Days";
      case "month": return "Last 30 Days";
      case "quarter": return "Last Quarter";
      case "year": return "Year to Date";
      default: return "";
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
      >
        {/* Left Column - Dry Waste Categories */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="chart-container p-3 sm:p-4 md:p-6"
        >
          <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
                Recycled by Category YTD
              </h3>
            </div>
            <Select value={categoryTimePeriod} onValueChange={(val) => setCategoryTimePeriod(val as TimePeriod)}>
              <SelectTrigger className="w-24 sm:w-28 h-8 text-xs bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {dryWasteTotals.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <div 
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center mb-2 hover:shadow-lg transition-shadow"
                    style={{ borderColor: category.color }}
                  >
                    <IconComponent 
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" 
                      style={{ color: category.color }}
                    />
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground mb-1">{category.name}</span>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-foreground">
                    {category.value.toLocaleString()}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Column - Methane Emission Reduction Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="chart-container p-3 sm:p-4 md:p-6"
        >
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
                Methane Emission Reduction
              </h3>
            </div>
            <Select value={methaneTimePeriod} onValueChange={(val) => setMethaneTimePeriod(val as TimePeriod)}>
              <SelectTrigger className="w-24 sm:w-28 h-8 text-xs bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-36 sm:h-44 md:h-52 bar-chart-shadow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={methaneChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="methaneBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160, 84%, 50%)" />
                    <stop offset="100%" stopColor="hsl(160, 84%, 30%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                  interval="preserveStartEnd"
                  angle={-45}
                  textAnchor="end"
                  height={40}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="methaneReduction"
                  name="Methane Reduction (kg CO₂e)"
                  fill="url(#methaneBarGrad)"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* Subcategory Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCategory} Breakdown
              <span className="text-sm font-normal text-muted-foreground">
                ({getTimePeriodLabel(categoryTimePeriod)})
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subcategory</TableHead>
                  <TableHead className="text-right">Weight (kg)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subcategoryData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-secondary/30 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    {subcategoryData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DryWasteMethaneSection;
