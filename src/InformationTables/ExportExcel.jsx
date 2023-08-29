import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default function ExportExcel({ data, filename }) {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `${filename}.xlsx`);
  };

  return (
    <button onClick={exportToExcel}>
      ייצא לאקסל
    </button>
  );
}
