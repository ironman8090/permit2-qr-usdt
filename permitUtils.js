const USDT = "0x55d398326f99059fF775485246999027B3197955";
const PERMIT2 = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

module.exports = {
  getPermitData: (userAddress, amount, nonce) => {
    const deadline = Math.floor(Date.now() / 1000) + 600;

    const message = {
      permitted: {
        token: USDT,
        amount: amount.toString()
      },
      spender: process.env.WALLET_ADDRESS,
      nonce,
      deadline
    };

    const domain = {
      name: "Permit2",
      chainId: parseInt(process.env.CHAIN_ID),
      verifyingContract: PERMIT2
    };

    const types = {
      PermitTransferFrom: [
        { name: "permitted", type: "TokenPermissions" },
        { name: "spender", type: "address" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" }
      ],
      TokenPermissions: [
        { name: "token", type: "address" },
        { name: "amount", type: "uint256" }
      ]
    };

    return { domain, types, message };
  },
  PERMIT2,
  USDT
};
