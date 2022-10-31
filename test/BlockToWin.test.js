const BlockToWinV2 = artifacts.require("BlockToWinV2");
const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { ethers, expect } = require("hardhat");

contract("BlockToWinV2", ([admin1, admin2, admin3, user, approval]) => {
  let contract;

  before(async () => {
    contract = await BlockToWinV2.new({ from: admin1 });
    contract.initialize([admin1, admin2, admin3], approval, {
      from: admin1,
    });
  });
  describe("Choose 3 diferents winners", () => {
    it("Verify...", async function () {
      const ipfsHash = "bcrbjskancfhdhdhde";
      const totalPlayers = 100;
      const winnersNumbers = 6;
      const alternateNumber = 6;
      const idDocument = 1;
      const shake = await contract.shakeTheNumbers(
        ipfsHash,
        totalPlayers,
        winnersNumbers,
        alternateNumber,
        idDocument,
        { from: admin1 }
      );
      const data = await contract.seeCurrentData();
    });
  });

  it("should register an user (only the owner and admin)", async () => {
    const amountOfDocuments = ethers.utils.parseEther("1");
    await expectRevert(
      contract.registerAnUser(amountOfDocuments, user, {
        from: user,
      }),
      "Not owner"
    );
    const register = await contract.registerAnUser(amountOfDocuments, user, {
      from: admin1,
      value: ethers.utils.parseEther("1"),
    });
    const balanceTokenAfter = await contract.balanceOf(user);
    expect(balanceTokenAfter.toString()).to.equal(amountOfDocuments.toString());

    console.log("Gas Used in register user :>> ", register.receipt.gasUsed);
  });
  it("should submit the correct amount of documents", async () => {
    const date = Date.now();
    const tx = await contract.submitDocument(
      "BlockToWin Company",
      "Deploy Contracts For Free",
      1622116800000, // Thursday, 27 May 2021 12:00:00 PM
      1622289600000, // Saturday, 29 May 2021 12:00:00 PM
      "QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
      date,
      "https://explore.ipld.io/#/explore/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
      "https://ipfs.io/ipfs/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
      ".pdf",
      true,
      { from: user }
    );
    const tx2 = await contract.submitDocument(
      "BlockToWin Company",
      "Deploy Contracts For Free",
      1622116800000, // Thursday, 27 May 2021 12:00:00 PM
      1622289600000, // Saturday, 29 May 2021 12:00:00 PM
      "QmXXY5ZxbtuYj6DnfApLiGstzPN7fdddvSyigrRee3hDWPCaf",
      date,
      "https://explore.ipld.io/#/explore/QmXXY5ZxbtuYj6dddDnfApLiGstzPN7fvSyigrRee3hDWPCaf",
      "https://ipfs.io/ipfs/QmXXY5ZxbtuYj6DnfApLiGstzPN7dddfvSyigrRee3hDWPCaf",
      ".pdf",
      true,
      { from: approval }
    );
    await expectEvent(tx, "DocumentSubmitted", {
      approval: user,
      name: "BlockToWin Company",
      promo: "Deploy Contracts For Free",
      hash: "QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
      uploadedAt: String(date),
      ext: ".pdf",
    });
    await expectRevert(
      contract.submitDocument(
        "BlockToWin Company",
        "Deploy Contracts For Free",
        1622116800000, // Thursday, 27 May 2021 12:00:00 PM
        1622289600000, // Saturday, 29 May 2021 12:00:00 PM
        "QmXXY5ZxbtuYj6DnfApLiGfvSyigrRee3hDWPCaf",
        date,
        "https://explore.ipld.io/#/explore/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee",
        "https://ipfs.io/ipfs/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigDWPCaf",
        ".pdf",
        true,
        { from: user }
      ),
      "You cannot submit documents"
    );
    await expectRevert(
      contract.submitDocument(
        "BlockToWin Company",
        "Deploy Contracts For Free",
        1622116800000, // Thursday, 27 May 2021 12:00:00 PM
        1622289600000, // Saturday, 29 May 2021 12:00:00 PM
        "QmXXY5ZxbtuYj6DnfApLifredvGfvSyigrRee3hDWPCaf",
        date,
        "https://explore.ipld.io/#/explore/QmXXY5ZxbfvdftuYj6DnfApLiGstzPN7fvSyigrRee",
        "https://ipfs.io/ipfs/QmXXY5ZxbtuYj6DvffnfApLiGstzPN7fvSyigDWPCaf",
        ".pdf",
        true,
        { from: admin1 }
      ),
      "You cannot submit documents"
    );
  });
  it("should cancel only his documents", async () => {
    await expectRevert(
      contract.cancelDocument(0, { from: admin1 }),
      "You are not the owner"
    );
    const tx = await contract.cancelDocument(0, { from: user });
    expect((await contract.canceledDocuments(0))[1]).to.equal(
      "BlockToWin Company"
    );
    console.log("Gas Used in cancel a document :>> ", tx.receipt.gasUsed);
  });
});
