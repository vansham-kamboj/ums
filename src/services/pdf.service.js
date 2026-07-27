import PDFDocument from 'pdfkit';

/**
 * PDF Generation Service
 */

/**
 * Generate a simple PDF document
 * @param {Object} options - { title, content, headers, rows }
 * @returns {Buffer} PDF buffer
 */
export const generatePdf = (options) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Title
      if (options.title) {
        doc.fontSize(20).font('Helvetica-Bold').text(options.title, { align: 'center' });
        doc.moveDown();
      }

      // Subtitle
      if (options.subtitle) {
        doc.fontSize(12).font('Helvetica').text(options.subtitle, { align: 'center' });
        doc.moveDown();
      }

      // Content
      if (options.content) {
        doc.fontSize(11).font('Helvetica').text(options.content);
        doc.moveDown();
      }

      // Table
      if (options.headers && options.rows) {
        const tableTop = doc.y;
        const colWidth = (doc.page.width - 100) / options.headers.length;

        // Draw headers
        doc.font('Helvetica-Bold').fontSize(10);
        options.headers.forEach((header, i) => {
          doc.text(header, 50 + i * colWidth, tableTop, {
            width: colWidth,
            align: 'left',
          });
        });

        doc.moveTo(50, tableTop + 15).lineTo(doc.page.width - 50, tableTop + 15).stroke();

        // Draw rows
        doc.font('Helvetica').fontSize(9);
        let y = tableTop + 25;

        options.rows.forEach(row => {
          if (y > doc.page.height - 100) {
            doc.addPage();
            y = 50;
          }

          row.forEach((cell, i) => {
            doc.text(String(cell || ''), 50 + i * colWidth, y, {
              width: colWidth,
              align: 'left',
            });
          });
          y += 20;
        });
      }

      // Footer
      if (options.footer) {
        doc.fontSize(8).text(options.footer, 50, doc.page.height - 50, { align: 'center' });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate a fee receipt PDF
 */
export const generateFeeReceipt = async (payment, student, team) => {
  return generatePdf({
    title: team?.name || 'Institute',
    subtitle: 'Fee Receipt',
    content: [
      `Receipt No: ${payment.receiptNumber}`,
      `Date: ${new Date(payment.paymentDate).toLocaleDateString()}`,
      `Student: ${student.firstName} ${student.lastName || ''}`,
      `Admission No: ${student.admissionNumber}`,
      `Amount: ${payment.amount}`,
      `Payment Method: ${payment.paymentMethod}`,
    ].join('\n'),
    headers: ['Fee Head', 'Amount'],
    rows: (payment.records || []).map(r => [r.feeHeadName, r.amount]),
    footer: 'This is a computer generated receipt.',
  });
};
