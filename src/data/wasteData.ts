export interface WasteDataRow {
  date: string;
  totalWaste: number;
  dryWaste: number;
  wetWaste: number;
  plastic: {
    bags: number;
    petBottles: number;
    hdpeBottles: number;
    polythene: number;
    others: number;
  };
  paper: {
    thermocol: number;
    newspaper: number;
    cartoon: number;
    normalPaper: number;
    cardboard: number;
    others: number;
  };
  glass: {
    whiteGrades: number;
    others: number;
  };
  metal: {
    aluminumCans: number;
    foodPackingContainer: number;
    others: number;
  };
  textiles: number;
  ewaste: {
    batteries: number;
    charger: number;
    lighting: number;
    others: number;
  };
  others: {
    expiredMedicines: number;
    medicinesPackaging: number;
    thermometers: number;
    others: number;
  };
  recycling: number;
  composted: number;
  compostProduced: number;
  methaneReduction: number;
  divertedFromLandfill: number;
  residualToLandfill: number;
  recyclingEfficiency: number;
  landfillDiversionRate: number;
  segregationEfficiency: number;
  remarks: string;
}

// Empty default data - real data comes from Google Sheets
export const wasteData: WasteDataRow[] = [];

export type TimePeriod = "day" | "week" | "month" | "quarter" | "year";

// Parse date in "DD-Mon-YYYY" format
export const parseDate = (dateStr: string): Date => {
  const months: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]] ?? 0;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
};

export const filterDataByPeriod = (data: WasteDataRow[], period: TimePeriod): WasteDataRow[] => {
  if (!data || data.length === 0) return [];

  const sortedData = [...data].sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
  const latestDate = parseDate(sortedData[0].date);

  switch (period) {
    case "day": {
      return sortedData.slice(0, 1);
    }
    case "week": {
      const weekAgo = new Date(latestDate);
      weekAgo.setDate(weekAgo.getDate() - 6);
      return sortedData.filter((row) => parseDate(row.date) >= weekAgo);
    }
    case "month": {
      const monthAgo = new Date(latestDate);
      monthAgo.setDate(monthAgo.getDate() - 29);
      return sortedData.filter((row) => parseDate(row.date) >= monthAgo);
    }
    case "quarter": {
      const quarterAgo = new Date(latestDate);
      quarterAgo.setDate(quarterAgo.getDate() - 89);
      return sortedData.filter((row) => parseDate(row.date) >= quarterAgo);
    }
    case "year":
    default:
      return sortedData;
  }
};

export const calculateTotals = (data: WasteDataRow[]) => {
  const totals = data.reduce(
    (acc, row) => ({
      recycling: acc.recycling + row.recycling,
      composted: acc.composted + row.composted,
      paper: acc.paper + Object.values(row.paper).reduce((a, b) => a + b, 0),
      glass: acc.glass + row.glass.whiteGrades + row.glass.others,
      plastic: acc.plastic + Object.values(row.plastic).reduce((a, b) => a + b, 0),
      metal: acc.metal + Object.values(row.metal).reduce((a, b) => a + b, 0),
      ewaste: acc.ewaste + Object.values(row.ewaste).reduce((a, b) => a + b, 0),
      others: acc.others + Object.values(row.others).reduce((a, b) => a + b, 0),
      divertedFromLandfill: acc.divertedFromLandfill + row.divertedFromLandfill,
      totalWasteSum: acc.totalWasteSum + row.totalWaste,
      dryWasteSum: acc.dryWasteSum + row.dryWaste,
      wetWasteSum: acc.wetWasteSum + row.wetWaste,
      count: acc.count + 1,
    }),
    {
      recycling: 0,
      composted: 0,
      paper: 0,
      glass: 0,
      plastic: 0,
      metal: 0,
      ewaste: 0,
      others: 0,
      divertedFromLandfill: 0,
      totalWasteSum: 0,
      dryWasteSum: 0,
      wetWasteSum: 0,
      count: 0,
    }
  );

  // Total Waste Collected from data
  const totalWaste = totals.totalWasteSum;
  
  // Waste Diverted from Landfill = reported divertedFromLandfill
  const diverted = totals.divertedFromLandfill;
  
  // Residual Waste to Landfill = Total Waste - Waste Diverted
  const residualToLandfill = totalWaste - diverted;
  
  // Compost Produced (kg) = 20% of Waste Composted (kg)
  const compostProduced = Math.round(totals.composted * 0.20);
  
  // Methane Emission Reduction (kg CO₂e) = ((Total Waste Collected (kg)/1000)*(0.6*0.5))*28
  const methaneReduction = Math.round(((totalWaste / 1000) * (0.6 * 0.5)) * 28);
  
  // Recycling Efficiency (%) = (Mass of usable recycled output / Waste sent for Recycling) × 100
  const recyclingEfficiency = totals.recycling > 0 ? Math.round((totals.recycling / totals.recycling) * 100) : 0;
  
  // Landfill Diversion Rate (%) = (Waste Diverted from Landfill / Total Waste) × 100
  const landfillDiversionRate = totalWaste > 0 ? Math.round((diverted / totalWaste) * 100) : 0;
  
  // Segregation Efficiency (%) = (Correctly Segregated Waste / Total Waste Generated) × 100
  const segregationEfficiency = totals.totalWasteSum > 0 ? Math.round((totalWaste / totals.totalWasteSum) * 100) : 0;

  return {
    ...totals,
    totalWaste,
    diverted,
    residualToLandfill,
    compostProduced,
    methaneReduction,
    recyclingEfficiency,
    landfillDiversionRate,
    segregationEfficiency,
  };
};

