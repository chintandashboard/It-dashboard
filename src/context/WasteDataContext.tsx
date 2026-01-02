import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { WasteDataRow, wasteData as defaultData } from "@/data/wasteData";

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/134CwkH3U0MwytTpSbMdqevAC4h5GDnhc8WHEPqL5A8A/gviz/tq?tqx=out:csv";

interface WasteDataContextType {
  wasteData: WasteDataRow[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
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
        const recycling = parseFloat(values[28]) || 0;
        const composted = parseFloat(values[29]) || 0;
        const totalWaste = parseFloat(values[1]) || 0;
        const dryWaste = parseFloat(values[2]) || 0;
        const wetWaste = parseFloat(values[3]) || 0;
        
        // Calculate derived metrics
        const divertedFromLandfill = Math.round(totalWaste - (totalWaste * 0.05));
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
            bags: parseFloat(values[4]) || 0,           // Bags/Sacks
            petBottles: parseFloat(values[5]) || 0,     // Pet Bottles
            hdpeBottles: parseFloat(values[6]) || 0,    // HDPE Bottles
            polythene: parseFloat(values[7]) || 0,      // Polythene
            others: parseFloat(values[8]) || 0,         // Plastic Others
          },
          paper: {
            thermocol: parseFloat(values[9]) || 0,      // Thermocol
            newspaper: parseFloat(values[10]) || 0,     // Newspaper
            cartoon: parseFloat(values[11]) || 0,       // Cartoon
            normalPaper: parseFloat(values[12]) || 0,   // Normal Paper
            cardboard: parseFloat(values[13]) || 0,     // Cardboard
            others: parseFloat(values[14]) || 0,        // Paper Others
          },
          glass: {
            whiteGrades: parseFloat(values[15]) || 0,   // Glass White Grades
            others: parseFloat(values[16]) || 0,        // Glass Others
          },
          metal: {
            aluminumCans: parseFloat(values[17]) || 0,  // Aluminum cans
            foodPackingContainer: parseFloat(values[18]) || 0, // Food Packing container
            others: parseFloat(values[19]) || 0,        // Metal Others
          },
          textiles: 0,
          ewaste: {
            batteries: parseFloat(values[20]) || 0,     // Batteries
            charger: parseFloat(values[21]) || 0,       // Charger
            lighting: parseFloat(values[22]) || 0,      // Lighting
            others: parseFloat(values[23]) || 0,        // E-waste Others
          },
          others: {
            expiredMedicines: parseFloat(values[24]) || 0,   // Expired medicines
            medicinesPackaging: parseFloat(values[25]) || 0, // Medicines packaging
            thermometers: parseFloat(values[26]) || 0,       // Thermometers
            others: parseFloat(values[27]) || 0,             // Others Others
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

export const WasteDataProvider = ({ children }: { children: ReactNode }) => {
  const [wasteData, setWasteData] = useState<WasteDataRow[]>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } else {
        console.log('No data parsed, using default data');
        setWasteData(defaultData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setWasteData(defaultData);
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
        isLoading,
        error,
        refetch: fetchData,
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