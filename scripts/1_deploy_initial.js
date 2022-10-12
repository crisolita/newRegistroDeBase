async function main() {
  const admins = [
    "0xD0770cd9e837fD402Ba040ff9b6D2600af7958A5", // Carlos
    "0xE704bD0F83b68f5D0b8FF64945741266f1E7Df9b", // Carlos
    "0x642FC634b8a0809D4d591A9A5367424E52a698C4" // Guillermo
  ];
  const BlockToWin = await ethers.getContractFactory("BlockToWin");
  console.log("Deploying BlockToWin...");
  const instance = await upgrades.deployProxy(BlockToWin, [admins]);
  console.log("BlockToWin deployed to:", instance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
