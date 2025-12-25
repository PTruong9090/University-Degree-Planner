import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export async function exportElementToPDF(element, { fileName = "4-year-plan.pdf" } = {}) {
  if (!element) {
    throw new Error("No DOM element provided for PDF export");
  }

  try {
    // 1. Convert DOM to PNG Data URL
    const dataUrl = await toPng(element, { 
        cacheBust: true, 
        pixelRatio: 4,
        quality: 1.0,
        backgroundColor: '#ffffff' // Ensures transparent backgrounds become white
    });

    // 2. Initialize PDF (Landscape, Millimeters, A4 size)
    const pdf = new jsPDF("l", "mm", "a4");

    // 3. Define Page Constraints
    const pageWidth = pdf.internal.pageSize.getWidth();   // 297mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm
    const margin = 10; // 10mm margin
    const usableWidth = pageWidth - (margin * 2);
    const usableHeight = pageHeight - (margin * 2);

    // 4. Load Image to calculate dimensions
    const imgProps = pdf.getImageProperties(dataUrl);
    const imgWidth = imgProps.width;
    const imgHeight = imgProps.height;

    // 5. Calculate Scale to fit within margins
    // We use Math.min to ensure it fits both width and height-wise
    const ratio = Math.min(usableWidth / imgWidth, usableHeight / imgHeight);
    
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;

    // 6. Center the image
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;

    // 7. Add Image and Save
    pdf.addImage(dataUrl, "PNG", x, y, finalWidth, finalHeight);
    pdf.save(fileName);

  } catch (error) {
    console.error("PDF generation failed:", error);
    // Fallback error handling
    alert("Could not generate PDF. Please ensure your browser supports canvas.");
  }
}