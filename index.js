require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { getPermitData } = require('./permitUtils');
const generateQR = require('./generateQR');

const app = express();
app.use(bodyParser.json());

let nonceCounter = 1;

app.get('/generate-qr/:user', async (req, res) => {
  const user = req.params.user;
  const amount = "100000000"; // 100 USDT

  const { domain, types, message } = getPermitData(user, amount, nonceCounter++);
  const payload = { domain, types, primaryType: "PermitTransferFrom", message };

  const qr = await generateQR(payload);
  res.send(`<img src="${qr}" />`);
});

app.post('/receive-sig', (req, res) => {
  const data = fs.existsSync('./storage.json') ? JSON.parse(fs.readFileSync('./storage.json')) : {};
  const { user, signature, message } = req.body;

  data[user] = { signature, message };
  fs.writeFileSync('./storage.json', JSON.stringify(data, null, 2));
  res.send({ status: "signature stored" });
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
