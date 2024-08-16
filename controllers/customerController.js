const pool = require('../config/db');

async function updateCustomerData() {
  try {
    // invoices tablosundaki verileri topla
    const customersData = await pool.query(`
      SELECT customer_name,
             SUM(invoice_total) as total_debt,
             SUM(paid_total) as total_paid,
             SUM(outstanding_balance) as outstanding_total,
             SUM(CASE WHEN days_due BETWEEN 0 AND 6 THEN outstanding_balance ELSE 0 END) as due_0_6,
             SUM(CASE WHEN days_due BETWEEN 7 AND 30 THEN outstanding_balance ELSE 0 END) as due_7_30,
             SUM(CASE WHEN days_due BETWEEN 31 AND 60 THEN outstanding_balance ELSE 0 END) as due_31_60,
             SUM(CASE WHEN days_due BETWEEN 61 AND 90 THEN outstanding_balance ELSE 0 END) as due_61_90,
             SUM(CASE WHEN days_due BETWEEN 91 AND 120 THEN outstanding_balance ELSE 0 END) as due_91_120,
             SUM(CASE WHEN days_due > 120 THEN outstanding_balance ELSE 0 END) as due_120_plus
      FROM invoices
      GROUP BY customer_name
    `);

    // Verileri customers tablosuna ekle/güncelle
    for (let customer of customersData.rows) {
      await pool.query(
        `INSERT INTO customers (name, total_debt, total_paid, outstanding_total, due_0_6, due_7_30, due_31_60, due_61_90, due_91_120, due_120_plus)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (name) DO UPDATE 
         SET total_debt = EXCLUDED.total_debt,
             total_paid = EXCLUDED.total_paid,
             outstanding_total = EXCLUDED.outstanding_total,
             due_0_6 = EXCLUDED.due_0_6,
             due_7_30 = EXCLUDED.due_7_30,
             due_31_60 = EXCLUDED.due_31_60,
             due_61_90 = EXCLUDED.due_61_90,
             due_91_120 = EXCLUDED.due_91_120,
             due_120_plus = EXCLUDED.due_120_plus`,
        [
          customer.customer_name, 
          customer.total_debt, 
          customer.total_paid, 
          customer.outstanding_total,
          customer.due_0_6,
          customer.due_7_30,
          customer.due_31_60,
          customer.due_61_90,
          customer.due_91_120,
          customer.due_120_plus
        ]
      );
    }

    console.log('Cariler tablosu başarıyla güncellendi.');
  } catch (error) {
    console.error('Cariler tablosunu güncelleme hatası:', error);
  }
}

module.exports = {
  updateCustomerData,
};
