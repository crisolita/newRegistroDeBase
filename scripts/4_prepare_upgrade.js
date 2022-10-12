async function main() {
  let proxyAddress = "0xda8A1934a2494a68E3C439032c86A7e274138360";

  try {
    const BlockToWin = await ethers.getContractFactory("BlockToWin");
    console.log("Preparing upgrade...");
    const BlockToWinAddress = await upgrades.prepareUpgrade(
      proxyAddress,
      BlockToWin
    );
    console.log("BlockToWin upgraded to: ", BlockToWinAddress);
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
