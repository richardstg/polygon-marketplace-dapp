const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log("marketplace deployed to:", marketplace.address);

  fs.writeFileSync(
    "./src/config.js",
    `export const marketplaceAddress = "${marketplace.address}"`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
