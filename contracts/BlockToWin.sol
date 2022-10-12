// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "hardhat/console.sol";

/**
 * @title BlockToWin Platform
 * @author Rafael Romero (@rafius97)
 * @author Guillermo Campanudo (@capitanwesler)
 * @author Victor Hernández (@NanexZ)
 * @notice BlockToWin allows you to submit documents that can be verified
 * in IPFS
 */
contract BlockToWin is Initializable, ContextUpgradeable {
    /**
     * @dev Returns true if an account is an admin
     */
    mapping(address => bool) internal _isAdmin;

    /**
     * @dev Returns true if an account is an super admin
     */
    mapping(address => bool) internal _isSuperAdmin;

    /**
     * @dev Mapping from address to a Approval.
     * @return True if an account is approval.
     */
    struct Approval {
        string name;
        TypeOfOwner typeOfOwner;
        address user;
        bool approved;
    }

    mapping(uint256 => Approval) public approvals;

    /**
     * @dev Mapping from address to a bool.
     * @return True if an account is approval.
     */
    mapping(address => bool) public isApprovals;

    /**
     * @notice Retrieves a document given an index.
     * @return The document submitted by an approval account.
     */

    struct Document {
        address owner;
        string name;
        string promo;
        uint256 validityStart;
        uint256 validityEnd;
        string hash;
        uint256 uploadedAt;
        string explorerLink;
        string ipfsLink;
        bool isVisible;
    }

    mapping(uint256 => Document) public documents;
    mapping(uint256 => Document) public canceledDocuments;


    /**
     * @notice Retrieves the amount of documents submitted.
     * @return The counter of the documents.
     */
    uint256 public documentsCount;

    /**
     *  @notice Retrieves the amount of users.
     *  @return The counter of the users.
     */
    uint256 public approvalsCount;

    /**
     *  @notice This is the enum for the types of owner that it can be own a document.
     */
    enum TypeOfOwner {COMPANY, USER}

    modifier onlyAdmin {
        require(_isAdmin[_msgSender()], "BlockToWin: NOT_ADMIN");
        _;
    }

    modifier onlySuperAdmin {
        require(_isSuperAdmin[_msgSender()], "BlockToWin: NOT_SUPER_ADMIN");
        _;
    }

    modifier onlyApproval {
        require(isApprovals[_msgSender()], "BlockToWin: NOT_APPROVAL");
        _;
    }

    modifier notPending(address sender) {
        require(!isPending(sender), "BlockToWin: PENDING_EXISTS");
        _;
    }

    modifier notApproved(address approval) {
        require(!isApprovals[approval], "BlockToWin: APPROVAL_EXISTS");
        _;
    }

    /**
     * @dev Emitted when `superAdmin` adds a new admin.
     */
    event AdminAdded(address indexed superAdmin, address indexed newAdmin);

    /**
     * @dev Emitted when `superAdmin` revokes an admin.
     */
    event AdminRevoked(
        address indexed superAdmin,
        address indexed revokedAdmin
    );

    /**
     * @dev Emitted when `approval` is registered in order to be approved or rejected.
     */
    event Registered(address indexed approval, TypeOfOwner indexed typeOfOwner);

    /**
     * @dev Emitted when `admin` approves `approval`.
     */
    event Approved(address indexed admin, address indexed approval);

    /**
     * @dev Emitted when `admin` rejects `approval`.
     */
    event Rejected(address indexed admin, address indexed approval);

    /**
     * @dev Emitted when `approval` submits a document.
     */
    event DocumentSubmitted(
        address indexed approval,
        string name,
        string promo,
        string hash,
        uint256 uploadedAt,
        string ext
    );
    event CanceledDocument(uint256 index);
    event RevokeApproval(address admin, address approval);

    function initialize(address[] memory admins) external initializer {
        for (uint256 i; i < admins.length; i++) {
            _isAdmin[admins[i]] = true;
            _isSuperAdmin[admins[i]] = true;
        }
        __Context_init();
    }

    /**
     * @notice Adds a new admin to operate the contract
     * @param newAdmin The address of the new admin to be added
     *
     * Emits a {AdminAdded} event.
     */
    function addAdmin(address newAdmin) external onlySuperAdmin {
        require(!_isAdmin[newAdmin], "BlockToWin: ADMIN_EXISTS");
        _isAdmin[newAdmin] = true;
        emit AdminAdded(_msgSender(), newAdmin);
    }

    /**
     * @notice Adds a new admin to operate the contract
     * @param revokedAdmin The address of the admin to be revoked
     *
     * Emits a {AdminRevoked} event.
     */
    function revokeAdmin(address revokedAdmin) external onlySuperAdmin {
        require(!_isSuperAdmin[revokedAdmin], "BlockToWin: SUPER_ADMIN_ERROR");
        _isAdmin[revokedAdmin] = false;
        emit AdminRevoked(_msgSender(), revokedAdmin);
    }
 
    /**
     * @notice Registers an account in order to be approved or rejected by an admin.
     *
     * Emits a {Registered} event.
     */
    function register(TypeOfOwner typeOfOwner, string memory name)
        public
        notPending(_msgSender())
        notApproved(_msgSender())
    {
        approvals[approvalsCount].user = _msgSender();
        approvals[approvalsCount].typeOfOwner = typeOfOwner;
        approvals[approvalsCount].name = name;
        approvalsCount++;
        emit Registered(_msgSender(), typeOfOwner);
    }

    /**
     * @notice Approves a pending account for approval.
     * @param approval Address of the approval that is going to be approved
     *
     * Emits a {Approved} event.
     */
    function approve(address approval) public onlyAdmin notApproved(approval) {
        require(approval != address(0), "BlockToWin: ZERO_ADDRESS");

        for (uint256 i; i < approvalsCount; i++) {
            if (approvals[i].user == approval) {
                approvals[i].approved = true;
                isApprovals[approvals[i].user] = true;
                emit Approved(_msgSender(), approval);
                break;
            }
        }
        require(isApprovals[approval], "BlockToWin: APPROVAL_ERROR");
    }

    /**
     * @notice Rejects a pending account for approval.
     * @param approval Address of the approval that is going to be rejected.
     *
     * Emits a {Rejected} event.
     */
    function reject(address approval) public onlyAdmin notApproved(approval) {
        require(approval != address(0), "BlockToWin: ZERO_ADDRESS");

        bool success;
        for (uint256 i; i < approvalsCount; i++) {
            if (approvals[i].user == approval) {
                delete approvals[i];
                delete isApprovals[approvals[i].user];
                success = true;
                emit Rejected(_msgSender(), approval);
                break;
            }
        }
        require(success, "BlockToWin: APPROVAL_NOT_EXISTS");
    }

    /**
     * @notice Allows to an approval submits a document.
     * @param name Name of the company/user.
     * @param promo Description of the promo.
     * @param validityStart Timestamp for the validity start, in unix
     * @param validityEnd Timestampt for the validity end, in unix
     * @param hash Hash generated by the IPFS
     * @param uploadedAt Timestamp for the generated document
     * @param explorerLink Link of the document hash in the explorer
     * @param ipfsLink Link of the document hash in the IPFS
     * @param ext Extension of the document (ex: .pdf .doc .txt)
     *
     * Emits a {DocumentSubmitted} event.
     */
    function submitDocument(
        string memory name,
        string memory promo,
        uint256 validityStart,
        uint256 validityEnd,
        string memory hash,
        uint256 uploadedAt,
        string memory explorerLink,
        string memory ipfsLink,
        string memory ext,
        bool isVisible
    ) public onlyApproval {
        require(!verifyDocument(hash), "BlockToWin: HASH_EXISTS");
        documents[documentsCount] = Document({
            owner: _msgSender(),
            name: name,
            promo: promo,
            validityStart: validityStart,
            validityEnd: validityEnd,
            hash: hash,
            uploadedAt: uploadedAt,
            explorerLink: explorerLink,
            ipfsLink: ipfsLink,
            isVisible: isVisible
        });
        documentsCount += 1;
        emit DocumentSubmitted(
            _msgSender(),
            name,
            promo,
            hash,
            uploadedAt,
            ext
        );
    }

    /**
     * @notice Returns true if `account` is an approval
     */
    function isApproval(address account) external view returns (bool) {
        return isApprovals[account];
    }

    /**
     * @notice Returns true if `account` is an admin
     */
    function isAdmin(address account) external view returns (bool) {
        return _isAdmin[account];
    }

    /**
     * @notice Returns true if `account` is an admin who deploy the contract
     */
    function isSuperAdmin(address account) external view returns (bool) {
        return _isSuperAdmin[account];
    }

    /**
     * @notice Change the visibility of a document if you are the owner of that document,
     * if you aren't the owner, it's just returning false.
     */
    function changeDocumentVisibility(uint256 documentIndex) external returns (bool) {
        require(documents[documentIndex].owner == _msgSender(), "BlockToWin: NOT_OWNER_DOCUMENT");
        documents[documentIndex].isVisible = !documents[documentIndex].isVisible;
        return true;
    }

    /**
     *  @notice Removes a document at `index` in the mapping of documents
     */
    function removeDocument(uint256 index) external onlyAdmin returns (bool) {
        if (documents[index].owner != address(0)) {
            delete documents[index];
            return true;
        }
        return false;
    }
    ///@notice revoke an approval 
    function revokeApproval(address _approval) external onlyAdmin {
         require(_approval != address(0), "BlockToWin: ZERO_ADDRESS");

        bool success;
        for (uint256 i; i < approvalsCount; i++) {
            if (approvals[i].user == _approval) {
                delete approvals[i];
                delete isApprovals[approvals[i].user];
                success = true;
                emit RevokeApproval(_msgSender(), _approval);
                break;
            }
        }
        require(success, "BlockToWin: APPROVAL_NOT_EXISTS");
    }
     ///@notice cancel a document only the approval
    function cancelDocument(uint256 index)
    external
    returns (bool)
  {
    require(_isAdmin[msg.sender] || msg.sender == documents[index].owner );
    if (documents[index].owner != address(0)) {
      if (!documents[index].isVisible) {
        documents[index].isVisible = true;
      }
      canceledDocuments[index] = documents[index];
      delete documents[index];
      emit CanceledDocument(index);
      return true;
    }
    return false;
  }

    /**
     * @notice Returns true if `hash` already exist in a document
     */
    function verifyDocument(string memory hash) public view returns (bool) {
        for (uint256 i; i < documentsCount; i++) {
            if (keccak256(bytes(documents[i].hash)) == keccak256(bytes(hash))) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Returns true if `user` is pending for approval
     * @param user The address to be checked if it is pending
     */
    function isPending(address user) public view returns (bool) {
        for (uint256 i; i < approvalsCount; i++) {
            if (approvals[i].user == user && !approvals[i].approved) {
                return true;
            }
        }
        return false;
    }
}