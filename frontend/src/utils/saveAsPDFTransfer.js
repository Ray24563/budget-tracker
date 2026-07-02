import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DateFormatter, DateFormatterSelector } from "./DateFormatter";

export const saveAsPDFTransfer = (transferData, selectedMonth) => {

  const doc = new jsPDF();

  const filteredData = selectedMonth === "all"
    ? transferData
    : transferData.filter((item) => {
        const itemMonth = item.date.slice(0, 7);
        return itemMonth === selectedMonth;
      });
  
  const totalExpenses = filteredData.reduce((sum, item) => sum + item.amount, 0);

  // ─── Title ───────────────────────────────────────────
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.setFont(undefined, 'bold'),
  doc.text("Money Transfer Summary", 14, 30);
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
    head: [["Date", "Category", "From", "To", "Amount"]],
    body: filteredData.map((item) => [
      DateFormatter(item.date),
      item.description,
      item.from_savings,
      item.to_savings,
      `+ P ${item.amount.toLocaleString()}`
    ]),
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
      4: { fontStyle : "bold" } 
    }
  });  

  const filename = selectedMonth === "all"
    ? "All-Time MoneyTransfer Summary.pdf"
    : `${DateFormatterSelector(selectedMonth)} Money Transfer Summary.pdf`;

  doc.save(filename);
};