export const getPlasticBreakdown = (data: WasteDataRow[]) => {
  const totals = data.reduce(
    (acc, row) => ({
      bags: acc.bags + row.plastic.bags,
      petBottles: acc.petBottles + row.plastic.petBottles,
      hdpeBottles: acc.hdpeBottles + row.plastic.hdpeBottles,
      polythene: acc.polythene + row.plastic.polythene,
      others: acc.others + row.plastic.others,
    }),
    { bags: 0, petBottles: 0, hdpeBottles: 0, polythene: 0, others: 0 }
  );
  
  const breakdown = [
    { name: "Bags/Sacks", value: totals.bags, color: "hsl(160, 84%, 39%)" },
    { name: "Pet Bottles", value: totals.petBottles, color: "hsl(199, 89%, 48%)" },
    { name: "HDPE Bottles", value: totals.hdpeBottles, color: "hsl(45, 93%, 58%)" },
    { name: "Polythene", value: totals.polythene, color: "hsl(340, 82%, 52%)" },
    { name: "Others", value: totals.others, color: "hsl(25, 95%, 53%)" },
  ];

  return breakdown.filter(
    (item, idx, arr) => arr.findIndex((i) => i.name === item.name) === idx
  );
};

export const getPaperBreakdown = (data: WasteDataRow[]) => {
  const totals = data.reduce(
    (acc, row) => ({
      thermocol: acc.thermocol + row.paper.thermocol,
      newspaper: acc.newspaper + row.paper.newspaper,
      cartoon: acc.cartoon + row.paper.cartoon,
      normalPaper: acc.normalPaper + row.paper.normalPaper,
      cardboard: acc.cardboard + row.paper.cardboard,
      others: acc.others + row.paper.others,
    }),
    { thermocol: 0, newspaper: 0, cartoon: 0, normalPaper: 0, cardboard: 0, others: 0 }
  );
  
  const breakdown = [
    { name: "Thermocol", value: totals.thermocol, color: "hsl(160, 84%, 39%)" },
    { name: "Newspaper", value: totals.newspaper, color: "hsl(45, 93%, 58%)" },
    { name: "Carton", value: totals.cartoon, color: "hsl(35, 90%, 55%)" },
    { name: "Normal Paper", value: totals.normalPaper, color: "hsl(55, 88%, 55%)" },
    { name: "Cardboard", value: totals.cardboard, color: "hsl(40, 80%, 50%)" },
    { name: "Others", value: totals.others, color: "hsl(25, 95%, 53%)" },
  ];

  return breakdown.filter((item, idx, arr) => arr.findIndex((i) => i.name === item.name) === idx);
};

