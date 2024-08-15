const pool = require('../config/db');
const apiService = require('../services/apiService');

// Tarihi YYYY-MM-DD formatına dönüştürmek
function convertDateFormat(dateString) {
  const [day, month, year] = dateString.split('.');
  return `${year}-${month}-${day}`;
}

// Vade gününü hesaplama
function calculateDaysDue(dueDate) {
  const convertedDueDate = convertDateFormat(dueDate); 
  const currentDate = new Date(); // Bugünün tarihini
  const due = new Date(convertedDueDate);

  if (isNaN(due.getTime())) { 
    console.error(`Geçersiz vade tarihi: ${dueDate}`);
    return null;
  }

  const diffTime = due - currentDate; // Tarihler arası fark
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Farkı gün'e çevirme (milisaniye)
  return diffDays;
}

async function fetchAndStoreData() {
  try {
    const data = await apiService.getDataFromAPI();

    // Veritabanındaki eski verileri silme
    await pool.query('DELETE FROM invoices');

    // Yeni verileri ekleme
    for (let record of data) {
      const daysDue = calculateDaysDue(record['VADE TARİHİ']);

      if (daysDue !== null) {
        await pool.query(
          `INSERT INTO invoices (
            invoice_date, due_date, invoice_type, document_no, invoice_no, customer_name,
            payment_plan, invoice_total, paid_total, outstanding_balance, days_due
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            record['FATURA TARİHİ'], 
            record['VADE TARİHİ'], 
            record['FATURA TÜRÜ'], 
            record['FİŞ NO'], 
            record['FATURA NO'], 
            record['CARİ'],
            record['ÖDEME PLANI'], 
            record['FATURA TOPLAMI'], 
            record['ÖDENEN TOPLAM'], 
            record['AÇIK FATURA TOPLAMI'], 
            daysDue
          ]
        );
      } else {
        console.error('days_due değeri geçersiz, veri eklenmedi.');
      }
    }

    console.log('Veri başarıyla veritabanına kaydedildi.');
  } catch (error) {
    console.error('Veri çekme veya kaydetme hatası:', error);
  }
}

module.exports = {
  fetchAndStoreData,
};