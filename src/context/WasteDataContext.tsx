import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { WasteDataRow, wasteData as defaultData } from "@/data/wasteData";
import { parse, isValid } from "date-fns";

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/134CwkH3U0MwytTpSbMdqevAC4h5GDnhc8WHEPqL5A8A/gviz/tq?tqx=out:csv";

interface WasteDataContextType {
  wasteData: WasteDataRow[];
  filteredData: WasteDataRow[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  filterByDateRange: (startDate: Date, endDate: Date) => void;
  clearFilter: () => void;
}

const WasteDataContext = createContext<WasteDataContextType | undefined>(undefined);

const parseCSVToWasteData = (csvText: string): WasteDataRow[] => {
  const lines = csvText.trim().split('\n');
  const dataRows: WasteDataRow[] = [];
  
  console.log('Parsing CSV with', lines.length, 'lines');
  
  // Skip header row, start from line 1
  for (let i = 1; i < lines.length; i++) {
    // Handle CSV parsing with potential quoted values
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    console.log('Row', i, 'has', values.length, 'columns');
    
    // Google Sheet columns (0-indexed):
    // 0: Date
    // 1: Total Waste Collected (kg)
    // 2: Dry Waste (kg)
    // 3: Wet Waste (kg)
    // 4: Plastic - Bags/Sacks
    // 5: Plastic - Pet Bottles
    // 6: Plastic - HDPE Bottles
    // 7: Plastic - Polythene
    // 8: Plastic - Others
    // 9: Paper - Thermocol
    // 10: Paper - Newspaper
    // 11: Paper - Cartoon
    // 12: Paper - Normal Paper
    // 13: Paper - Cardboard
    // 14: Paper - Others
    // 15: Glass - White Grades
    // 16: Glass - Others
    // 17: Metal - Aluminum cans
    // 18: Metal - Food Packing container
    // 19: Metal - Others
    // 20: E-waste - Batteries
    // 21: E-waste - Charger
    // 22: E-waste - Lighting
    // 23: E-waste - Others
    // 24: Others - Expired medicines
    // 25: Others - Medicines packaging
    // 26: Others - Thermometers
    // 27: Others - Others
    // 28: Waste sent for Recycling (kg)
    // 29: Waste Composted (kg)
    // 30: Remarks

    if (values.length >= 30) {
      try {
        // Parse and trim values to handle any whitespace
        const parseNum = (val: string) => parseFloat(val?.trim()) || 0;
        
        const recycling = parseNum(values[28]);
        const composted = parseNum(values[29]);
        const totalWaste = parseNum(values[1]);
        
        // Parse dry waste value from column
        const dryWasteFromColumn = parseNum(values[2]);
        const wetWasteFromColumn = parseNum(values[3]);
        
        // Parse all subcategory values first
        const plasticBags = parseNum(values[4]);
        const plasticPetBottles = parseNum(values[5]);
        const plasticHdpeBottles = parseNum(values[6]);
        const plasticPolythene = parseNum(values[7]);
        const plasticOthers = parseNum(values[8]);
        
        const paperThermocol = parseNum(values[9]);
        const paperNewspaper = parseNum(values[10]);
        const paperCartoon = parseNum(values[11]);
        const paperNormalPaper = parseNum(values[12]);
        const paperCardboard = parseNum(values[13]);
        const paperOthers = parseNum(values[14]);
        
        const glassWhiteGrades = parseNum(values[15]);
        const glassOthers = parseNum(values[16]);
        
        const metalAluminumCans = parseNum(values[17]);
        const metalFoodPackingContainer = parseNum(values[18]);
        const metalOthers = parseNum(values[19]);
        
        const ewasteBatteries = parseNum(values[20]);
        const ewasteCharger = parseNum(values[21]);
        const ewasteLighting = parseNum(values[22]);
        const ewasteOthers = parseNum(values[23]);
        
        const othersExpiredMedicines = parseNum(values[24]);
        const othersMedicinesPackaging = parseNum(values[25]);
        const othersThermometers = parseNum(values[26]);
        const othersOthers = parseNum(values[27]);
        
        // Calculate dry waste as sum of all dry waste subcategories if column is 0
        const calculatedDryWaste = 
          plasticBags + plasticPetBottles + plasticHdpeBottles + plasticPolythene + plasticOthers +
          paperThermocol + paperNewspaper + paperCartoon + paperNormalPaper + paperCardboard + paperOthers +
          glassWhiteGrades + glassOthers +
          metalAluminumCans + metalFoodPackingContainer + metalOthers +
          ewasteBatteries + ewasteCharger + ewasteLighting + ewasteOthers +
          othersExpiredMedicines + othersMedicinesPackaging + othersThermometers + othersOthers;
        
        // Use column value if available, otherwise use calculated value
        const dryWaste = dryWasteFromColumn > 0 ? dryWasteFromColumn : calculatedDryWaste;
        
        // Wet waste = composted value if wet waste column is 0
        const wetWaste = wetWasteFromColumn > 0 ? wetWasteFromColumn : composted;
        
        // Log parsed values for debugging
        console.log('Row parsed:', values[0], 
          'totalWaste:', totalWaste, 
          'dryWaste:', dryWaste, '(from column:', dryWasteFromColumn, ')',
          'wetWaste:', wetWaste, '(from column:', wetWasteFromColumn, ')',
          'recycling:', recycling, 
          'composted:', composted);
        
        // Calculate derived metrics
        // Waste Diverted from Landfill = 95% of Total Waste (assuming 5% residual/contamination)
        const divertedFromLandfill = Math.round(totalWaste * 0.95);
        // Residual Waste to Landfill = Total Waste - Waste Diverted
        const residualToLandfill = totalWaste - divertedFromLandfill;
        const recyclingEfficiency = recycling > 0 ? Math.round((recycling / recycling) * 100) : 0;
        const landfillDiversionRate = totalWaste > 0 ? Math.round((divertedFromLandfill / totalWaste) * 100) : 0;
        const totalWasteCollected = recycling + composted;
        const segregationEfficiency = totalWaste > 0 ? Math.round((totalWasteCollected / totalWaste) * 100) : 0;
        const compostProduced = Math.round(composted * 0.20);
        const methaneReduction = Math.round(((totalWaste / 1000) * (0.6 * 0.5)) * 28);

        const row: WasteDataRow = {
          date: values[0] || '',
          totalWaste,
          dryWaste,
          wetWaste,
          plastic: {
            bags: plasticBags,
            petBottles: plasticPetBottles,
            hdpeBottles: plasticHdpeBottles,
            polythene: plasticPolythene,
            others: plasticOthers,
          },
          paper: {
            thermocol: paperThermocol,
            newspaper: paperNewspaper,
            cartoon: paperCartoon,
            normalPaper: paperNormalPaper,
            cardboard: paperCardboard,
            others: paperOthers,
          },
          glass: {
            whiteGrades: glassWhiteGrades,
            others: glassOthers,
          },
          metal: {
            aluminumCans: metalAluminumCans,
            foodPackingContainer: metalFoodPackingContainer,
            others: metalOthers,
          },
          textiles: 0,
          ewaste: {
            batteries: ewasteBatteries,
            charger: ewasteCharger,
            lighting: ewasteLighting,
            others: ewasteOthers,
          },
          others: {
            expiredMedicines: othersExpiredMedicines,
            medicinesPackaging: othersMedicinesPackaging,
            thermometers: othersThermometers,
            others: othersOthers,
          },
          recycling,
          composted,
          compostProduced,
          methaneReduction,
          divertedFromLandfill,
          residualToLandfill,
          recyclingEfficiency,
          landfillDiversionRate,
          segregationEfficiency,
          remarks: values[30] || '',
        };
        
        console.log('Parsed row:', row.date, 'Remarks:', row.remarks, 'Others:', row.others);
        dataRows.push(row);
      } catch (e) {
        console.error('Error parsing row:', i, e);
      }
    }
  }
  
  console.log('Total parsed rows:', dataRows.length);
  return dataRows;
};

// Helper function to parse date strings from the data
const parseDataDate = (dateStr: string): Date | null => {
  // Try different date formats - order matters, most common first
  const formats = [
    "dd-MM-yyyy",  // 06-01-2025 (most common in this data)
    "dd-MMM-yyyy", // 01-Jan-2024
    "dd/MM/yyyy",  // 01/01/2024
    "yyyy-MM-dd",  // 2024-01-01
    "MM/dd/yyyy",  // 01/01/2024
  ];
  
  for (const format of formats) {
    try {
      const parsed = parse(dateStr, format, new Date());
      if (isValid(parsed)) {
        return parsed;
      }
    } catch {
      continue;
    }
  }
  
  // Try native Date parsing as fallback
  const nativeDate = new Date(dateStr);
  if (isValid(nativeDate)) {
    return nativeDate;
  }
  
  return null;
};

export const WasteDataProvider = ({ children }: { children: ReactNode }) => {
  const [wasteData, setWasteData] = useState<WasteDataRow[]>(defaultData);
  const [filteredData, setFilteredData] = useState<WasteDataRow[]>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterByDateRange = React.useCallback((startDate: Date, endDate: Date) => {
    console.log('Filtering data by date range:', startDate, 'to', endDate);
    console.log('Total records to filter:', wasteData.length);
    
    // Set start date to beginning of day
    const startOfStartDate = new Date(startDate);
    startOfStartDate.setHours(0, 0, 0, 0);
    
    // Set end date to end of day to include the full day
    const endOfEndDate = new Date(endDate);
    endOfEndDate.setHours(23, 59, 59, 999);
    
    console.log('Normalized date range:', startOfStartDate, 'to', endOfEndDate);
    
    const filtered = wasteData.filter((row) => {
      const rowDate = parseDataDate(row.date);
      if (!rowDate) {
        console.log('Could not parse date:', row.date);
        return false;
      }
      
      // Normalize row date to start of day for comparison
      const normalizedRowDate = new Date(rowDate);
      normalizedRowDate.setHours(0, 0, 0, 0);
      
      const isInRange = normalizedRowDate >= startOfStartDate && normalizedRowDate <= endOfEndDate;
      console.log('Checking date:', row.date, '-> parsed:', normalizedRowDate, '-> in range:', isInRange);
      return isInRange;
    });
    
    console.log('Filtered records:', filtered.length);
    setFilteredData(filtered.length > 0 ? filtered : []);
  }, [wasteData]);

  const clearFilter = React.useCallback(() => {
    setFilteredData(wasteData);
  }, [wasteData]);

  // Listen for date range selection event from DashboardHeader
  useEffect(() => {
    const handleDateRangeSelected = (e: CustomEvent<{ startDate: Date; endDate: Date }>) => {
      console.log('Received date range event:', e.detail);
      filterByDateRange(e.detail.startDate, e.detail.endDate);
    };

    const handleReportGenerating = (e: CustomEvent<boolean>) => {
      // When report generation ends, clear the filter
      if (!e.detail) {
        clearFilter();
      }
    };

    window.addEventListener("report-date-range-selected", handleDateRangeSelected as EventListener);
    window.addEventListener("report-generating", handleReportGenerating as EventListener);
    
    return () => {
      window.removeEventListener("report-date-range-selected", handleDateRangeSelected as EventListener);
      window.removeEventListener("report-generating", handleReportGenerating as EventListener);
    };
  }, [filterByDateRange, clearFilter]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data from Google Sheets...');
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch data from Google Sheets');
      }
      const csvText = await response.text();
      console.log('CSV received, length:', csvText.length);
      
      const parsedData = parseCSVToWasteData(csvText);
      
      if (parsedData.length > 0) {
        console.log('Using Google Sheets data:', parsedData.length, 'rows');
        setWasteData(parsedData);
        setFilteredData(parsedData);
      } else {
        console.log('No data parsed, using default data');
        setWasteData(defaultData);
        setFilteredData(defaultData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setWasteData(defaultData);
      setFilteredData(defaultData);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh once per day (24 hours)
    const interval = setInterval(() => {
      fetchData();
    }, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <WasteDataContext.Provider
      value={{
        wasteData,
        filteredData,
        isLoading,
        error,
        refetch: fetchData,
        filterByDateRange,
        clearFilter,
      }}
    >
      {children}
    </WasteDataContext.Provider>
  );
};

export const useWasteData = () => {
  const context = useContext(WasteDataContext);
  if (context === undefined) {
    throw new Error("useWasteData must be used within a WasteDataProvider");
  }
  return context;
};