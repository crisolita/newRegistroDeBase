const BlockToWin = artifacts.require("BlockToWin");
const { expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const APPROVAL_ROLE =
  "0xa7b815c98465fe95fbd83842156c92c111a8223a11dd0ecef5ced0d0b7c01e41";
const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

contract(
  "BlockToWin",
  ([admin1, admin2, admin3, approval, evilApproval, notApproval, newAdmin]) => {
    let contract;

    beforeEach(async () => {
      contract = await BlockToWin.new({ from: admin1 });
      contract.initialize([admin1, admin2, admin3], { from: admin1 });
    });
 
    it("should cancel a document (only the owner and admin)", async () => {
      const tx = await contract.register(0, "Rafael Romero Corp.", {
        from: approval,
      });

      await expectEvent(tx, "Registered", {
        approval: approval,
        typeOfOwner: "0",
      });

      const tx2 = await contract.approve(approval, { from: admin1 });
      await expectEvent(tx2, "Approved", {
        admin: admin1,
        approval: approval,
      });
      const date = Date.now();

      const tx3 = await contract.submitDocument(
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
        { from: approval }
      );

      await expectEvent(tx3, "DocumentSubmitted", {
        approval: approval,
        name: "BlockToWin Company",
        promo: "Deploy Contracts For Free",
        hash: "QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
        uploadedAt: String(date),
        ext: ".pdf",
      });

      await expectRevert.unspecified(
        contract.cancelDocument(0, { from: notApproval })
      );
      const tx4 = await contract.cancelDocument(0, { from: approval });
      expect((await contract.canceledDocuments(0))[1]).to.equal(
        "BlockToWin Company"
      );

      console.log(
        "Gas Used :>> ",
        tx.receipt.gasUsed +
          tx2.receipt.gasUsed +
          tx3.receipt.gasUsed +
          tx4.receipt.gasUsed
      );
    });
    it("should register an approval (Company)", async () => {
      const tx = await contract.register(0, "Rafael Romero Corp.", {
        from: approval,
      });

      await expectEvent(tx, "Registered", {
        approval: approval,
        typeOfOwner: "0",
      });

      console.log("Gas Used :>> ", tx.receipt.gasUsed);
    });

    it("should register an approval (User)", async () => {
      const tx = await contract.register(1, "Rafael Romero", {
        from: approval,
      });

      await expectEvent(tx, "Registered", {
        approval: approval,
        typeOfOwner: "1",
      });

      console.log("Gas Used :>> ", tx.receipt.gasUsed);
    });

    it("admin should approve a pending request (Company) ", async () => {
      const tx = await contract.register(0, "Rafael Romero Corp.", {
        from: approval,
      });

      await expectEvent(tx, "Registered", {
        approval: approval,
        typeOfOwner: "0",
      });

      const tx2 = await contract.approve(approval, { from: admin1 });

      await expectEvent(tx2, "Approved", {
        admin: admin1,
        approval: approval,
      });

      console.log("Gas Used :>> ", tx.receipt.gasUsed + tx2.receipt.gasUsed);
    });

    it("admin should approve a pending request (UseAPPROVAL_ROLEr) ", async () => {
      const tx = await contract.register(1, "Rafael Romero", {
        from: approval,
      });

      await expectEvent(tx, "Registered", {
        approval: approval,
        typeOfOwner: "1",
      });

      const tx2 = await contract.approve(approval, { from: admin1 });

      await expectEvent(tx2, "Approved", {
        admin: admin1,
        approval: approval,
      });

      const isApproval = await contract.isApproval(approval);

      expect(isApproval).to.equal(true);

      console.log("Gas Used :>> ", tx.receipt.gasUsed + tx2.receipt.gasUsed);
    });

    it("admin should reject an approval", async () => {
      const tx = await contract.register(1, "Rafael Romero", {
        from: approval,
      });

      await expectEvent(tx, "Registered", {
        approval: approval,
        typeOfOwner: "1",
      });

      const tx2 = await contract.reject(approval, { from: admin1 });

      await expectEvent(tx2, "Rejected", {
        admin: admin1,
        approval: approval,
      });

      console.log("Gas Used :>> ", tx.receipt.gasUsed + tx2.receipt.gasUsed);
    });

    it("only approval should submit a document", async () => {
      const tx = await contract.register(1, "Rafael Romero", {
        from: approval,
      });

      await expectEvent(tx, "Registered", {
        approval: approval,
        typeOfOwner: "1",
      });

      const tx2 = await contract.approve(approval, { from: admin1 });

      await expectEvent(tx2, "Approved", {
        admin: admin1,
        approval: approval,
      });
      const date = Date.now();
      const tx3 = await contract.submitDocument(
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
        { from: approval }
      );

      await expectEvent(tx3, "DocumentSubmitted", {
        approval: approval,
        name: "BlockToWin Company",
        promo: "Deploy Contracts For Free",
        hash: "QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
        uploadedAt: String(date),
        ext: ".pdf",
      });

      console.log(
        "Gas Used :>> ",
        tx.receipt.gasUsed + tx2.receipt.gasUsed + tx3.receipt.gasUsed
      );
    });

    it("should fail when approval tries to approve/reject itself", async () => {
      const tx = await contract.register(1, "Rafael Romero", {
        from: approval,
      });

      await expectEvent(tx, "Registered", {
        approval: approval,
        typeOfOwner: "1",
      });

      await expectRevert(
        contract.approve(approval, { from: approval }),
        "BlockToWin: NOT_ADMIN"
      );

      await expectRevert(
        contract.reject(approval, { from: approval }),
        "BlockToWin: NOT_ADMIN"
      );
    });

    it("should fail when admin tries to approve/reject an unapproved account", async () => {
      await expectRevert(
        contract.approve(notApproval, { from: admin1 }),
        "BlockToWin: APPROVAL_ERROR"
      );

      await expectRevert(
        contract.reject(notApproval, { from: admin1 }),
        "BlockToWin: APPROVAL_NOT_EXISTS"
      );
    });

    it("should fail when not approval tries to submit a document", async () => {
      const tx = await contract.register(1, "Rafael Romero", {
        from: approval,
      });

      await expectEvent(tx, "Registered", {
        approval: approval,
        typeOfOwner: "1",
      });

      const tx2 = await contract.approve(approval, { from: admin1 });

      await expectEvent(tx2, "Approved", {
        admin: admin1,
        approval: approval,
      });

      await expectRevert.unspecified(
        contract.submitDocument(
          "BlockToWin Company",
          "Deploy Contracts For Free",
          1622116800000, // Thursday, 27 May 2021 12:00:00 PM
          1622289600000, // Saturday, 29 May 2021 12:00:00 PM
          "QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
          Date.now(),
          "https://explore.ipld.io/#/explore/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
          "https://ipfs.io/ipfs/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
          ".pdf",
          true,
          { from: notApproval }
        )
      );
    });

    it("should fail when someone tries to submit a document with the same hash", async () => {
      const tx = await contract.register(1, "Rafael Romero", {
        from: approval,
      });

      await expectEvent(tx, "Registered", {
        approval: approval,
        typeOfOwner: "1",
      });

      const tx2 = await contract.register(1, "Fernando Ramirez", {
        from: evilApproval,
      });

      await expectEvent(tx2, "Registered", {
        approval: evilApproval,
        typeOfOwner: "1",
      });

      const tx3 = await contract.approve(approval, { from: admin1 });

      await expectEvent(tx3, "Approved", {
        admin: admin1,
        approval: approval,
      });

      const tx4 = await contract.approve(evilApproval, { from: admin1 });

      await expectEvent(tx4, "Approved", {
        admin: admin1,
        approval: evilApproval,
      });

      const date = Date.now();
      const tx5 = await contract.submitDocument(
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
        { from: approval }
      );

      await expectEvent(tx5, "DocumentSubmitted", {
        approval: approval,
        name: "BlockToWin Company",
        promo: "Deploy Contracts For Free",
        hash: "QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
        uploadedAt: String(date),
        ext: ".pdf",
      });

      await expectRevert.unspecified(
        contract.submitDocument(
          "BlockToWin EvilCompany",
          "Deploy Contracts For Free",
          1622116800000, // Thursday, 27 May 2021 12:00:00 PM
          1622289600000, // Saturday, 29 May 2021 12:00:00 PM
          "QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
          Date.now(),
          "https://explore.ipld.io/#/explore/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
          "https://ipfs.io/ipfs/QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf",
          ".pdf",
          { from: evilApproval }
        )
      );
    });
  }
);
