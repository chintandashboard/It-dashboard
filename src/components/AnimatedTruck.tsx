import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

const AnimatedTruck = () => {
  const cloudControls = useAnimationControls();
  const roadControls = useAnimationControls();
  const truckControls = useAnimationControls();
  const treeControls = useAnimationControls();
  const sunControls = useAnimationControls();
  const birdControls = useAnimationControls();

  const startAnimations = () => {
    cloudControls.start((i) => ({
      x: [-20, 20, -20],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 },
    }));
    roadControls.start((i) => ({
      x: [50, -150],
      transition: { duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.15 },
    }));
    truckControls.start({
      x: ["-100px", "calc(100vw + 100px)"],
      transition: { duration: 15, repeat: Infinity, ease: "linear", repeatType: "loop" },
    });
    treeControls.start((i) => ({
      x: ["0%", "-100%"],
      transition: { duration: 6, repeat: Infinity, ease: "linear", repeatType: "loop", delay: i * 0.1 },
    }));
    sunControls.start({
      rotate: 360,
      transition: { duration: 30, repeat: Infinity, ease: "linear" },
    });
    birdControls.start((i) => ({
      x: [0, 30, 0],
      y: [0, -5, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 },
    }));
  };

  const stopAnimations = () => {
    cloudControls.stop();
    roadControls.stop();
    truckControls.stop();
    treeControls.stop();
    sunControls.stop();
    birdControls.stop();
  };

  useEffect(() => {
    startAnimations();
    const handler = (e: Event) => {
      const open = (e as CustomEvent).detail;
      if (open) {
        stopAnimations();
      } else {
        startAnimations();
      }
    };
    window.addEventListener("report-dialog-toggle", handler as EventListener);
    return () => {
      window.removeEventListener("report-dialog-toggle", handler as EventListener);
      stopAnimations();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-24 overflow-hidden bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 rounded-xl mb-6">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/50 to-transparent" />
      
      {/* Clouds */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute top-2"
          style={{ left: `${10 + i * 35}%` }}
          animate={{ x: [-20, 20, -20] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        >
          <div className="flex gap-1">
            <div className="w-6 h-3 bg-white/60 rounded-full" />
            <div className="w-4 h-3 bg-white/40 rounded-full -ml-2" />
          </div>
        </motion.div>
      ))}

      {/* Road */}
      <div className="absolute bottom-3 left-0 right-0 h-3 bg-muted-foreground/30 rounded-sm" />
      
      {/* Road markings - moving left to simulate truck moving right */}
      <div className="absolute bottom-4 left-0 right-0 flex gap-12 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="w-10 h-1 bg-yellow-400/60 rounded-full flex-shrink-0"
            animate={{ x: [50, -150] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>

      {/* Truck - moving from left to right across full width infinitely */}
      <motion.div
        className="absolute bottom-5"
        initial={{ x: "-100px" }}
        animate={{ x: "calc(100vw + 100px)" }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        <svg width="100" height="55" viewBox="0 0 100 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Truck body - cargo area on the LEFT (back of truck) */}
          <rect x="5" y="5" width="50" height="35" rx="4" className="fill-primary" />
          <rect x="9" y="9" width="42" height="27" rx="2" className="fill-primary-foreground/15" />
          
          {/* Recycle symbol on truck body */}
          <g transform="translate(25, 18)">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "5px 5px" }}
            >
              <path d="M5 0L8 5H2L5 0Z" className="fill-primary-foreground" />
              <path d="M5 0L8 5H2L5 0Z" className="fill-primary-foreground" transform="rotate(120 5 5)" />
              <path d="M5 0L8 5H2L5 0Z" className="fill-primary-foreground" transform="rotate(240 5 5)" />
            </motion.g>
          </g>
          
          {/* "WASTE" text on truck */}
          <text x="30" y="35" className="fill-primary-foreground text-[6px] font-bold" textAnchor="middle">WASTE</text>
          
          {/* Truck cabin - on the RIGHT side (front of truck, facing right) */}
          <rect x="53" y="15" width="28" height="25" rx="4" className="fill-accent" />
          {/* Windshield - angled for forward-facing look */}
          <path d="M68 18L80 18L80 28L72 28Z" className="fill-sky-200/80" rx="2" />
          {/* Door */}
          <rect x="56" y="20" width="10" height="16" rx="1" className="fill-accent-foreground/10" />
          {/* Door handle */}
          <rect x="63" y="27" width="2" height="1" rx="0.5" className="fill-accent-foreground/30" />
          {/* Headlight */}
          <rect x="78" y="30" width="3" height="4" rx="1" className="fill-yellow-300" />
          
          {/* Front bumper */}
          <rect x="80" y="35" width="4" height="5" rx="1" className="fill-muted-foreground/50" />
          
          {/* Back wheel (cargo side - left) */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "25px 45px" }}
          >
            <circle cx="25" cy="45" r="7" className="fill-foreground" />
            <circle cx="25" cy="45" r="4" className="fill-muted" />
            <circle cx="25" cy="45" r="2" className="fill-foreground/50" />
          </motion.g>
          
          {/* Front wheel (cabin side - right) */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "68px 45px" }}
          >
            <circle cx="68" cy="45" r="7" className="fill-foreground" />
            <circle cx="68" cy="45" r="4" className="fill-muted" />
            <circle cx="68" cy="45" r="2" className="fill-foreground/50" />
          </motion.g>
          
          {/* Exhaust smoke from back */}
          <motion.circle
            cx="2"
            cy="35"
            r="3"
            className="fill-muted-foreground/20"
            animate={{ 
              x: [0, -15, -30],
              opacity: [0.4, 0.2, 0],
              scale: [1, 1.5, 2]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.circle
            cx="2"
            cy="32"
            r="2"
            className="fill-muted-foreground/15"
            animate={{ 
              x: [0, -12, -25],
              y: [0, -3, -6],
              opacity: [0.3, 0.15, 0],
              scale: [1, 1.3, 1.8]
            }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
          />
        </svg>
      </motion.div>

      {/* Trees in background - simple left scroll */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={`tree-${i}`}
          className="absolute bottom-7"
          style={{ left: `${i * 18}%` }}
          animate={{ 
            x: ["0%", "-100%"]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
            {/* Tree trunk */}
            <rect x="8" y="18" width="4" height="10" className="fill-amber-700/70" />
            {/* Tree foliage */}
            <path d="M10 0L20 18H0L10 0Z" className="fill-primary/60" />
            <path d="M10 5L17 16H3L10 5Z" className="fill-primary/40" />
          </svg>
        </motion.div>
      ))}

      {/* Sun with rays */}
      <motion.div
        className="absolute top-2 right-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg shadow-yellow-400/40" />
          {/* Sun rays */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-3 bg-yellow-400/60 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translateY(-22px) translateX(-50%)`,
              }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Birds */}
      {[0, 1].map((i) => (
        <motion.div
          key={`bird-${i}`}
          className="absolute"
          style={{ top: `${8 + i * 6}px`, left: `${30 + i * 20}%` }}
          animate={{ 
            x: [0, 30, 0],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
            <path d="M0 3Q3 0 6 3Q9 0 12 3" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/40" fill="none" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedTruck;
