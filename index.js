const ethers = require("ethers");
const SIGNING_DOMAIN_NAME = "Voucher-Domain";
const SIGNING_DOMAIN_VERSION = "1";
const chainId = 17000;
const contractAddress = "0xaaB8199a4cd01518Ed4a493A1749F06bE6b50edd"; // Contract address
const signer = new ethers.Wallet(
  "0e30f03312c1467d9cee7c7761af525d0ccc227c6cd15496e0a3463cd954c166"
); // Your private key

const domain = {
  name: SIGNING_DOMAIN_NAME,
  version: SIGNING_DOMAIN_VERSION,
  verifyingContract: contractAddress,
  chainId,
};

async function createVoucher(tokenId, price, uri, buyer) {
  const voucher = { tokenId, price, uri, buyer };
  const types = {
    LazyNFTVoucher: [
      { name: "tokenId", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "uri", type: "string" },
      { name: "buyer", type: "address" },
    ],
  };

  // Use signTypedData in ethers v6
  const signature = await signer.signTypedData(domain, types, voucher);
  return {
    ...voucher,
    signature,
  };
}

async function main() {
  const voucher = await createVoucher(
    //Make iton backend.Token id cant be same , so change 
    29,
    50,
    "uri",
    "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"
  ); // the address is the address which receives the NFT
  console.log(
    `[${voucher.tokenId}, ${voucher.price}, "${voucher.uri}", "${voucher.buyer}", "${voucher.signature}"]`
  );
}

main();
