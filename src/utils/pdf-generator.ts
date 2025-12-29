/* PDF Generation Utility for CCTV Quotations */
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface QuotationData {
  quotation_number?: string;
  customer_name: string;
  customer_mobile: string;
  customer_email?: string | null;
  installation_address: string;
  city: string;
  gst_number?: string | null;
  cctv_system_type?: string;
  notes?: string | null;
  subtotal: number;
  discount_percentage?: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
  items: {
    product_name: string;
    product_sku?: string | null;
    category_type: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}

const categoryLabels: Record<string, string> = {
  camera: 'Cameras',
  dvr: 'DVR',
  nvr: 'NVR',
  hdd: 'Hard Disks',
  power: 'Power & Backup',
  enclosure: 'Enclosures',
  display: 'Displays',
  cabling: 'Cabling & Connectors',
};

export async function generateQuotationPDF(data: QuotationData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPos = margin;

  // Colors
  const primaryColor: [number, number, number] = [26, 54, 93];
  const grayColor: [number, number, number] = [100, 100, 100];
  const lightGray: [number, number, number] = [240, 240, 240];

  // Helper function to add text
  const addText = (text: string, x: number, y: number, options?: { 
    fontSize?: number; 
    fontStyle?: 'normal' | 'bold'; 
    color?: [number, number, number];
    align?: 'left' | 'center' | 'right';
  }) => {
    pdf.setFontSize(options?.fontSize || 10);
    pdf.setFont('helvetica', options?.fontStyle || 'normal');
    pdf.setTextColor(...(options?.color || [0, 0, 0]));
    
    if (options?.align === 'right') {
      const textWidth = pdf.getTextWidth(text);
      pdf.text(text, x - textWidth, y);
    } else if (options?.align === 'center') {
      const textWidth = pdf.getTextWidth(text);
      pdf.text(text, x - textWidth / 2, y);
    } else {
      pdf.text(text, x, y);
    }
  };

  // Header
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  addText('CCTV QUOTATION', pageWidth / 2, 18, { 
    fontSize: 20, 
    fontStyle: 'bold', 
    color: [255, 255, 255],
    align: 'center'
  });
  
  if (data.quotation_number) {
    addText(data.quotation_number, pageWidth / 2, 28, { 
      fontSize: 12, 
      color: [200, 200, 200],
      align: 'center'
    });
  }

  yPos = 50;

  // System Type Badge
  if (data.cctv_system_type) {
    pdf.setFillColor(230, 230, 250);
    pdf.roundedRect(margin, yPos - 5, 40, 10, 2, 2, 'F');
    addText(data.cctv_system_type.toUpperCase(), margin + 5, yPos + 2, { 
      fontSize: 9, 
      fontStyle: 'bold',
      color: primaryColor 
    });
  }

  // Date
  addText(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - margin, yPos + 2, { 
    fontSize: 9, 
    color: grayColor,
    align: 'right'
  });
  addText(`Valid for: 30 days`, pageWidth - margin, yPos + 8, { 
    fontSize: 8, 
    color: grayColor,
    align: 'right'
  });

  yPos += 20;

  // Customer Details Section
  pdf.setFillColor(...lightGray);
  pdf.roundedRect(margin, yPos, (pageWidth - margin * 3) / 2, 40, 3, 3, 'F');
  
  addText('CUSTOMER DETAILS', margin + 5, yPos + 8, { 
    fontSize: 10, 
    fontStyle: 'bold', 
    color: primaryColor 
  });
  addText(data.customer_name, margin + 5, yPos + 18, { fontSize: 11, fontStyle: 'bold' });
  addText(`📱 ${data.customer_mobile}`, margin + 5, yPos + 26, { fontSize: 9, color: grayColor });
  if (data.customer_email) {
    addText(`✉ ${data.customer_email}`, margin + 5, yPos + 33, { fontSize: 9, color: grayColor });
  }
  if (data.gst_number) {
    addText(`GST: ${data.gst_number}`, margin + 5, yPos + (data.customer_email ? 40 : 33), { fontSize: 9, color: grayColor });
  }

  // Installation Address Section
  const rightColX = margin + (pageWidth - margin * 3) / 2 + margin;
  pdf.setFillColor(...lightGray);
  pdf.roundedRect(rightColX, yPos, (pageWidth - margin * 3) / 2, 40, 3, 3, 'F');
  
  addText('INSTALLATION ADDRESS', rightColX + 5, yPos + 8, { 
    fontSize: 10, 
    fontStyle: 'bold', 
    color: primaryColor 
  });
  
  // Wrap address text
  const maxWidth = (pageWidth - margin * 3) / 2 - 10;
  const addressLines = pdf.splitTextToSize(data.installation_address, maxWidth);
  let addressY = yPos + 18;
  addressLines.slice(0, 2).forEach((line: string) => {
    addText(line, rightColX + 5, addressY, { fontSize: 9 });
    addressY += 6;
  });
  addText(data.city, rightColX + 5, addressY, { fontSize: 10, fontStyle: 'bold' });

  yPos += 55;

  // Items Table
  const groupedItems = data.items.reduce((acc, item) => {
    if (!acc[item.category_type]) acc[item.category_type] = [];
    acc[item.category_type].push(item);
    return acc;
  }, {} as Record<string, typeof data.items>);

  Object.entries(groupedItems).forEach(([category, items]) => {
    // Check if we need a new page
    if (yPos > pageHeight - 60) {
      pdf.addPage();
      yPos = margin;
    }

    // Category Header
    addText(categoryLabels[category] || category, margin, yPos, { 
      fontSize: 11, 
      fontStyle: 'bold', 
      color: primaryColor 
    });
    yPos += 8;

    // Table Header
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, yPos - 4, pageWidth - margin * 2, 8, 'F');
    
    addText('Product', margin + 3, yPos + 1, { fontSize: 8, fontStyle: 'bold', color: [255, 255, 255] });
    addText('Qty', pageWidth - margin - 70, yPos + 1, { fontSize: 8, fontStyle: 'bold', color: [255, 255, 255] });
    addText('Unit Price', pageWidth - margin - 45, yPos + 1, { fontSize: 8, fontStyle: 'bold', color: [255, 255, 255] });
    addText('Total', pageWidth - margin - 5, yPos + 1, { fontSize: 8, fontStyle: 'bold', color: [255, 255, 255], align: 'right' });
    
    yPos += 10;

    // Table Rows
    items.forEach((item, index) => {
      if (yPos > pageHeight - 40) {
        pdf.addPage();
        yPos = margin;
      }

      if (index % 2 === 0) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(margin, yPos - 4, pageWidth - margin * 2, 10, 'F');
      }

      const productName = item.product_name.length > 45 
        ? item.product_name.substring(0, 42) + '...' 
        : item.product_name;
      
      addText(productName, margin + 3, yPos + 2, { fontSize: 9 });
      if (item.product_sku) {
        addText(`SKU: ${item.product_sku}`, margin + 3, yPos + 7, { fontSize: 7, color: grayColor });
      }
      addText(item.quantity.toString(), pageWidth - margin - 65, yPos + 2, { fontSize: 9 });
      addText(`₹${item.unit_price.toLocaleString()}`, pageWidth - margin - 40, yPos + 2, { fontSize: 9 });
      addText(`₹${item.total_price.toLocaleString()}`, pageWidth - margin - 5, yPos + 2, { fontSize: 9, fontStyle: 'bold', align: 'right' });
      
      yPos += item.product_sku ? 12 : 10;
    });

    yPos += 8;
  });

  // Totals Section
  if (yPos > pageHeight - 60) {
    pdf.addPage();
    yPos = margin;
  }

  yPos += 5;
  const totalsX = pageWidth - margin - 80;

  pdf.setDrawColor(...primaryColor);
  pdf.line(totalsX, yPos, pageWidth - margin, yPos);
  yPos += 8;

  addText('Subtotal:', totalsX, yPos, { fontSize: 10, color: grayColor });
  addText(`₹${data.subtotal.toLocaleString()}`, pageWidth - margin, yPos, { fontSize: 10, align: 'right' });
  yPos += 7;

  if (data.discount_amount && data.discount_amount > 0) {
    addText(`Discount (${data.discount_percentage || 0}%):`, totalsX, yPos, { fontSize: 10, color: grayColor });
    addText(`-₹${data.discount_amount.toLocaleString()}`, pageWidth - margin, yPos, { fontSize: 10, color: [200, 50, 50], align: 'right' });
    yPos += 7;
  }

  addText('Tax (18% GST):', totalsX, yPos, { fontSize: 10, color: grayColor });
  addText(`₹${(data.tax_amount || 0).toLocaleString()}`, pageWidth - margin, yPos, { fontSize: 10, align: 'right' });
  yPos += 10;

  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.5);
  pdf.line(totalsX, yPos, pageWidth - margin, yPos);
  yPos += 8;

  addText('GRAND TOTAL:', totalsX, yPos, { fontSize: 12, fontStyle: 'bold', color: primaryColor });
  addText(`₹${data.total_amount.toLocaleString()}`, pageWidth - margin, yPos, { fontSize: 14, fontStyle: 'bold', color: primaryColor, align: 'right' });

  // Notes Section
  if (data.notes) {
    yPos += 20;
    if (yPos > pageHeight - 40) {
      pdf.addPage();
      yPos = margin;
    }
    
    pdf.setFillColor(...lightGray);
    pdf.roundedRect(margin, yPos, pageWidth - margin * 2, 25, 3, 3, 'F');
    addText('Special Instructions', margin + 5, yPos + 8, { fontSize: 10, fontStyle: 'bold', color: primaryColor });
    
    const noteLines = pdf.splitTextToSize(data.notes, pageWidth - margin * 2 - 10);
    noteLines.slice(0, 2).forEach((line: string, index: number) => {
      addText(line, margin + 5, yPos + 16 + (index * 5), { fontSize: 9, color: grayColor });
    });
  }

  // Footer
  const footerY = pageHeight - 15;
  pdf.setDrawColor(...lightGray);
  pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  addText('This is a computer-generated quotation. Valid for 30 days from the date of issue.', pageWidth / 2, footerY, { 
    fontSize: 8, 
    color: grayColor,
    align: 'center'
  });
  addText('Thank you for your business!', pageWidth / 2, footerY + 5, { 
    fontSize: 8, 
    color: grayColor,
    align: 'center'
  });

  // Save PDF
  const fileName = data.quotation_number 
    ? `Quotation_${data.quotation_number}.pdf`
    : `Quotation_${data.customer_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  pdf.save(fileName);
}

export async function generatePDFFromElement(element: HTMLElement, fileName: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  let heightLeft = imgHeight;
  let position = 10;

  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
}
