const cron = require('node-cron');
const dataController = require('../controllers/dataController');
const customerController = require('../controllers/customerController');

cron.schedule('0 0 * * *', async () => {
  await dataController.fetchAndStoreData();
  await customerController.updateCustomerData();
  console.log('Günlük veri çekme ve güncelleme işlemi tamamlandı.');
});