export const getGlassBreakdown = (data: WasteDataRow[]) => {
  const totals = data.reduce(
    (acc, row) => ({
      whiteGrades: acc.whiteGrades + row.glass.whiteGrades,
      others: acc.others + row.glass.others,
    }),
    { whiteGrades: 0, others: 0 }
  );
  
  const breakdown = [
    { name: "White Grades", value: totals.whiteGrades, color: "hsl(199, 89%, 48%)" },
    { name: "Others", value: totals.others, color: "hsl(25, 95%, 53%)" },
  ];

  return breakdown.filter((item, idx, arr) => arr.findIndex((i) => i.name === item.name) === idx);
};

export const getMetalBreakdown = (data: WasteDataRow[]) => {
  const totals = data.reduce(
    (acc, row) => ({
      aluminum: acc.aluminum + row.metal.aluminumCans,
      foodPacking: acc.foodPacking + row.metal.foodPackingContainer,
      others: acc.others + row.metal.others,
    }),
    { aluminum: 0, foodPacking: 0, others: 0 }
  );
  
  const breakdown = [
    { name: "Aluminum Cans", value: totals.aluminum, color: "hsl(220, 70%, 55%)" },
    { name: "Food Packing Container", value: totals.foodPacking, color: "hsl(210, 60%, 50%)" },
    { name: "Others", value: totals.others, color: "hsl(25, 95%, 53%)" },
  ];

  return breakdown.filter((item, idx, arr) => arr.findIndex((i) => i.name === item.name) === idx);
};

export const getEwasteBreakdown = (data: WasteDataRow[]) => {
  const totals = data.reduce(
    (acc, row) => ({
      batteries: acc.batteries + row.ewaste.batteries,
      charger: acc.charger + row.ewaste.charger,
      lighting: acc.lighting + row.ewaste.lighting,
      others: acc.others + row.ewaste.others,
    }),
    { batteries: 0, charger: 0, lighting: 0, others: 0 }
  );
  
  const breakdown = [
    { name: "Batteries", value: totals.batteries, color: "hsl(280, 65%, 60%)" },
    { name: "Charger", value: totals.charger, color: "hsl(270, 60%, 55%)" },
    { name: "Lighting", value: totals.lighting, color: "hsl(290, 55%, 50%)" },
    { name: "Others", value: totals.others, color: "hsl(25, 95%, 53%)" },
  ];

  return breakdown.filter((item, idx, arr) => arr.findIndex((i) => i.name === item.name) === idx);
};

export const getOthersBreakdown = (data: WasteDataRow[]) => {
  const totals = data.reduce(
    (acc, row) => ({
      expiredMedicines: acc.expiredMedicines + row.others.expiredMedicines,
      medicinesPackaging: acc.medicinesPackaging + row.others.medicinesPackaging,
      thermometers: acc.thermometers + row.others.thermometers,
      others: acc.others + row.others.others,
    }),
    { expiredMedicines: 0, medicinesPackaging: 0, thermometers: 0, others: 0 }
  );
  
  const breakdown = [
    { name: "Expired Medicines", value: totals.expiredMedicines, color: "hsl(160, 60%, 45%)" },
    { name: "Medicines Packaging", value: totals.medicinesPackaging, color: "hsl(150, 55%, 40%)" },
    { name: "Thermometers", value: totals.thermometers, color: "hsl(170, 50%, 50%)" },
    { name: "Others", value: totals.others, color: "hsl(25, 95%, 53%)" },
  ];

  return breakdown.filter((item, idx, arr) => arr.findIndex((i) => i.name === item.name) === idx);
};

export const getChartData = (data: WasteDataRow[]) => {
  return data.map((row) => ({
    date: row.date.split("-")[0] + " " + row.date.split("-")[1],
    fullDate: row.date,
    plastic: Object.values(row.plastic).reduce((a, b) => a + b, 0),
    paper: Object.values(row.paper).reduce((a, b) => a + b, 0),
    glass: row.glass.whiteGrades + row.glass.others,
    metal: Object.values(row.metal).reduce((a, b) => a + b, 0),
    ewaste: Object.values(row.ewaste).reduce((a, b) => a + b, 0),
    others: Object.values(row.others).reduce((a, b) => a + b, 0),
  }));
};
