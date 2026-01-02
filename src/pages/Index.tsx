import { motion } from "framer-motion";
import {
  Trash2,
  Recycle,
  Leaf,
  Sprout,
  ArrowRightFromLine,
  Trash,
  TrendingUp,
  Loader2,
  Droplets,
  Package,
  Flame,
} from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import StatRow from "@/components/StatRow";
import DryWasteMethaneSection from "@/components/DryWasteMethaneSection";
import BreakdownChartsGrid from "@/components/BreakdownChartsGrid";
import WasteOverviewChart from "@/components/WasteOverviewChart";
import WasteDataTable from "@/components/WasteDataTable";
import WasteCollectionPieChart from "@/components/WasteCollectionPieChart";
import LandfillMetricsPieChart from "@/components/LandfillMetricsPieChart";
import Footer from "@/components/Footer";
import AnimatedTruck from "@/components/AnimatedTruck";
import { calculateTotals } from "@/data/wasteData";
import { useWasteData } from "@/context/WasteDataContext";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const { wasteData, isLoading } = useWasteData();
  const totals = calculateTotals(wasteData);

  // Refs kept for potential future use (analytics, etc.)
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const breakdownRef = useRef<HTMLDivElement | null>(null);
  const piesRef = useRef<HTMLDivElement | null>(null);

  const [forceReveal, setForceReveal] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const open = (e as CustomEvent).detail;
      setForceReveal(Boolean(open));
    };
    window.addEventListener("report-generating", handler as EventListener);
    return () => window.removeEventListener("report-generating", handler as EventListener);
  }, []);

  // Calculate total dry and wet waste from data
  const totalDryWaste = wasteData.reduce((sum, row) => sum + row.dryWaste, 0);
  const totalWetWaste = wasteData.reduce((sum, row) => sum + row.wetWaste, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading waste data...</p>
        </div>
      </div>
    );
  }

  const leftColumnStats = [
    { title: "Total Waste Collected", value: totals.totalWaste, unit: "kg", icon: Trash2, color: "hsl(199, 89%, 48%)" },
    { title: "Total Dry Waste Collected", value: totalDryWaste, unit: "kg", icon: Package, color: "hsl(45, 93%, 58%)" },
    { title: "Total Wet Waste Collected", value: totalWetWaste, unit: "kg", icon: Droplets, color: "hsl(160, 84%, 39%)" },
    { title: "Dry Waste Sent for Recycling", value: totals.recycling, unit: "kg", icon: Recycle, color: "hsl(340, 82%, 52%)" },
    { title: "Wet Waste Composted", value: totals.composted, unit: "kg", icon: Leaf, color: "hsl(120, 60%, 45%)" },
  ];

  const rightColumnStats = [
    { title: "Residual Waste to Landfill", value: totals.residualToLandfill, unit: "kg", icon: Trash, color: "hsl(0, 65%, 50%)" },
    { title: "Waste Diverted from Landfill", value: totals.diverted, unit: "kg", icon: ArrowRightFromLine, color: "hsl(220, 70%, 55%)" },
    { title: "Landfill Diversion Rate", value: totals.landfillDiversionRate, unit: "%", icon: TrendingUp, color: "hsl(170, 70%, 45%)" },
    { title: "Compost Produced", value: totals.compostProduced, unit: "kg", icon: Sprout, color: "hsl(280, 65%, 60%)" },
    { title: "Methane Emission Reduction", value: totals.methaneReduction, unit: "kg CO₂e", icon: Flame, color: "hsl(25, 95%, 53%)" },
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-10 w-64 h-64 bg-chart-glass/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main
        id="dashboard-capture"
        className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 bg-background"
      >
        <div data-report-section="header">
          <DashboardHeader />
        </div>
        
        {/* Animated Truck Banner */}
        <div data-report-section="hero">
          <AnimatedTruck />
        </div>

        {/* Two Column Stats Layout */}
        <motion.div
          data-report-section="summary-stats"
          initial={forceReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          animate={forceReveal ? { opacity: 1, y: 0 } : undefined}
          whileInView={forceReveal ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={forceReveal ? undefined : { once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8"
        >
          {/* Left Column */}
          <div className="space-y-1">
            {leftColumnStats.map((stat, index) => (
              <StatRow key={stat.title} {...stat} delay={index * 0.08} />
            ))}
          </div>
          
          {/* Right Column */}
          <div className="space-y-1">
            {rightColumnStats.map((stat, index) => (
              <StatRow key={stat.title} {...stat} delay={index * 0.08 + 0.4} />
            ))}
          </div>
        </motion.div>

        <motion.div
          data-report-section="dry-waste-methane"
          initial={forceReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          animate={forceReveal ? { opacity: 1, y: 0 } : undefined}
          whileInView={forceReveal ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={forceReveal ? undefined : { once: true, amount: 0.2 }}
        >
          <DryWasteMethaneSection />
        </motion.div>

        <motion.div
          data-report-section="waste-category-trends"
          ref={overviewRef}
          initial={forceReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          animate={forceReveal ? { opacity: 1, y: 0 } : undefined}
          whileInView={forceReveal ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          viewport={forceReveal ? undefined : { once: true, amount: 0.2 }}
        >
          <WasteOverviewChart />
        </motion.div>

        <div className="my-6 sm:my-8" />

        <motion.div
          data-report-section="breakdown-charts"
          ref={breakdownRef}
          initial={forceReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          animate={forceReveal ? { opacity: 1, y: 0 } : undefined}
          whileInView={forceReveal ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          viewport={forceReveal ? undefined : { once: true, amount: 0.2 }}
        >
          <BreakdownChartsGrid />
        </motion.div>

        <div className="my-6 sm:my-8" />

        {/* Two Column Layout: Data Table + Pie Charts */}
        <motion.div
          data-report-section="tables-and-pies"
          ref={piesRef}
          initial={forceReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          animate={forceReveal ? { opacity: 1, y: 0 } : undefined}
          whileInView={forceReveal ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          viewport={forceReveal ? undefined : { once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
        >
          {/* Left Column: Waste Data Table */}
          <WasteDataTable />
          
          {/* Right Column: Two Pie Charts stacked - matches table height */}
          <div className="flex flex-col gap-4 sm:gap-6 h-full">
            <WasteCollectionPieChart />
            <LandfillMetricsPieChart />
          </div>
        </motion.div>
      </main>

      <div data-report-section="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Index;