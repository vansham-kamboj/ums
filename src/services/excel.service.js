import ExcelJS from 'exceljs';

/**
 * Excel Import/Export Service
 */

/**
 * Generate an Excel file from data
 * @param {Object} options - { sheetName, headers, rows }
 * @returns {Buffer} Excel buffer
 */
export const generateExcel = async ({ sheetName = 'Sheet1', headers, rows, title }) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'UMS';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName);

  // Title row
  if (title) {
    worksheet.addRow([title]);
    worksheet.mergeCells(1, 1, 1, headers.length);
    const titleRow = worksheet.getRow(1);
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: 'center' };
    worksheet.addRow([]);
  }

  // Header row
  const headerRow = worksheet.addRow(headers.map(h => typeof h === 'string' ? h : h.header));
  headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '4472C4' },
  };
  headerRow.alignment = { horizontal: 'center' };

  // Set column widths
  headers.forEach((h, i) => {
    const col = worksheet.getColumn(i + 1);
    col.width = typeof h === 'string' ? Math.max(h.length + 5, 15) : (h.width || 15);
  });

  // Data rows
  rows.forEach(row => {
    worksheet.addRow(row);
  });

  // Add borders
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  return workbook.xlsx.writeBuffer();
};

/**
 * Parse an Excel file for import
 * @param {Buffer|string} filePathOrBuffer - File path or buffer
 * @param {Object} options - { sheetName, headerRow }
 * @returns {Array<Object>} Array of row objects
 */
export const parseExcel = async (filePathOrBuffer, { sheetName, headerRow = 1 } = {}) => {
  const workbook = new ExcelJS.Workbook();

  if (typeof filePathOrBuffer === 'string') {
    await workbook.xlsx.readFile(filePathOrBuffer);
  } else {
    await workbook.xlsx.load(filePathOrBuffer);
  }

  const worksheet = sheetName
    ? workbook.getWorksheet(sheetName)
    : workbook.worksheets[0];

  if (!worksheet) {
    throw new Error('Worksheet not found');
  }

  const headers = [];
  const headerRowData = worksheet.getRow(headerRow);
  headerRowData.eachCell((cell, colNumber) => {
    headers[colNumber - 1] = String(cell.value || '').trim().toLowerCase().replace(/\s+/g, '_');
  });

  const rows = [];
  for (let i = headerRow + 1; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    const obj = {};
    let hasData = false;

    row.eachCell((cell, colNumber) => {
      const key = headers[colNumber - 1];
      if (key) {
        obj[key] = cell.value;
        if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
          hasData = true;
        }
      }
    });

    if (hasData) {
      rows.push(obj);
    }
  }

  return rows;
};
