const pool = require('../config/db');
const apiService = require('../services/apiService');

// Tarih formatını YYYY-MM-DD formatına dönüştürmek için bir fonksiyon
function convertDateFormat(dateString) {
  const [day, month, year] = dateString.split('.');
  return `${year}-${month}-${day}`;
}

// Vade gününü hesaplamak için bir fonksiyon
function calculateDaysDue(dueDate) {
  const convertedDueDate = convertDateFormat(dueDate); // Tarih formatını dönüştür
  const currentDate = new Date(); // Bugünün tarihini alıyoruz
  const due = new Date(convertedDueDate); // Vade tarihini Date nesnesine çeviriyoruz

  if (isNaN(due.getTime())) { // Eğer vade tarihi geçersizse
    console.error(`Geçersiz vade tarihi: ${dueDate}`);
    return null;
  }

  const diffTime = due - currentDate; // Vade tarihi ile bugünün tarihi arasındaki farkı hesaplıyoruz
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Farkı gün cinsinden hesaplıyoruz
  return diffDays;
}

async function fetchAndStoreData() {
  try {
    const data = await apiService.getDataFromAPI();

    // Veritabanındaki eski verileri silme
    await pool.query('DELETE FROM invoices');

    // Yeni verileri ekleme
    for (let record of data) {
      const daysDue = calculateDaysDue(record['VADE TARİHİ']); // Vade gününü hesapla

      if (daysDue !== null) { // Eğer geçerli bir gün sayısıysa, veritabanına ekle
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
            daysDue // Hesaplanan days_due değeri
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