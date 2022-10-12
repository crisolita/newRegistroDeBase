const BlockToWin = artifacts.require("BlockToWin");
const {
  expectEvent,
  expectRevert
} = require("@openzeppelin/test-helpers");

contract("BlockToWin", ([admin, approval, notApproval]) => {
  let contract;

  beforeEach(async () => {
    contract = await BlockToWin.at('0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0');
  });

  it("should register an approval", async () => {
    const tx = await contract.register({ from: approval });

    await expectEvent(tx, "Registered", {
      approval: approval,
    });

    console.log("Gas Used :>> ", tx.receipt.gasUsed);
  });

  // it("admin should approve an approval", async () => {
  //   const tx = await contract.register({ from: approval });
  //
  //   await expectEvent(tx, "Registered", {
  //     approval: approval,
  //   });
  //
  //   const tx2 = await contract.approve(approval, { from: admin });
  //
  //   await expectEvent(tx2, "Approved", {
  //     admin: admin,
  //     approval: approval,
  //   });
  //
  //   console.log("Gas Used :>> ", tx.receipt.gasUsed + tx2.receipt.gasUsed);
  // });
  //
  // it("admin should reject an approval", async () => {
  //   const tx = await contract.register({ from: approval });
  //
  //   await expectEvent(tx, "Registered", {
  //     approval: approval,
  //   });
  //
  //   const tx2 = await contract.reject(approval, { from: admin });
  //
  //   await expectEvent(tx2, "Rejected", {
  //     admin: admin,
  //     approval: approval,
  //   });
  //
  //   console.log("Gas Used :>> ", tx.receipt.gasUsed + tx2.receipt.gasUsed);
  // });
  //
  // it("only approval should submit a document", async () => {
  //   const tx = await contract.register({ from: approval });
  //
  //   await expectEvent(tx, "Registered", {
  //     approval: approval,
  //   });
  //
  //   const tx2 = await contract.approve(approval, { from: admin });
  //
  //   await expectEvent(tx2, "Approved", {
  //     admin: admin,
  //     approval: approval,
  //   });
  //
  //   const date = Date.now();
  //   const tx3 = await contract.submitDocument(
  //     "BlockToWin Company",
  //     "Deploy Contracts For Free",
  //     1622116800000, // Thursday, 27 May 2021 12:00:00 PM
  //     1622289600000, // Saturday, 29 May 2021 12:00:00 PM
  //     "QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
  //     date,
  //     "https://explore.ipld.io/#/explore/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
  //     "https://ipfs.io/ipfs/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
  //     { from: approval }
  //   );
  //
  //   await expectEvent(tx3, "DocumentSubmitted", {
  //     approval: approval,
  //     company: "BlockToWin Company",
  //     promo: "Deploy Contracts For Free",
  //     hash: "QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
  //     uploadedAt: String(date),
  //   });
  //
  //   console.log(
  //     "Gas Used :>> ",
  //     tx.receipt.gasUsed + tx2.receipt.gasUsed + tx3.receipt.gasUsed
  //   );
  // });
  //
  // it("should fail when approval tries to approve/reject itself", async () => {
  //   await expectRevert(
  //     contract.approve(approval, { from: approval }),
  //     "Ownable: caller is not the owner"
  //   );
  //
  //   await expectRevert(
  //     contract.reject(approval, { from: approval }),
  //     "Ownable: caller is not the owner"
  //   );
  // });
  //
  // it("should fail when admin tries to approve/reject an unapproved account", async () => {
  //   await expectRevert(
  //     contract.approve(notApproval, { from: admin }),
  //     "BlockToWin: APPROVAL_ERROR"
  //   );
  //
  //   await expectRevert(
  //     contract.reject(notApproval, { from: admin }),
  //     "BlockToWin: APPROVAL_NOT_EXISTS"
  //   );
  // });
  //
  // it("should fail when not approval tries to submit a document", async () => {
  //   await expectRevert.unspecified(
  //     contract.submitDocument(
  //       "BlockToWin Company",
  //       "Deploy Contracts For Free",
  //       1622116800000, // Thursday, 27 May 2021 12:00:00 PM
  //       1622289600000, // Saturday, 29 May 2021 12:00:00 PM
  //       "QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
  //       Date.now(),
  //       "https://explore.ipld.io/#/explore/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
  //       "https://ipfs.io/ipfs/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
  //       { from: notApproval }
  //     )
  //   );
  // });
});
