import { motion } from "framer-motion";
import { Calendar, FileText, Download, Info, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SBIFoundation from "@/assets/images/SBI-Foundation.png";
import SBIConserw from "@/assets/images/Sbi-CONSERW.png";
import Ayodhya from "@/assets/images/Ayodhya.png";
import Chintan from "@/assets/images/Chintan.png";
import AyodhyaBanner from "@/assets/images/ayodhya.webp";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DashboardHeader = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState<"day" | "week" | "month" | "quarter" | "year">("day");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Partner Logos - Matching reference image layout */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center mb-4 w-full"
      >
        <div className="flex items-center justify-between w-full bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6">
          <div className="flex items-center justify-center h-10 sm:h-14 md:h-16 lg:h-20 w-[19%]">
            <img src={SBIFoundation} alt="SBI Foundation" className="h-full w-auto object-contain" />
          </div>
          <div className="flex items-center justify-center h-10 sm:h-14 md:h-16 lg:h-20 w-[27%]">
            <img src={SBIConserw} alt="SBI CONSERW" className="h-full w-auto object-contain" />
          </div>
          <div className="flex items-center justify-center h-10 sm:h-14 md:h-16 lg:h-20 w-[27%]">
            <img src={Ayodhya} alt="Ayodhya" className="h-full w-auto object-contain" />
          </div>
          <div className="flex items-center justify-center h-10 sm:h-14 md:h-16 lg:h-20 w-[27%]">
            <img src={Chintan} alt="Chintan" className="h-full w-auto object-contain" />
          </div>
        </div>
      </motion.div>

      {/* Ayodhya Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 mb-6 w-full overflow-hidden rounded-lg sm:rounded-xl relative"
      >
        <img 
          src={AyodhyaBanner} 
          alt="SBIF CONSERW: Waste No More in Ayodhya" 
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/30 via-sky-500/60 to-teal-500/40 flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 min-h-[180px] sm:min-h-[220px]">
          <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg tracking-wide mb-2 sm:mb-3 text-center leading-tight px-3 py-1.5 rounded-md ">
            SBIF CONSERW: WASTE NO MORE IN AYODHYA
          </h2>
          <p className="text-[11px] sm:text-sm md:text-base text-white/90 italic max-w-4xl mx-auto leading-snug text-center px-3 py-1.5 rounded-md  break-words">
            Supported by Ayodhya Nagar Nigam, Chintan Environmental Research and Action Group, and SBI Foundation under their Conservation through Sustainable Engagements, Restoration and Wildlife Protection (CONSERW) program
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Waste Management Dashboard - Ayodhya
          </h1>
          
          {/* Project Details and Report Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Project Details Button */}
            <Dialog>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs sm:text-sm font-medium transition-colors"
                >
                  <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Project Details</span>
                </motion.button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Project Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Project Name</h4>
                    <p className="text-muted-foreground text-sm">SBI CONSERW - Waste Management Initiative</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Location</h4>
                    <p className="text-muted-foreground text-sm">Ayodhya, Uttar Pradesh</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Partners</h4>
                    <ul className="text-muted-foreground text-sm list-disc list-inside">
                      <li>SBI Foundation</li>
                      <li>SBI CONSERW</li>
                      <li>Chintan Environmental Research and Action Group</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Description</h4>
                    <p className="text-muted-foreground text-sm">
                      This initiative focuses on sustainable waste management practices including collection, 
                      segregation, and recycling of various waste categories such as plastic, paper, glass, 
                      metal, and e-waste in the Ayodhya region.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const content = `SBI CONSERW - Waste Management Initiative
Location: Ayodhya, Uttar Pradesh

Partners:
- SBI Foundation
- SBI CONSERW
- Chintan Environmental Research and Action Group

Description:
This initiative focuses on sustainable waste management practices including collection, 
segregation, and recycling of various waste categories such as plastic, paper, glass, 
metal, and e-waste in the Ayodhya region.`;
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'project-details.txt';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors w-full justify-center"
                  >
                    <Download className="w-4 h-4" />
                    Download Project Details
                  </motion.button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Report Download Button */}
            <Dialog
              open={reportDialogOpen}
              onOpenChange={(open) => {
                setReportDialogOpen(open);
                // Pause truck animation while dialog is open, resume on close
                window.dispatchEvent(new CustomEvent("report-dialog-toggle", { detail: open }));
              }}
            >
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isGeneratingReport}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent-foreground text-xs sm:text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGeneratingReport ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Report</span>
                      <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </>
                  )}
                </motion.button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Select period</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select value={reportPeriod} onValueChange={(val) => setReportPeriod(val as typeof reportPeriod)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isGeneratingReport}
                    onClick={async () => {
                      setIsGeneratingReport(true);
                      // Broadcast selected period so all widgets sync before capture
                      window.dispatchEvent(new CustomEvent("report-period-selected", { detail: reportPeriod }));
                      // Close the dialog so the overlay is not captured
                      setReportDialogOpen(false);
                      // Wait for close animation to finish and UI to settle
                      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
                      await new Promise((r) => setTimeout(r, 180));
                      // Force all sections to render/animate for capture and allow charts to size
                      window.dispatchEvent(new CustomEvent("report-generating", { detail: true }));
                      await new Promise((r) => setTimeout(r, 320));
                      window.dispatchEvent(new Event("resize"));
                      window.scrollTo({ top: 0, behavior: "auto" });
                      document.documentElement.scrollTop = 0;
                      document.body.scrollTop = 0;
                      // Capture all report sections and stitch into one tall single-page PDF
                      const sectionNodes = Array.from(
                        document.querySelectorAll<HTMLElement>("[data-report-section]")
                      );
                      const targets = sectionNodes.length > 0 ? sectionNodes : [document.documentElement];
                      try {
                        // Extra delay to allow charts/animations to render
                        await new Promise((r) => setTimeout(r, 600));

                        const canvases: HTMLCanvasElement[] = [];
                        for (const el of targets) {
                          const canvas = await html2canvas(el, {
                            scale: 1.25,
                            useCORS: true,
                            allowTaint: true,
                            scrollX: 0,
                            scrollY: 0,
                            x: 0,
                            y: 0,
                            backgroundColor: getComputedStyle(document.body).backgroundColor || "#f9fafb",
                            width: el.scrollWidth,
                            height: el.scrollHeight,
                            windowWidth: el.scrollWidth,
                            windowHeight: el.scrollHeight,
                          });
                          canvases.push(canvas);
                        }

                        const totalHeight = canvases.reduce((sum, c) => sum + c.height, 0);
                        const maxWidth = canvases.reduce((max, c) => Math.max(max, c.width), 0);
                        const padding = 80; // add margins so content is visually centered
                        const pageWidth = maxWidth + padding * 2;
                        const pageHeight = totalHeight + padding * 2;
                        const pdf = new jsPDF({
                          orientation: pageWidth >= pageHeight ? "landscape" : "portrait",
                          unit: "px",
                          format: [pageWidth, pageHeight],
                        });

                        let yCursor = padding;
                        canvases.forEach((canvas) => {
                          const imgData = canvas.toDataURL("image/png");
                          const x = (pageWidth - canvas.width) / 2; // center horizontally
                          pdf.addImage(imgData, "PNG", x, yCursor, canvas.width, canvas.height, undefined, "FAST");
                          yCursor += canvas.height;
                        });

                        pdf.save(`waste-management-report-${reportPeriod}-${format(new Date(), "dd-MMM-yyyy")}.pdf`);
                      } catch (error) {
                        console.error('Error generating report:', error);
                      } finally {
                        setIsGeneratingReport(false);
                        setReportDialogOpen(false);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isGeneratingReport ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-secondary/50 border border-border/50 self-end lg:self-auto"
        >
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
          <span className="text-xs sm:text-sm text-muted-foreground">
            {format(currentDate, "dd MMM yyyy, HH:mm:ss")}
          </span>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;