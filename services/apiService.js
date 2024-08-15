const fs = require('fs');
const path = require('path');

async function getDataFromAPI() {
  try {
    const filePath = path.join(__dirname, '../data/deneme.json'); // JSON dosyasının doğru yolunu kontrol edin
    const data = fs.readFileSync(filePath, 'utf8');
    console.log('Ham JSON verisi:', data);  // JSON verisini ham haliyle yazdır
    const jsonData = JSON.parse(data);
    console.log('Parse edilmiş JSON verisi:', jsonData);  // JSON verisini parse edilmiş haliyle yazdır
    return jsonData;
  } catch (error) {
    console.error('JSON dosyasından veri çekme hatası:', error);
    return [];
  }
}

module.exports = {
  getDataFromAPI,
};