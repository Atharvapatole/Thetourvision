import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';

export interface QuotationPDFData {
  quotationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  departureCity: string;
  destinationName: string;
  startDate?: string | null;
  endDate?: string | null;
  adults: number;
  children: number;
  items: Array<{
    title: string;
    description?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency?: string;
  inclusions?: string[];
  exclusions?: string[];
  terms?: string | null;
  validUntil: string;
}

export function generateQuotationPDF(data: QuotationPDFData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [10, 25, 47]; // Midnight Navy #0a192f
  const accentColor = [197, 154, 63]; // Desert Gold #c59a3f
  const grayColor = [100, 116, 139];

  // 1. Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 36, 'F');

  // Brand Name & Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('THE TOUR VISION', 16, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('BESPOKE JOURNEYS & LUXURY VACATIONS • PUNE, MAHARASHTRA', 16, 25);

  // Agency Contact Details right aligned
  doc.setFontSize(8);
  doc.setTextColor(220, 225, 235);
  doc.text(SITE_CONFIG.phone, 194, 14, { align: 'right' });
  doc.text(SITE_CONFIG.email, 194, 20, { align: 'right' });
  doc.text('Koregaon Park & FC Road, Pune', 194, 26, { align: 'right' });

  // 2. Proposal Metadata Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('CURATED TRAVEL PROPOSAL', 16, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`Proposal Ref: ${data.quotationNumber}`, 16, 54);
  doc.text(`Date of Issue: ${formatDate(new Date().toISOString())}`, 16, 59);
  doc.text(`Valid Until: ${formatDate(data.validUntil)}`, 16, 64);

  // Client Details Box (Right Column)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(110, 44, 84, 26, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Prepared Especially For:', 114, 50);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(data.customerName, 114, 56);
  doc.setFontSize(8);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`${data.customerEmail} | ${data.customerPhone}`, 114, 61);
  doc.text(`Departure: ${data.departureCity} | Travelers: ${data.adults} Adults${data.children > 0 ? `, ${data.children} Children` : ''}`, 114, 66);

  // 3. Journey Overview Card
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(16, 74, 178, 16, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`Destination: ${data.destinationName}`, 22, 81);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);
  const travelPeriod = data.startDate && data.endDate
    ? `${formatDate(data.startDate)} to ${formatDate(data.endDate)}`
    : 'Flexible Dates (Subject to confirmation)';
  doc.text(`Travel Window: ${travelPeriod}`, 22, 86);

  // 4. Line Items Table
  const tableRows = data.items.map((item, index) => [
    index + 1,
    item.title + (item.description ? `\n${item.description}` : ''),
    item.quantity,
    formatCurrency(item.unitPrice, data.currency || 'INR'),
    formatCurrency(item.totalPrice, data.currency || 'INR'),
  ]);

  autoTable(doc, {
    startY: 96,
    head: [['#', 'Itemized Experiences, Stays & Inclusions', 'Qty', 'Unit Rate', 'Amount']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [10, 25, 47],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 28, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
    margin: { left: 16, right: 16 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;

  // 5. Pricing Summary Box
  const summaryX = 120;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);

  doc.text('Subtotal:', summaryX, finalY);
  doc.text(formatCurrency(data.subtotal, data.currency), 194, finalY, { align: 'right' });

  if (data.discountAmount > 0) {
    doc.text('Privilege Discount:', summaryX, finalY + 5);
    doc.text(`- ${formatCurrency(data.discountAmount, data.currency)}`, 194, finalY + 5, { align: 'right' });
  }

  doc.text(`GST / Taxes (${data.taxRate}%):`, summaryX, finalY + 10);
  doc.text(formatCurrency(data.taxAmount, data.currency), 194, finalY + 10, { align: 'right' });

  // Total Highlight Bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(summaryX - 2, finalY + 14, 76, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL PROPOSAL:', summaryX + 2, finalY + 20.5);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(formatCurrency(data.totalAmount, data.currency), 192, finalY + 20.5, { align: 'right' });

  // 6. Terms & Inclusions (Left Column)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Included in this Itinerary:', 16, finalY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(75, 85, 99);

  let inclusionY = finalY + 5;
  const defaultInclusions = data.inclusions && data.inclusions.length > 0
    ? data.inclusions
    : [
        'Accommodation in hand-picked luxury 4-Star / 5-Star properties',
        'Daily buffet breakfast and curated specialty dinners',
        'Private chauffeured air-conditioned vehicle throughout the journey',
        'Sightseeing entry vouchers & verified travel guides',
      ];

  defaultInclusions.slice(0, 4).forEach((inc) => {
    doc.text(`• ${inc}`, 16, inclusionY);
    inclusionY += 4.5;
  });

  // Footer notes
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(140, 150, 165);
  doc.text(
    'Note: This quotation is an estimate tailored for your party and is valid for 7 days. Hotel rooms and private fleet are subject to final seasonal verification at the time of deposit confirmation.',
    16,
    278
  );

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('The Tour Vision • Pune, Maharashtra, India • +91 98220 12345 • concierge@thetourvision.com', 105, 285, {
    align: 'center',
  });

  return doc;
}
