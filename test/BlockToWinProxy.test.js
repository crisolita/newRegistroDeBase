const { assert, upgrades, ethers } = require("hardhat");

contract("BlockToWin (Proxy)", ([admin1, admin2, admin3]) => {
  let blockToWin, adminSigner, proxyAdmin;

  beforeEach(async () => {
    adminSigner = await ethers.getSigner(admin1);
    blockToWin = await ethers.getContractFactory("BlockToWin", adminSigner);
    instance = await upgrades.deployProxy(blockToWin, [[admin1, admin2, admin3]]);
    proxyAdmin = await upgrades.admin.getInstance();
  });

  it("contract should initialize", async () => {
    assert.ok(await instance.isAdmin(admin1));
    assert.ok(await instance.isAdmin(admin2));
    assert.ok(await instance.isAdmin(admin3));
  });

  it("proxy admin should be the admin signer", async () => {
    assert.equal(admin1, await proxyAdmin.owner());
  });
});