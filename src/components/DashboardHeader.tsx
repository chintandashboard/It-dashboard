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
    <>
      {/* PDF Generation Loading Overlay */}
      {isGeneratingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" data-hide-in-pdf="true">
          <div className="flex flex-col items-center gap-4 p-8 bg-card rounded-xl shadow-2xl border border-border">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">Generating PDF Report</h3>
              <p className="text-sm text-muted-foreground mt-1">Please wait while we prepare your report...</p>
            </div>
          </div>
        </div>
      )}

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
        className="mt-4 mb-6 w-full overflow-hidden rounded-lg sm:rounded-xl relative min-h-[220px] sm:min-h-[260px]"
      >
        <img
          src={AyodhyaBanner}
          alt="SBIF CONSERW: Waste No More in Ayodhya"
          className="w-full h-full object-cover min-h-[220px] sm:min-h-[260px]"
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

      {/* PDF-only header info - hidden normally, shown in PDF capture */}
      <div className="hidden pdf-capture-mode:block mb-4 p-4 bg-secondary/30 rounded-lg border border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Project: SBI CONSERW - Waste Management Initiative</h2>
            <p className="text-sm text-muted-foreground">Location: Ayodhya, Uttar Pradesh</p>
            <p className="text-sm text-muted-foreground">Partners: SBI Foundation, SBI CONSERW, Chintan Environmental Research and Action Group</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Report Date: {format(currentDate, "dd MMM yyyy, HH:mm")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Waste Management Dashboard - Ayodhya
          </h1>
          
          {/* Project Details and Report Buttons - Hidden in PDF */}
          <div className="flex items-center gap-2 sm:gap-3" data-hide-in-pdf="true">
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
                        // Add PDF capture mode class to body for special styling
                        document.body.classList.add('pdf-capture-mode');
                        
                        // Extra delay to allow charts/animations to render
                        await new Promise((r) => setTimeout(r, 800));

                        const canvases: HTMLCanvasElement[] = [];
                        for (const el of targets) {
                          // Get the full height including any overflow
                          const rect = el.getBoundingClientRect();
                          const fullHeight = Math.max(el.offsetHeight, el.scrollHeight, rect.height);
                          const fullWidth = Math.max(el.offsetWidth, el.scrollWidth, rect.width);
                          
                          // Add extra padding to ensure content isn't cut off
                          const captureHeight = fullHeight + 20;
                          const captureWidth = fullWidth;
                          
                          const canvas = await html2canvas(el, {
                            scale: 2,
                            useCORS: true,
                            allowTaint: true,
                            scrollX: 0,
                            scrollY: 0,
                            x: 0,
                            y: 0,
                            backgroundColor: "#f9fafb",
                            width: captureWidth,
                            height: captureHeight,
                            windowWidth: captureWidth,
                            windowHeight: captureHeight,
                            logging: false,
                            imageTimeout: 15000,
                            onclone: (clonedDoc) => {
                              // Add PDF capture class to cloned body
                              clonedDoc.body.classList.add('pdf-capture-mode');
                              
                              // Show PDF-only header section
                              const pdfHeaders = clonedDoc.querySelectorAll('.hidden.pdf-capture-mode\\:block');
                              pdfHeaders.forEach((el) => {
                                if (el instanceof HTMLElement) {
                                  el.style.display = 'block';
                                }
                              });
                              
                              // Hide interactive buttons and loaders
                              const hideElements = clonedDoc.querySelectorAll('[data-hide-in-pdf="true"], .animate-spin, [class*="Loader"], [class*="loader"]');
                              hideElements.forEach((el) => {
                                if (el instanceof HTMLElement) {
                                  el.style.display = 'none';
                                }
                              });
                              
                              // Hide any elements containing "Generating" text
                              const allButtons = clonedDoc.querySelectorAll('button');
                              allButtons.forEach((btn) => {
                                if (btn.textContent?.includes('Generating')) {
                                  btn.style.display = 'none';
                                }
                              });
                              
                              // Fix all input and select elements - add padding to prevent clipping
                              const formElements = clonedDoc.querySelectorAll('input, select, button, [role="combobox"]');
                              formElements.forEach((el) => {
                                if (el instanceof HTMLElement) {
                                  el.style.paddingTop = '8px';
                                  el.style.paddingBottom = '8px';
                                  el.style.lineHeight = '1.6';
                                }
                              });
                              
                              // Fix SelectTrigger and similar components
                              const selectTriggers = clonedDoc.querySelectorAll('[class*="SelectTrigger"], [class*="select"]');
                              selectTriggers.forEach((el) => {
                                if (el instanceof HTMLElement) {
                                  el.style.paddingTop = '10px';
                                  el.style.paddingBottom = '10px';
                                  el.style.height = 'auto';
                                  el.style.minHeight = '40px';
                                }
                              });
                              
                              // Fix truncate class elements
                              const truncatedElements = clonedDoc.querySelectorAll('.truncate');
                              truncatedElements.forEach((el) => {
                                if (el instanceof HTMLElement) {
                                  el.style.overflow = 'visible';
                                  el.style.textOverflow = 'clip';
                                  el.style.whiteSpace = 'normal';
                                }
                              });
                              
                              // Fix all text elements - add padding and better line-height
                              const textElements = clonedDoc.querySelectorAll('span, p, h1, h2, h3, h4, h5, h6, label, td, th');
                              textElements.forEach((el) => {
                                if (el instanceof HTMLElement) {
                                  el.style.lineHeight = '1.8';
                                  el.style.paddingTop = '4px';
                                  el.style.paddingBottom = '2px';
                                }
                              });
                              
                              // Fix stat row items specifically
                              const statItems = clonedDoc.querySelectorAll('[class*="stat"], [class*="Stat"]');
                              statItems.forEach((el) => {
                                if (el instanceof HTMLElement) {
                                  el.style.paddingTop = '8px';
                                  el.style.paddingBottom = '8px';
                                }
                              });
                            }
                          });
                          
                          canvases.push(canvas);
                        }
                        
                        // Remove PDF capture mode class
                        document.body.classList.remove('pdf-capture-mode');

                        const sectionGap = 40; // Gap between sections
                        const totalHeight = canvases.reduce((sum, c) => sum + c.height, 0) + (canvases.length - 1) * sectionGap;
                        const maxWidth = canvases.reduce((max, c) => Math.max(max, c.width), 0);
                        const padding = 60;
                        const pageWidth = maxWidth + padding * 2;
                        const pageHeight = totalHeight + padding * 2;
                        
                        const pdf = new jsPDF({
                          orientation: pageWidth >= pageHeight ? "landscape" : "portrait",
                          unit: "px",
                          format: [pageWidth, pageHeight],
                          compress: true,
                          hotfixes: ["px_scaling"],
                        });

                        let yCursor = padding;
                        canvases.forEach((canvas, index) => {
                          const imgData = canvas.toDataURL("image/png", 1.0);
                          const x = (pageWidth - canvas.width) / 2;
                          pdf.addImage(imgData, "PNG", x, yCursor, canvas.width, canvas.height, undefined, "NONE");
                          yCursor += canvas.height;
                          // Add gap between sections (except after the last one)
                          if (index < canvases.length - 1) {
                            yCursor += sectionGap;
                          }
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
    </>
  );
};

export default DashboardHeader;