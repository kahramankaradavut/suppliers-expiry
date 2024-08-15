const cron = require('node-cron');
const dataController = require('../controllers/dataController');
const customerController = require('../controllers/customerController');

cron.schedule('0 10 * * *', async () => { //Her gün saat 10.00 da yenilenecek
  await dataController.fetchAndStoreData();
  await customerController.updateCustomerData();
  console.log('Günlük veri çekme ve güncelleme işlemi tamamlandı.');
});