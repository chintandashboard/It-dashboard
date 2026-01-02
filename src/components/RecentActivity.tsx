import { motion } from "framer-motion";
import { wasteData } from "@/data/wasteData";

const RecentActivity = () => {
  const recentData = wasteData.slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="chart-container p-3 sm:p-4 md:p-6"
    >
      <div className="mb-3 sm:mb-4 md:mb-6">
        <h3 className="text-sm sm:text-base md:text-xl font-semibold text-foreground">Recent Activity</h3>
        <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1">
          Latest collection records
        </p>
      </div>

      <div className="space-y-2 sm:space-y-3 max-h-[280px] sm:max-h-[350px] overflow-y-auto scrollbar-hide">
        {recentData.map((row, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
            className="flex items-center justify-between p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/30 transition-colors gap-2 sm:gap-4"
          >
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-xs sm:text-sm">
                  {row.date.split("-")[0]}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground font-medium text-xs sm:text-sm md:text-base">{row.date}</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs md:text-sm truncate">{row.remarks || '-'}</p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-foreground font-bold text-xs sm:text-sm md:text-base">{row.totalWaste} kg</p>
              <p className="text-primary text-[10px] sm:text-xs md:text-sm">{row.recyclingEfficiency}%</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentActivity;
