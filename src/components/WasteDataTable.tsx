import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronUp, ChevronDown, Search, Table } from "lucide-react";
import { WasteDataRow } from "@/data/wasteData";
import { useWasteData } from "@/context/WasteDataContext";

type SortKey = "date" | "totalWaste" | "plastic" | "paper" | "glass" | "metal" | "ewaste" | "others" | "remarks";
type SortDirection = "asc" | "desc";

const WasteDataTable = () => {
  const { wasteData } = useWasteData();
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const getValue = (row: WasteDataRow, key: SortKey): number | string => {
    switch (key) {
      case "plastic":
        return Object.values(row.plastic).reduce((a, b) => a + b, 0);
      case "paper":
        return Object.values(row.paper).reduce((a, b) => a + b, 0);
      case "glass":
        return row.glass.whiteGrades + row.glass.others;
      case "metal":
        return Object.values(row.metal).reduce((a, b) => a + b, 0);
      case "ewaste":
        return Object.values(row.ewaste).reduce((a, b) => a + b, 0);
      case "others":
        return Object.values(row.others).reduce((a, b) => a + b, 0);
      case "remarks":
        return row.remarks;
      default:
        return row[key];
    }
  };

  const filteredData = wasteData.filter((row) => {
    const remarks = row.remarks ?? '';
    const remarksStr = typeof remarks === 'string' ? remarks : String(remarks);
    return remarksStr.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = getValue(a, sortKey);
    const bVal = getValue(b, sortKey);
    const modifier = sortDirection === "asc" ? 1 : -1;
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * modifier;
    }
    return String(aVal).localeCompare(String(bVal)) * modifier;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "date", label: "Date" },
    { key: "totalWaste", label: "Total (kg)" },
    { key: "plastic", label: "Plastic (kg)" },
    { key: "paper", label: "Paper (kg)" },
    { key: "glass", label: "Glass (kg)" },
    { key: "metal", label: "Metal (kg)" },
    { key: "ewaste", label: "E-Waste (kg)" },
    { key: "others", label: "Others (kg)" },
    { key: "remarks", label: "Remarks" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="chart-container p-3 sm:p-4 md:p-6"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-4">
        <h3 className="text-sm sm:text-base md:text-xl font-semibold text-foreground whitespace-nowrap flex items-center gap-2">
          <Table className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          Waste Collection Data
        </h3>

        <div className="relative flex-shrink-0">
          <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-7 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-32 sm:w-48 md:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {col.label}
                    <SortIcon columnKey={col.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground font-medium whitespace-nowrap">{row.date}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground">{row.totalWaste}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                  <span className="text-chart-plastic font-medium">
                    {Object.values(row.plastic).reduce((a, b) => a + b, 0)}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                  <span className="text-chart-paper font-medium">
                    {Object.values(row.paper).reduce((a, b) => a + b, 0)}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                  <span className="text-chart-glass font-medium">{row.glass.whiteGrades + row.glass.others}</span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                  <span className="text-chart-metal font-medium">
                    {Object.values(row.metal).reduce((a, b) => a + b, 0)}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                  <span className="text-chart-ewaste font-medium">
                    {Object.values(row.ewaste).reduce((a, b) => a + b, 0)}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                  <span className="text-chart-others font-medium">
                    {Object.values(row.others).reduce((a, b) => a + b, 0)}
                  </span>
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-muted-foreground min-w-[120px] sm:min-w-[200px] max-w-[200px] sm:max-w-[300px]">
                  <div className="whitespace-normal break-words line-clamp-2" title={row.remarks || ''}>
                    {row.remarks || '-'}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/50 flex-wrap gap-2">
          <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length}
          </p>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 rounded-lg bg-secondary/50 text-xs sm:text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors whitespace-nowrap"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 rounded-lg bg-secondary/50 text-xs sm:text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition-colors whitespace-nowrap"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WasteDataTable;
