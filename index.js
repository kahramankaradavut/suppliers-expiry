const express = require('express');
const routes = require('./routes/routes');
const cronJob = require('./cron/job');
const customerController = require('./controllers/customerController');
const dataController = require('./controllers/dataController');


const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});

cronJob; // cron u başlatmak

(async () => {
    await dataController.fetchAndStoreData();
    await customerController.updateCustomerData();
})();