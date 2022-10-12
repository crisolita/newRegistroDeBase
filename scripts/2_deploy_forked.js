async function main() {
  const admins = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" // First address of the Node Hardhat
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