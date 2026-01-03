import { motion } from "framer-motion";
import { Calendar as CalendarIcon, FileText, Download, Info, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SBIFoundation from "@/assets/images/SBI-Foundation.png";
import SBIConserw from "@/assets/images/Sbi-CONSERW.png";
import Ayodhya from "@/assets/images/Ayodhya.png";
import Chintan from "@/assets/images/Chintan.png";
import AyodhyaBanner from "@/assets/images/ayodhya.webp";
import { generateProjectDetailsPDF } from "@/utils/generateProjectDetailsPDF";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DashboardHeader = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingProjectPDF, setIsGeneratingProjectPDF] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDatePopoverOpen, setStartDatePopoverOpen] = useState(false);
  const [endDatePopoverOpen, setEndDatePopoverOpen] = useState(false);

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
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Report Date: {format(currentDate, "dd MMM yyyy, HH:mm")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <h1 className="text-sm xs:text-base sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Waste Management Dashboard - Ayodhya
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          {/* Project Details and Report Buttons - Hidden in PDF */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0" data-hide-in-pdf="true">
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
              <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Project Description Sheet</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4 text-sm">
                  {/* Project Title */}
                  <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-bold text-primary text-lg">PROJECT TITLE</h4>
                    <p className="text-foreground font-semibold">SBIF CONSERW: Waste No More in Ayodhya</p>
                  </div>

                  {/* Project Location */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">PROJECT LOCATION</h4>
                    <p className="text-muted-foreground">Ayodhya, Uttar Pradesh (4 selected municipal wards)</p>
                  </div>

                  {/* Project Duration */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">PROJECT DURATION</h4>
                    <p className="text-muted-foreground">3 Years and 1 Month (March 2025 – March 2028)</p>
                  </div>

                  {/* Implementing Agency */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">IMPLEMENTING AGENCY</h4>
                    <p className="text-muted-foreground">
                      Chintan Environmental Research and Action Group in partnership with SBI Foundation under its 
                      Conservation through Sustainable Engagements, Restoration and Wildlife Protection (CONSERW) Programme, 
                      and Ayodhya Nagar Nigam.
                    </p>
                  </div>

                  {/* Project Background and Rationale */}
                  <div className="space-y-2 p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-bold text-foreground">PROJECT BACKGROUND AND RATIONALE</h4>
                    <p className="text-muted-foreground">
                      Ayodhya, one of India's most revered cities, is witnessing rapid urbanisation, increased pilgrimage-driven footfall, 
                      and rising solid waste generation. These pressures have strained existing municipal waste management systems, 
                      leading to challenges such as low segregation at source, high landfill dependency, limited recycling, and informal 
                      and unsafe working conditions for waste workers.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      The project "SBIF CONSERW: Waste No More in Ayodhya" has been conceptualised as a comprehensive, inclusive, and 
                      sustainable response to these challenges. Anchored in circular economy principles, the project aims to strengthen 
                      municipal solid waste management systems while placing communities and waste workers at the centre of change. 
                      It seeks to demonstrate how coordinated action between a municipal body, a corporate CSR programme, and a civil 
                      society organisation can create scalable, replicable models for Tier 2 and Tier 3 cities across India.
                    </p>
                  </div>

                  {/* Project Goal */}
                  <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-bold text-foreground">PROJECT GOAL</h4>
                    <p className="text-muted-foreground">
                      To establish an integrated, inclusive, and sustainable solid waste management system in Ayodhya 
                      that significantly reduces landfill dependency, increases recycling and resource recovery, and 
                      promotes climate-conscious behaviour among citizens.
                    </p>
                  </div>

                  {/* Key Objectives */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">KEY OBJECTIVES</h4>
                    <ul className="text-muted-foreground list-disc list-inside space-y-1">
                      <li>Establish an end-to-end solid waste management system in four municipal wards of Ayodhya.</li>
                      <li>Improve waste segregation at source by at least 35% through sustained community engagement and IEC interventions.</li>
                      <li>Reduce landfill-bound waste by strengthening collection, segregation, processing, and recycling systems.</li>
                      <li>Set up and operationalise a 4 TPD Material Recovery Facility (MRF) for efficient processing of dry waste.</li>
                      <li>Integrate technology-enabled solutions, including GPS-enabled waste collection tracking and a real-time project dashboard.</li>
                      <li>Build capacities of waste pickers, municipal staff, bulk waste generators, and community ambassadors, with a strong focus on women's empowerment and gender inclusivity.</li>
                      <li>Develop model zero-waste wards and promote reuse initiatives such as Nekki Ki Diwar.</li>
                      <li>Ensure long-term sustainability through a structured handover and transition plan to Ayodhya Nagar Nigam post-project completion.</li>
                    </ul>
                  </div>

                  {/* Key Project Components */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-foreground text-base">KEY PROJECT COMPONENTS</h4>
                    
                    {/* 1. Stakeholder Engagement */}
                    <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                      <h5 className="font-semibold text-foreground">1. Stakeholder Engagement and Governance</h5>
                      <ul className="text-muted-foreground list-disc list-inside space-y-1">
                        <li>Formal collaboration with Ayodhya Nagar Nigam through MoUs and approvals.</li>
                        <li>Regular coordination meetings with municipal officials, recyclers, informal sector representatives, educational institutions, and community leaders.</li>
                        <li>Establishment of clear operational roles and responsibilities across stakeholders.</li>
                      </ul>
                    </div>

                    {/* 2. IEC */}
                    <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                      <h5 className="font-semibold text-foreground">2. Information, Education and Communication (IEC) for Behaviour Change</h5>
                      <ul className="text-muted-foreground list-disc list-inside space-y-1">
                        <li>Door-to-door awareness campaigns across four wards to promote waste segregation and responsible disposal.</li>
                        <li>Community workshops, clean-up drives, and public engagement events.</li>
                        <li>Targeted trainings for waste management stakeholders including waste pickers (SWM Rules, 2016 compliance), municipal staff and contractors, Bulk Waste Generators (BWGs), and women waste pickers (health, safety, menstrual hygiene, and skills).</li>
                        <li>Large-scale outreach to residents, pilgrims, institutions, and BWGs, with an estimated reach of over 1 million people.</li>
                      </ul>
                    </div>

                    {/* 3. Waste Collection */}
                    <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                      <h5 className="font-semibold text-foreground">3. Strengthening Waste Collection Systems</h5>
                      <ul className="text-muted-foreground list-disc list-inside space-y-1">
                        <li>Deployment of efficient and regular waste collection systems.</li>
                        <li>Procurement and use of waste collection vehicles.</li>
                        <li>GPS-enabled route mapping and optimisation for improved monitoring and efficiency.</li>
                        <li>Formal engagement and training of 50 women waste workers as community ambassadors.</li>
                      </ul>
                    </div>

                    {/* 4. Infrastructure */}
                    <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                      <h5 className="font-semibold text-foreground">4. Infrastructure Development</h5>
                      <ul className="text-muted-foreground list-disc list-inside space-y-1">
                        <li>Identification and development of land for waste processing infrastructure.</li>
                        <li>Establishment and operation of a 4 TPD Material Recovery Facility (MRF).</li>
                        <li>Dedicated collection and segregation centres for wet and dry waste.</li>
                      </ul>
                    </div>

                    {/* 5. Waste Processing */}
                    <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                      <h5 className="font-semibold text-foreground">5. Waste Processing and End-Use Solutions</h5>
                      <ul className="text-muted-foreground list-disc list-inside space-y-1">
                        <li>Processing of approximately 460 tonnes of dry waste annually and 110 tonnes of wet waste annually.</li>
                        <li>Partnerships with authorised recyclers and offtake agencies for sustainable material recovery.</li>
                        <li>Composting of organic waste and promotion of reuse initiatives, including reduction of waste through Nekki Ki Diwar.</li>
                      </ul>
                    </div>

                    {/* 6. Technology */}
                    <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                      <h5 className="font-semibold text-foreground">6. Technology Integration and Monitoring</h5>
                      <ul className="text-muted-foreground list-disc list-inside space-y-1">
                        <li>Development and deployment of a real-time waste tracking and monitoring dashboard.</li>
                        <li>Continuous tracking of key indicators such as segregation rates, quantities processed, and landfill diversion.</li>
                        <li>Midline and end-line assessments, including material flow analysis and community engagement review.</li>
                      </ul>
                    </div>

                    {/* 7. Sustainability */}
                    <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                      <h5 className="font-semibold text-foreground">7. Sustainability, Handover and Exit Strategy</h5>
                      <ul className="text-muted-foreground list-disc list-inside space-y-1">
                        <li>Progressive capacity building of Ayodhya Nagar Nigam staff and local stakeholders.</li>
                        <li>Development of standard operating procedures (SOPs) and training documentation.</li>
                        <li>Structured handover of operations to the municipal authority to ensure continuity post-project.</li>
                        <li>Revenue from sale of recyclables and compost to be ring-fenced and reinvested exclusively for sustaining the waste management model.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Replicability and Scale */}
                  <div className="space-y-2 p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-bold text-foreground">REPLICABILITY AND SCALE</h4>
                    <p className="text-muted-foreground">
                      The project is designed as a demonstration and learning model for Tier 2 and Tier 3 cities. By combining infrastructure, 
                      community engagement, technology, and governance reforms, Waste No More in Ayodhya aims to offer a scalable framework 
                      that can be adapted by other urban local bodies across India.
                    </p>
                  </div>

                  {/* Funding and Support */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">FUNDING AND SUPPORT</h4>
                    <p className="text-muted-foreground">
                      The project is supported by SBI Foundation under its Conservation through Sustainable Engagements, 
                      Restoration and Wildlife Protection (CONSERW) Programme, a CSR Initiative.
                    </p>
                  </div>

                  {/* Key Partners */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">KEY PARTNERS</h4>
                    <ul className="text-muted-foreground list-disc list-inside space-y-1">
                      <li><span className="font-medium">Ayodhya Nagar Nigam</span> – Municipal authority and long-term custodian of the system</li>
                      <li><span className="font-medium">SBI Foundation</span> – CSR partner and strategic supporter under CONSERW</li>
                      <li><span className="font-medium">Chintan Environmental Research and Action Group</span> – Implementing agency and knowledge partner</li>
                    </ul>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-bold text-foreground">CONTACT INFORMATION</h4>
                    <p className="text-muted-foreground">Mr. Apoorva Agrawal</p>
                    <p className="text-muted-foreground">Manager – Strategic Alliances</p>
                    <p className="text-muted-foreground">Chintan Environmental Research and Action Group</p>
                    <p className="text-muted-foreground">C-14, Second Floor, Block C, Lajpat Nagar III, New Delhi – 110024</p>
                    <p className="text-muted-foreground">Email: apoorva@chintan-india.org</p>
                  </div>

                  {/* Download Button */}
                  <motion.button
                    onClick={async () => {
                      setIsGeneratingProjectPDF(true);
                      try {
                        await generateProjectDetailsPDF();
                      } finally {
                        setIsGeneratingProjectPDF(false);
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isGeneratingProjectPDF}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isGeneratingProjectPDF ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download Project Details (PDF)
                      </>
                    )}
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
                  <DialogTitle>Select Date Range for Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Start Date Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Start Date</label>
                    <Popover open={startDatePopoverOpen} onOpenChange={setStartDatePopoverOpen} modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "dd MMM yyyy") : <span>Pick start date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[100]" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            // Don't close immediately - let user see the selection
                          }}
                          today={new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                        <div className="p-2 border-t flex justify-end">
                          <Button 
                            size="sm" 
                            onClick={() => setStartDatePopoverOpen(false)}
                            disabled={!startDate}
                          >
                            Confirm
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* End Date Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">End Date</label>
                    <Popover open={endDatePopoverOpen} onOpenChange={setEndDatePopoverOpen} modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "dd MMM yyyy") : <span>Pick end date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[100]" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            setEndDate(date);
                            // Don't close immediately - let user see the selection
                          }}
                          disabled={(date) => startDate ? date < startDate : false}
                          today={new Date()}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                        <div className="p-2 border-t flex justify-end">
                          <Button 
                            size="sm" 
                            onClick={() => setEndDatePopoverOpen(false)}
                            disabled={!endDate}
                          >
                            Confirm
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isGeneratingReport || !startDate || !endDate}
                    onClick={async () => {
                      if (!startDate || !endDate) return;
                      setIsGeneratingReport(true);
                      
                      // Close the dialog first so the overlay is not captured
                      setReportDialogOpen(false);
                      
                      // Wait for dialog close animation
                      await new Promise((r) => setTimeout(r, 200));
                      
                      // Broadcast selected date range so all widgets sync before capture
                      console.log('Dispatching date range for PDF:', startDate, 'to', endDate);
                      window.dispatchEvent(new CustomEvent("report-date-range-selected", { 
                        detail: { startDate, endDate } 
                      }));
                      
                      // Wait for data to filter and React to re-render with new data
                      // This is critical - the data context needs time to filter and components need to re-render
                      await new Promise((r) => setTimeout(r, 1500));
                      
                      // Force all sections to render/animate for capture and allow charts to size
                      window.dispatchEvent(new CustomEvent("report-generating", { detail: true }));
                      await new Promise((r) => setTimeout(r, 500));
                      
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
                        
                        // Extra delay to allow charts/animations to fully render
                        await new Promise((r) => setTimeout(r, 1000));

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

                        // Save PDF and wait for it to complete
                        const dateRangeStr = startDate && endDate 
                          ? `${format(startDate, "dd-MMM-yyyy")}_to_${format(endDate, "dd-MMM-yyyy")}`
                          : format(new Date(), "dd-MMM-yyyy");
                        pdf.save(`waste-management-report-${dateRangeStr}.pdf`);
                        
                        // Add a delay after save to ensure download starts before hiding loader
                        await new Promise((r) => setTimeout(r, 1500));
                      } catch (error) {
                        console.error('Error generating report:', error);
                      } finally {
                        // Remove PDF capture mode class if still present
                        document.body.classList.remove('pdf-capture-mode');
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl bg-secondary/50 border border-border/50"
          >
            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              {format(currentDate, "dd MMM yyyy, HH:mm:ss")}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.header>
    </>
  );
};

export default DashboardHeader;