async function main() {
  const newAdmin = "0x215e2c43Ba2B537D6025c1bB9759D84bEebe1e59"; // Rafael
  // const newAdmin = "0xbF334f8BD1420a1CbFE15407f73919424934B1B3"; // Victor
  // const newAdmin = "0x642FC634b8a0809D4d591A9A5367424E52a698C4"; // Guillermo

  try {
    console.log("Transferring ownership of ProxyAdmin...");
    // The owner of the ProxyAdmin can upgrade our contracts
    await upgrades.admin.transferProxyAdminOwnership(newAdmin);
    console.log("Transferred ownership of ProxyAdmin to:", newAdmin);
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
