import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";

interface StatRowProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
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

const StatRow = ({ title, value, unit, icon: Icon, color, delay = 0 }: StatRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center justify-between py-2 border-b border-border/30 last:border-b-0"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
        <span className="text-muted-foreground text-xs sm:text-sm font-medium">{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-foreground text-base sm:text-lg md:text-xl font-bold" style={{ color }}>
          <AnimatedNumber value={value} delay={delay + 0.2} />
        </span>
        <span className="text-muted-foreground text-[10px] sm:text-xs">{unit}</span>
      </div>
    </motion.div>
  );
};

export default StatRow;