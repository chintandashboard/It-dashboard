import * as XLSX from "xlsx";
import { WasteDataRow } from "@/data/wasteData";

// Helper function to safely get numeric value from Excel cell
const getNumericValue = (value: any): number => {
  if (value === undefined || value === null || value === "") return 0;
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

// Helper function to find value from multiple possible column names
const findValue = (row: any, possibleNames: string[]): any => {
  // First try exact match
  for (const name of possibleNames) {
    if (row[name] !== undefined && row[name] !== null && row[name] !== "") {
      return row[name];
    }
  }
  
  // Then try case-insensitive and trimmed match
  const rowKeys = Object.keys(row);
  for (const name of possibleNames) {
    const normalizedName = name.toLowerCase().trim();
    for (const key of rowKeys) {
      const normalizedKey = key.toLowerCase().trim();
      if (normalizedKey === normalizedName || normalizedKey.includes(normalizedName) || normalizedName.includes(normalizedKey)) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
          return row[key];
        }
      }
    }
  }
  
  return undefined;
};

// Helper function to format date from Excel
const formatDate = (value: any): string => {
  if (!value) return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");
  
  // If it's already a string in expected format
  if (typeof value === "string") {
    return value;
  }
  
  // If it's an Excel date number
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${String(date.d).padStart(2, "0")}-${months[date.m - 1]}-${date.y}`;
  }
  
  return String(value);
};

// Calculate derived metrics based on user's formulas
// Column names matched to user's Excel sheet headers
export const calculateDerivedMetrics = (row: any): Partial<WasteDataRow> => {
  // 1. Plastic = Bags/Sacks + Pet Bottles + HDPE Bottles + Polythene + Others
  const plastic = {
    bags: getNumericValue(findValue(row, ["Bags/Sacks", "bags", "Bags"])),
    petBottles: getNumericValue(findValue(row, ["Pet Bottles", "petBottles", "PET Bottles"])),
    hdpeBottles: getNumericValue(findValue(row, ["HDPE Bottles", "hdpeBottles", "HDPE"])),
    polythene: getNumericValue(findValue(row, ["Polythene", "polythene"])),
    others: getNumericValue(findValue(row, ["Plastic Others", "Thermocol", "thermocol"])),
  };
  const totalPlastic = plastic.bags + plastic.petBottles + plastic.hdpeBottles + plastic.polythene + plastic.others;

  // 2. Paper = Thermocol + Newspaper + Carton + Normal Paper + Cardboard + Others
  const paper = {
    thermocol: getNumericValue(findValue(row, ["Paper Thermocol", "Thermocol"])),
    newspaper: getNumericValue(findValue(row, ["Newspaper", "newspaper"])),
    cartoon: getNumericValue(findValue(row, ["Carton", "Cartoon", "cartoon"])),
    normalPaper: getNumericValue(findValue(row, ["Normal Paper", "normalPaper"])),
    cardboard: getNumericValue(findValue(row, ["Cardboard", "cardboard"])),
    others: getNumericValue(findValue(row, ["Paper Others"])),
  };
  const totalPaper = paper.thermocol + paper.newspaper + paper.cartoon + paper.normalPaper + paper.cardboard + paper.others;

  // 3. Glass = White grades + Others
  const glass = {
    whiteGrades: getNumericValue(findValue(row, ["White Grades", "Glass (kg)", "Glass", "glass", "White grades"])),
    others: getNumericValue(findValue(row, ["Glass Others"])),
  };
  const totalGlass = glass.whiteGrades + glass.others;

  // 4. Metal = Aluminum cans + Food Packing container + Others
  const metal = {
    aluminumCans: getNumericValue(findValue(row, ["Aluminum cans", "Aluminum", "aluminumCans", "Aluminum Cans"])),
    foodPackingContainer: getNumericValue(findValue(row, ["Food Packing container", "Food Packing Container", "foodPackingContainer", "Food Container"])),
    others: getNumericValue(findValue(row, ["Metal Others"])),
  };
  const totalMetal = metal.aluminumCans + metal.foodPackingContainer + metal.others;

  // 5. E-waste = Batteries + Charger + Lighting + Others
  const ewaste = {
    batteries: getNumericValue(findValue(row, ["Batteries", "batteries"])),
    charger: getNumericValue(findValue(row, ["Charger", "charger", "Chargers"])),
    lighting: getNumericValue(findValue(row, ["Lighting", "lighting"])),
    others: getNumericValue(findValue(row, ["E-waste Others", "Ewaste Others"])),
  };
  const totalEwaste = ewaste.batteries + ewaste.charger + ewaste.lighting + ewaste.others;

  // 6. Others = Expired medicines + Medicines packaging + Thermometers + Others
  const others = {
    expiredMedicines: getNumericValue(findValue(row, ["Expired medicines", "Expired Medicines", "expiredMedicines"])),
    medicinesPackaging: getNumericValue(findValue(row, ["Medicines packaging", "Medicines Packaging", "medicinesPackaging"])),
    thermometers: getNumericValue(findValue(row, ["Thermometers", "thermometers"])),
    others: getNumericValue(findValue(row, ["Others Others"])),
  };
  const totalOthers = others.expiredMedicines + others.medicinesPackaging + others.thermometers + others.others;

  // Get base values from Excel - matching exact column names from user's sheet
  // Try to get from Excel first
  const totalWasteFromExcel = getNumericValue(findValue(row, ["Total Waste Collected (kg)", "Total Waste", "totalWaste", "Total Waste (kg)"]));
  
  // Recycling and composting data - get these first for calculation
  const recyclingValue = getNumericValue(findValue(row, [
    "Waste sent for Recycling (kg)", "Waste sent for Recycling", 
    "Recycling (kg)", "Recycling", "recycling", "Recycled (kg)", "Recycled"
  ]));
  const wasteCompostedValue = getNumericValue(findValue(row, [
    "Waste Composted (kg)", "Waste Composted", "Composted (kg)", 
    "composted", "Composted", "Compost"
  ]));
  
  // Total Waste Collected = Waste sent for Recycling + Waste Composted (as per user requirement)
  const totalWaste = totalWasteFromExcel || (recyclingValue + wasteCompostedValue) || 
    (totalPlastic + totalPaper + totalGlass + totalMetal + totalEwaste + totalOthers);
  const dryWaste = getNumericValue(findValue(row, ["Dry Waste (kg)", "Dry Waste", "dryWaste"]));
  const wetWaste = getNumericValue(findValue(row, ["Wet Waste (kg)", "Wet Waste", "wetWaste"]));
  const textiles = getNumericValue(findValue(row, ["Textiles", "textiles"]));
  
  // Use the recycling and composted values we already calculated above
  const recycling = recyclingValue;
  const wasteComposted = wasteCompostedValue;
  
  // Get values that may be pre-calculated in Excel or need calculation
  const compostProducedFromExcel = getNumericValue(findValue(row, ["Compost Produced (kg)", "Compost Produced", "compostProduced"]));
  const methaneReductionFromExcel = getNumericValue(findValue(row, ["Methane Emission Reduction (kg CO₂e)", "Methane Emission Reduction", "methaneReduction"]));
  const divertedFromLandfillExcel = getNumericValue(findValue(row, ["Waste Diverted from Landfill (kg)", "Waste Diverted from Landfill", "divertedFromLandfill"]));
  const residualToLandfillExcel = getNumericValue(findValue(row, ["Residual Waste to Landfill (kg)", "Residual Waste to Landfill", "residualToLandfill"]));
  const recyclingEfficiencyExcel = getNumericValue(findValue(row, ["Recycling Efficiency (%)", "Recycling Efficiency", "recyclingEfficiency"]));
  const landfillDiversionRateExcel = getNumericValue(findValue(row, ["Landfill Diversion Rate (%)", "Landfill Diversion Rate", "landfillDiversionRate"]));
  const segregationEfficiencyExcel = getNumericValue(findValue(row, ["Segregation Efficiency (%)", "Segregation Efficiency", "segregationEfficiency"]));

  // Get additional fields needed for calculations
  const correctlySegregated = getNumericValue(findValue(row, ["Correctly Segregated Waste (kg)", "Correctly Segregated", "correctlySegregated"]));
  const wasteDisposedToLandfill = getNumericValue(findValue(row, ["Waste Disposed to Landfill (kg)", "Waste Disposed to Landfill", "wasteDisposedToLandfill", "Disposed to Landfill"]));
  const recyclableInput = getNumericValue(findValue(row, ["Recyclable Material Input (kg)", "Recyclable Input", "recyclableInput"]));
  const recycledOutput = getNumericValue(findValue(row, ["Usable Recycled Output (kg)", "Recycled Output", "recycledOutput"]));

  // 1. Compost Produced (kg) = 20% of Waste Composted (kg)
  const compostProduced = compostProducedFromExcel || (wasteComposted * 0.2);

  // 2. Methane Emission Reduction (kg CO₂e) = ((Total Waste Collected / 1000) * (0.6 * 0.5)) * 28
  const methaneReduction = methaneReductionFromExcel || ((totalWaste / 1000) * (0.6 * 0.5) * 28);

  // 3. Waste Diverted from Landfill (kg) = Waste Input - Waste Disposed to Landfill
  // If wasteDisposedToLandfill is available, use it; otherwise fallback to recycling + composted
  const divertedFromLandfill = divertedFromLandfillExcel || 
    (wasteDisposedToLandfill > 0 ? (totalWaste - wasteDisposedToLandfill) : (recycling + wasteComposted));

  // 4. Residual Waste to Landfill (kg) = Total Waste Collected - Waste Diverted from Landfill
  const residualToLandfill = residualToLandfillExcel || (totalWaste - divertedFromLandfill);

  // 5. Recycling Efficiency (%) = (Mass of usable recycled output / Waste sent for Recycling) * 100
  // Mass of Usable Recycled output = Waste sent for Recycling (kg)
  const recyclingEfficiency = recyclingEfficiencyExcel || 
    (recycling > 0 ? Math.round((recycling / recycling) * 100) : 0);

  // 6. Landfill Diversion Rate (%) = (Waste Diverted from Landfill / Total Waste Generated) * 100
  const landfillDiversionRate = landfillDiversionRateExcel || 
    (totalWaste > 0 ? Math.round((divertedFromLandfill / totalWaste) * 100) : 0);

  // 7. Segregation Efficiency (%) = (Correctly Segregated Waste / Total Waste Generated) * 100
  // Correctly Segregated Waste (kg) = Total Waste Collected (kg) = recycling + composted
  const totalWasteCollected = recycling + wasteComposted;
  const segregationEfficiency = segregationEfficiencyExcel || 
    (totalWaste > 0 ? Math.round((totalWasteCollected / totalWaste) * 100) : 0);

  return {
    totalWaste,
    dryWaste: dryWaste || (totalWaste - wetWaste),
    wetWaste: wetWaste || (totalWaste * 0.3),
    plastic,
    paper,
    glass,
    metal,
    textiles,
    ewaste,
    others,
    recycling,
    composted: wasteComposted,
    compostProduced: Math.round(compostProduced * 10) / 10,
    methaneReduction: Math.round(methaneReduction * 10) / 10,
    divertedFromLandfill: Math.round(divertedFromLandfill),
    residualToLandfill: Math.round(residualToLandfill),
    recyclingEfficiency,
    landfillDiversionRate,
    segregationEfficiency,
  };
};

// Parse Excel file to JSON and calculate metrics
export const parseExcelFile = (file: File): Promise<WasteDataRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // First, try parsing with default settings (single header row)
        let jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Check if first row looks like category headers (contains "(kg)" patterns)
        // If so, the Excel has a two-row header structure - skip first row
        if (jsonData.length > 0) {
          const firstRow = jsonData[0] as any;
          const keys = Object.keys(firstRow);
          const hasSubHeaders = keys.some(k => 
            k.includes("Bags") || k.includes("Pet Bottles") || k.includes("Newspaper") || 
            k.includes("Batteries") || k.includes("Aluminum") || k.includes("Date")
          );
          
          // If no recognizable sub-headers, try parsing with header on row 2
          if (!hasSubHeaders) {
            // But first check if important columns exist in row 1 that we need to preserve
            const row1Data = XLSX.utils.sheet_to_json(worksheet);
            const row2Data = XLSX.utils.sheet_to_json(worksheet, { range: 1 });
            
            // Merge: use row 2 headers but also check row 1 for columns like Recycling/Composted
            jsonData = row2Data.map((row2: any, idx: number) => {
              const row1 = row1Data[idx] as any || {};
              // Copy over any values from row1 that might have different column names
              return { ...row1, ...row2 };
            });
          }
        }

        if (jsonData.length === 0) {
          reject(new Error("No data found in the Excel file"));
          return;
        }

        // Debug: Log column names from first row
        if (jsonData.length > 0) {
          console.log("Excel column names detected:", Object.keys(jsonData[0] as any));
          console.log("First row data:", jsonData[0]);
        }

        const parsedData: WasteDataRow[] = jsonData.map((row: any, index: number) => {
          const metrics = calculateDerivedMetrics(row);
          
          // Debug: Log recycling and composted values for first few rows
          if (index < 3) {
            console.log(`Row ${index} - recycling: ${metrics.recycling}, composted: ${metrics.composted}`);
          }
          
          // Get date from multiple possible column names
          const dateValue = findValue(row, ["Date / Month", "Date", "date", "DATE", "Date/Month"]);
          
          // Get remarks from multiple possible column names - try many variations
          const remarksValue = findValue(row, [
            "Remarks / Observations", "Remarks/Observations", "Remarks/ Observations",
            "Remarks", "remarks", "REMARKS", "Observations", "observations", "OBSERVATIONS",
            "Notes", "notes", "NOTES", "Comment", "Comments", "comment", "comments"
          ]);
          
          // Debug: Log remarks for troubleshooting
          console.log(`Row ${index} date: ${dateValue}, remarks found:`, remarksValue);
          
          return {
            date: formatDate(dateValue),
            totalWaste: metrics.totalWaste || 0,
            dryWaste: metrics.dryWaste || 0,
            wetWaste: metrics.wetWaste || 0,
            plastic: metrics.plastic || { bags: 0, petBottles: 0, hdpeBottles: 0, polythene: 0, others: 0 },
            paper: metrics.paper || { thermocol: 0, newspaper: 0, cartoon: 0, normalPaper: 0, cardboard: 0, others: 0 },
            glass: metrics.glass || { whiteGrades: 0, others: 0 },
            metal: metrics.metal || { aluminumCans: 0, foodPackingContainer: 0, others: 0 },
            textiles: metrics.textiles || 0,
            ewaste: metrics.ewaste || { batteries: 0, charger: 0, lighting: 0, others: 0 },
            others: metrics.others || { expiredMedicines: 0, medicinesPackaging: 0, thermometers: 0, others: 0 },
            recycling: metrics.recycling || 0,
            composted: metrics.composted || 0,
            compostProduced: metrics.compostProduced || 0,
            methaneReduction: metrics.methaneReduction || 0,
            divertedFromLandfill: metrics.divertedFromLandfill || 0,
            residualToLandfill: metrics.residualToLandfill || 0,
            recyclingEfficiency: metrics.recyclingEfficiency || 0,
            landfillDiversionRate: metrics.landfillDiversionRate || 0,
            segregationEfficiency: metrics.segregationEfficiency || 0,
            remarks: remarksValue !== undefined && remarksValue !== null ? String(remarksValue).trim() : "",
          } as WasteDataRow;
        });

        // Debug: Log all column names from first row to help identify remarks column
        if (jsonData.length > 0) {
          console.log("All column names in Excel:", Object.keys(jsonData[0] as any));
        }

        resolve(parsedData);
      } catch (error) {
        reject(new Error("Failed to parse Excel file. Please check the file format."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsBinaryString(file);
  });
};

// Get expected column names for Excel template
export const getExpectedColumns = (): string[] => {
  return [
    "Date",
    "Total Waste",
    "Dry Waste",
    "Wet Waste",
    "Bags/Sacks",
    "Pet Bottles",
    "HDPE Bottles",
    "Polythene",
    "Thermocol",
    "Newspaper",
    "Cartoon",
    "Normal Paper",
    "Cardboard",
    "White Grades",
    "Glass",
    "Aluminum",
    "Food Packing Container",
    "Textiles",
    "Batteries",
    "Charger",
    "Lighting",
    "Expired Medicines",
    "Medicines Packaging",
    "Thermometers",
    "Recycling",
    "Waste Composted",
    "Correctly Segregated",
    "Waste Disposed to Landfill",
    "Remarks",
  ];
};
