async function main() {
  const address = "0xda8A1934a2494a68E3C439032c86A7e274138360";

  try {
    const BlockToWin = await ethers.getContractFactory("BlockToWin");
    const upgraded = await upgrades.upgradeProxy(address, BlockToWin);
    console.log("BlockToWin Upgraded:", upgraded);
  } catch (err) {
    console.log("err :>> ", err);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
