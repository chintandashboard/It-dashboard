import jsPDF from "jspdf";
import SBIFoundation from "@/assets/images/SBI-Foundation.png";
import SBIConserw from "@/assets/images/Sbi-CONSERW.png";
import AyodhyaLogo from "@/assets/images/Ayodhya.png";
import Chintan from "@/assets/images/Chintan.png";

// Helper function to convert image URL to base64
const getBase64FromUrl = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const generateProjectDetailsPDF = async () => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const logoHeaderHeight = 20;
  let y = margin;

  // Load all logos as base64
  const [sbiFoundationBase64, sbiConserwBase64, ayodhyaBase64, chintanBase64] = await Promise.all([
    getBase64FromUrl(SBIFoundation),
    getBase64FromUrl(SBIConserw),
    getBase64FromUrl(AyodhyaLogo),
    getBase64FromUrl(Chintan),
  ]);

  // Function to add logos header to any page
  const addLogosHeader = () => {
    const logoY = 5;
    const logoHeight = 12;
    const totalLogoWidth = contentWidth;
    const logoSpacing = totalLogoWidth / 4;
    const logoWidth = 35;

    // White background for logo area
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, logoHeaderHeight, "F");

    // Add logos centered in their sections
    const startX = margin;
    
    try {
      pdf.addImage(sbiFoundationBase64, "PNG", startX, logoY, logoWidth * 0.7, logoHeight);
      pdf.addImage(sbiConserwBase64, "PNG", startX + logoSpacing, logoY, logoWidth, logoHeight);
      pdf.addImage(ayodhyaBase64, "PNG", startX + logoSpacing * 2, logoY, logoWidth, logoHeight);
      pdf.addImage(chintanBase64, "PNG", startX + logoSpacing * 3, logoY, logoWidth * 0.8, logoHeight);
    } catch (e) {
      console.error("Error adding logos:", e);
    }

    // Add separator line below logos
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, logoHeaderHeight + 2, pageWidth - margin, logoHeaderHeight + 2);
  };

  // Add logos to first page
  addLogosHeader();
  y = logoHeaderHeight + 8;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, yPos: number, maxWidth: number, fontSize: number, isBold = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, yPos);
    return yPos + lines.length * (fontSize * 0.4);
  };

  // Check if we need a new page (with logos)
  const checkNewPage = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      addLogosHeader();
      y = logoHeaderHeight + 8;
    }
  };

  // Title
  pdf.setFillColor(0, 102, 153);
  pdf.rect(0, y - 3, pageWidth, 18, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("PROJECT DESCRIPTION SHEET", pageWidth / 2, y + 7, { align: "center" });
  y += 22;

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  // Project Title Section
  pdf.setFillColor(230, 242, 255);
  pdf.rect(margin, y, contentWidth, 18, "F");
  pdf.setDrawColor(0, 102, 153);
  pdf.rect(margin, y, contentWidth, 18);
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 102, 153);
  pdf.text("PROJECT TITLE", margin + 5, y + 6);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("SBIF CONSERW: Waste No More in Ayodhya", margin + 5, y + 14);
  y += 25;

  // Project Location
  checkNewPage(15);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 102, 153);
  pdf.text("PROJECT LOCATION", margin, y);
  y += 5;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.text("Ayodhya, Uttar Pradesh (4 selected municipal wards)", margin, y);
  y += 10;

  // Project Duration
  checkNewPage(15);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 102, 153);
  pdf.text("PROJECT DURATION", margin, y);
  y += 5;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.text("3 Years and 1 Month (March 2025 - March 2028)", margin, y);
  y += 10;

  // Implementing Agency
  checkNewPage(25);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 102, 153);
  pdf.text("IMPLEMENTING AGENCY", margin, y);
  y += 5;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  const agencyText = "Chintan Environmental Research and Action Group in partnership with SBI Foundation under its Conservation through Sustainable Engagements, Restoration and Wildlife Protection (CONSERW) Programme, and Ayodhya Nagar Nigam.";
  y = addWrappedText(agencyText, margin, y, contentWidth, 9);
  y += 5;

  // Project Background and Rationale
  checkNewPage(50);
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, y, contentWidth, 45, "F");
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 102, 153);
  pdf.text("PROJECT BACKGROUND AND RATIONALE", margin + 3, y + 6);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  
  const bgText1 = "Ayodhya, one of India's most revered cities, is witnessing rapid urbanisation, increased pilgrimage-driven footfall, and rising solid waste generation. These pressures have strained existing municipal waste management systems, leading to challenges such as low segregation at source, high landfill dependency, limited recycling, and informal and unsafe working conditions for waste workers.";
  const lines1 = pdf.splitTextToSize(bgText1, contentWidth - 6);
  pdf.text(lines1, margin + 3, y + 12);
  
  const bgText2 = "The project \"SBIF CONSERW: Waste No More in Ayodhya\" has been conceptualised as a comprehensive, inclusive, and sustainable response to these challenges. Anchored in circular economy principles, the project aims to strengthen municipal solid waste management systems while placing communities and waste workers at the centre of change.";
  const lines2 = pdf.splitTextToSize(bgText2, contentWidth - 6);
  pdf.text(lines2, margin + 3, y + 28);
  
  y += 52;

  // Project Goal
  checkNewPage(25);
  pdf.setFillColor(230, 242, 255);
  pdf.rect(margin, y, contentWidth, 20, "F");
  pdf.setDrawColor(0, 102, 153);
  pdf.rect(margin, y, contentWidth, 20);
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 102, 153);
  pdf.text("PROJECT GOAL", margin + 3, y + 6);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  const goalText = "To establish an integrated, inclusive, and sustainable solid waste management system in Ayodhya that significantly reduces landfill dependency, increases recycling and resource recovery, and promotes climate-conscious behaviour among citizens.";
  const goalLines = pdf.splitTextToSize(goalText, contentWidth - 6);
  pdf.text(goalLines, margin + 3, y + 12);
  y += 27;

  // Key Objectives
  checkNewPage(50);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 102, 153);
  pdf.text("KEY OBJECTIVES", margin, y);
  y += 6;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  
  const objectives = [
    "Establish an end-to-end solid waste management system in four municipal wards of Ayodhya.",
    "Improve waste segregation at source by at least 35% through sustained community engagement and IEC interventions.",
    "Reduce landfill-bound waste by strengthening collection, segregation, processing, and recycling systems.",
    "Set up and operationalise a 4 TPD Material Recovery Facility (MRF) for efficient processing of dry waste.",
    "Integrate technology-enabled solutions, including GPS-enabled waste collection tracking and a real-time project dashboard.",
    "Build capacities of waste pickers, municipal staff, bulk waste generators, and community ambassadors.",
    "Develop model zero-waste wards and promote reuse initiatives such as Nekki Ki Diwar.",
    "Ensure long-term sustainability through a structured handover and transition plan to Ayodhya Nagar Nigam."
  ];
  
  objectives.forEach((obj, index) => {
    checkNewPage(10);
    const bullet = `${index + 1}. ${obj}`;
    const objLines = pdf.splitTextToSize(bullet, contentWidth - 5);
    pdf.text(objLines, margin + 2, y);
    y += objLines.length * 3.5 + 1;
  });
  y += 5;

  // Key Project Components - New Page
  pdf.addPage();
  addLogosHeader();
  y = logoHeaderHeight + 8;

  pdf.setFillColor(0, 102, 153);
  pdf.rect(0, y - 3, pageWidth, 12, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("KEY PROJECT COMPONENTS", pageWidth / 2, y + 4, { align: "center" });
  y += 15;

  pdf.setTextColor(0, 0, 0);

  const components = [
    {
      title: "1. Stakeholder Engagement and Governance",
      items: [
        "Formal collaboration with Ayodhya Nagar Nigam through MoUs and approvals.",
        "Regular coordination meetings with municipal officials, recyclers, informal sector representatives.",
        "Establishment of clear operational roles and responsibilities across stakeholders."
      ]
    },
    {
      title: "2. Information, Education and Communication (IEC) for Behaviour Change",
      items: [
        "Door-to-door awareness campaigns across four wards to promote waste segregation.",
        "Community workshops, clean-up drives, and public engagement events.",
        "Targeted trainings for waste management stakeholders.",
        "Large-scale outreach with an estimated reach of over 1 million people."
      ]
    },
    {
      title: "3. Strengthening Waste Collection Systems",
      items: [
        "Deployment of efficient and regular waste collection systems.",
        "Procurement and use of waste collection vehicles.",
        "GPS-enabled route mapping and optimisation for improved monitoring.",
        "Formal engagement and training of 50 women waste workers as community ambassadors."
      ]
    },
    {
      title: "4. Infrastructure Development",
      items: [
        "Identification and development of land for waste processing infrastructure.",
        "Establishment and operation of a 4 TPD Material Recovery Facility (MRF).",
        "Dedicated collection and segregation centres for wet and dry waste."
      ]
    },
    {
      title: "5. Waste Processing and End-Use Solutions",
      items: [
        "Processing of approximately 460 tonnes of dry waste annually and 110 tonnes of wet waste annually.",
        "Partnerships with authorised recyclers and offtake agencies for sustainable material recovery.",
        "Composting of organic waste and promotion of reuse initiatives."
      ]
    },
    {
      title: "6. Technology Integration and Monitoring",
      items: [
        "Development and deployment of a real-time waste tracking and monitoring dashboard.",
        "Continuous tracking of key indicators such as segregation rates and landfill diversion.",
        "Midline and end-line assessments, including material flow analysis."
      ]
    },
    {
      title: "7. Sustainability, Handover and Exit Strategy",
      items: [
        "Progressive capacity building of Ayodhya Nagar Nigam staff and local stakeholders.",
        "Development of standard operating procedures (SOPs) and training documentation.",
        "Structured handover of operations to the municipal authority post-project.",
        "Revenue from sale of recyclables to be reinvested for sustaining the waste management model."
      ]
    }
  ];

  components.forEach((comp) => {
    checkNewPage(25);
    
    // Component title with left border
    pdf.setDrawColor(0, 102, 153);
    pdf.setLineWidth(1);
    pdf.line(margin, y - 1, margin, y + 4);
    
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 51, 102);
    pdf.text(comp.title, margin + 3, y + 2);
    y += 7;
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    
    comp.items.forEach((item) => {
      checkNewPage(8);
      const itemLines = pdf.splitTextToSize("• " + item, contentWidth - 8);
      pdf.text(itemLines, margin + 5, y);
      y += itemLines.length * 3.2 + 1;
    });
    y += 4;
  });

  // Replicability and Scale
  checkNewPage(30);
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, y, contentWidth, 18, "F");
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 102, 153);
  pdf.text("REPLICABILITY AND SCALE", margin + 3, y + 6);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  const replicabilityText = "The project is designed as a demonstration and learning model for Tier 2 and Tier 3 cities. By combining infrastructure, community engagement, technology, and governance reforms, Waste No More in Ayodhya aims to offer a scalable framework that can be adapted by other urban local bodies across India.";
  const repLines = pdf.splitTextToSize(replicabilityText, contentWidth - 6);
  pdf.text(repLines, margin + 3, y + 11);
  y += 25;

  // Funding and Support
  checkNewPage(20);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 102, 153);
  pdf.text("FUNDING AND SUPPORT", margin, y);
  y += 5;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  const fundingText = "The project is supported by SBI Foundation under its Conservation through Sustainable Engagements, Restoration and Wildlife Protection (CONSERW) Programme, a CSR Initiative.";
  const fundLines = pdf.splitTextToSize(fundingText, contentWidth);
  pdf.text(fundLines, margin, y);
  y += fundLines.length * 3.5 + 5;

  // Key Partners
  checkNewPage(25);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 102, 153);
  pdf.text("KEY PARTNERS", margin, y);
  y += 6;
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(8);
  
  const partners = [
    { name: "Ayodhya Nagar Nigam", desc: "Municipal authority and long-term custodian of the system" },
    { name: "SBI Foundation", desc: "CSR partner and strategic supporter under CONSERW" },
    { name: "Chintan Environmental Research and Action Group", desc: "Implementing agency and knowledge partner" }
  ];
  
  partners.forEach((partner) => {
    pdf.setFont("helvetica", "bold");
    pdf.text("• " + partner.name + " - ", margin + 2, y);
    const nameWidth = pdf.getTextWidth("• " + partner.name + " - ");
    pdf.setFont("helvetica", "normal");
    pdf.text(partner.desc, margin + 2 + nameWidth, y);
    y += 5;
  });
  y += 5;

  // Contact Information
  checkNewPage(30);
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, y, contentWidth, 28, "F");
  
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 102, 153);
  pdf.text("CONTACT INFORMATION", margin + 3, y + 6);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text("Mr. Apoorva Agrawal", margin + 3, y + 12);
  pdf.text("Manager - Strategic Alliances", margin + 3, y + 16);
  pdf.text("Chintan Environmental Research and Action Group", margin + 3, y + 20);
  pdf.text("C-14, Second Floor, Block C, Lajpat Nagar III, New Delhi - 110024", margin + 3, y + 24);
  
  pdf.setTextColor(0, 102, 153);
  pdf.text("Email: apoorva@chintan-india.org", margin + 3, y + 28);

  // Add footer to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`SBIF CONSERW: Waste No More in Ayodhya - Project Description Sheet | Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: "center" });
  }

  // Save the PDF
  pdf.save("Project_Description_Sheet.pdf");
};
