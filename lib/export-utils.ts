/**
 * Export data to CSV file
 * @param headers - Array of column headers
 * @param rows - Array of data rows
 * @param filename - Name of the CSV file to download
 */
export function exportToCSV(
  headers: string[],
  rows: string[][],
  filename = "export.csv"
): void {
  // Create CSV content
  const csvContent = [
    headers.join(","), // Header row
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ), // Data rows with escaped quotes
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export sales history with enhanced formatting
 */
export function exportSalesReport(salesData: any[], filename?: string): void {
  const headers = [
    "Date & Time",
    "Receipt Number",
    "Items Count",
    "Total Amount",
  ];
  const rows = salesData.map((sale) => [
    sale.dateTime,
    sale.receipt,
    sale.items.toString(),
    `₹${sale.total.toFixed(2)}`,
  ]);

  exportToCSV(headers, rows, filename || `sales-report-${Date.now()}.csv`);
}
