import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  trend?: number;
  color: string;
  delay?: number;
}

const AnimatedNumber = ({ value, delay }: { value: number; delay: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });

  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        spring.set(value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, spring, value, delay]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

const StatCard = ({ title, value, unit, icon: Icon, color, delay = 0 }: StatCardProps) => {
  // Calculate a percentage for the circular progress (mock based on some reasonable max)
  const maxValues: { [key: string]: number } = {
    "kg": 50000,
    "%": 100,
    "kg CO₂e": 10000,
  };
  const maxVal = maxValues[unit] || 10000;
  const percentage = Math.min((value / maxVal) * 100, 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="stat-card group p-4 sm:p-4 md:p-5 relative overflow-hidden"
    >
      {/* Background gradient decoration */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
        style={{ background: `radial-gradient(circle, ${color}, transparent)` }}
      />
      
      <div className="relative z-10 flex items-center gap-3 sm:gap-3">
        {/* Circular progress indicator with icon */}
        <div className="relative flex-shrink-0">
          <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 -rotate-90" viewBox="0 0 60 60">
            {/* Background circle */}
            <circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke={`${color}20`}
              strokeWidth="5"
            />
            {/* Progress circle */}
            <motion.circle
              cx="30"
              cy="30"
              r="26"
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 26}
              initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - percentage / 100) }}
              transition={{ duration: 1.5, delay: delay + 0.3, ease: "easeOut" }}
            />
          </svg>
          {/* Icon in center */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              className="p-2 rounded-full"
              style={{ backgroundColor: `${color}15` }}
              whileHover={{ scale: 1.1 }}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" style={{ color }} />
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-muted-foreground text-[11px] sm:text-xs md:text-sm mb-1 line-clamp-2 font-medium leading-tight">{title}</p>
          
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              <AnimatedNumber value={value} delay={delay + 0.3} />
            </span>
            <span className="text-muted-foreground text-[10px] sm:text-xs md:text-sm font-medium">{unit}</span>
          </div>
        </div>
      </div>

      {/* Bottom decorative bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: `${color}30` }}
      >
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, delay: delay + 0.5, ease: "easeOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default StatCard;