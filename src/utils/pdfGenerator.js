import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateRentReceipt = (tenant) => {
  try {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('en-IN');
    const receiptNo = `PG-${Math.floor(1000 + Math.random() * 9000)}`;

    // Header - Brand Identity
    doc.setFillColor(139, 21, 56); // Primary Burgundy
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PG ADMIN MANAGER", 20, 25);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Official Rent Receipt", 20, 32);

    // Receipt Info
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text(`Receipt No: ${receiptNo}`, 140, 55);
    doc.text(`Date: ${date}`, 140, 62);

    // Tenant Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 20, 75);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Tenant Name: ${tenant.name}`, 20, 85);
    doc.text(`Phone: +91 ${tenant.phone}`, 20, 92);
    doc.text(`Due Date: ${tenant.dueDate}`, 20, 99);

    // Payment Table using the functional approach
    autoTable(doc, {
      startY: 110,
      head: [['Description', 'Amount (INR)']],
      body: [
        ['Monthly PG Rent', `INR ${tenant.rent.toLocaleString()}`],
        ['Maintenance & Utilities', 'Included'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [139, 21, 56] },
      styles: { fontSize: 11 }
    });

    // Total Section
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 150;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`TOTAL PAID: INR ${tenant.rent.toLocaleString()}`, 130, finalY);

    // Footer & Signature
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for staying with us!", 20, finalY + 30);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(140, finalY + 45, 190, finalY + 45);
    doc.text("Authorized Signature", 145, finalY + 50);

    // Terms
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Note: This is a computer-generated receipt and does not require a physical signature.", 20, 280);

    // Save
    doc.save(`Receipt_${tenant.name.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Could not generate PDF. Please check connection.");
  }
};
