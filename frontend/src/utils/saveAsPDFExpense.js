import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DateFormatter, DateFormatterSelector } from "./DateFormatter";

export const saveAsPDFExpense = (expenseList, selectedMonth) => {

  const doc = new jsPDF();

  const filteredData = selectedMonth === "all"
    ? expenseList
    : expenseList.filter((item) => {
        const itemMonth = item.date.slice(0, 7);
        return itemMonth === selectedMonth;
      });
  
  const totalExpenses = filteredData.reduce((sum, item) => sum + item.amount, 0);

  // ─── Title ───────────────────────────────────────────
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.setFont(undefined, 'bold'),
  doc.text("Expenses Summary", 14, 30);
  doc.text(`P ${totalExpenses.toLocaleString()}`, 170, 30);
  doc.setFont(undefined, 'normal'),

  // ─── Subtitle ────────────────────────────────────────
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(
    selectedMonth === "all"
      ? "All Time"
      : `Month: ${DateFormatterSelector(selectedMonth)}`,
    14,
    38
  );

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {month: 'long', day:'numeric', year:'numeric'})}`, 14, 45);

  autoTable(doc, {
    startY: 52,
    head: [["Date", "Category", "Source", "Savings", "Amount"]],
    body: filteredData.map((item) => [
      DateFormatter(item.date),
      item.category,
      item.source,
      item.savings,
      `- P ${item.amount.toLocaleString()}`
    ]),
    headStyles: {
      fillColor: [38, 29, 82],   // your dark purple
      textColor: [226, 217, 243], // your light purple text
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: [245, 243, 255]
    },
    styles: {
      fontSize: 10,
      cellPadding: 4
    },
    columnStyles: {
      4: { fontStyle : "bold" } 
    }
  });  

  const finalY = doc.lastAutoTable.finalY + 8;

  const savingsOptions = [
    "Main Wallet",
    "Secondary Wallet",
    "Maya Wallet",
    "Maya Savings",
    "BPI",
    "GoTyme"
  ];

  // Calculate total per savings
  const savingsSummary = savingsOptions.map((savings) => {
    const total = filteredData
      .filter((item) => item.savings === savings)
      .reduce((sum, item) => sum + item.amount, 0);
    return [savings, `P${total.toLocaleString()}`];
  });

  // Summary table
  doc.setFontSize(13);
  doc.setTextColor(40, 40, 40);
  doc.setFont(undefined, 'bold');
  doc.text("Summary Per Savings", 14, finalY + 10);
  doc.setFont(undefined, 'normal');

  autoTable(doc, {
    startY: finalY + 16,
    head: [["Savings", "Total Expenses"]],
    body: savingsSummary,
    headStyles: {
      fillColor: [38, 29, 82],
      textColor: [226, 217, 243],
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: [245, 243, 255]
    },
    styles: {
      fontSize: 10,
      cellPadding: 4
    },
    columnStyles: {
      1: { fontStyle: "bold" }
    }
  });

  const filename = selectedMonth === "all"
    ? "All-Time Expenses Summary.pdf"
    : `${DateFormatterSelector(selectedMonth)} Expenses Summary.pdf`;

  doc.save(filename);
};