const QRCode = require('qrcode');

module.exports = async function generateQR(payload) {
  return await QRCode.toDataURL(JSON.stringify(payload));
};
