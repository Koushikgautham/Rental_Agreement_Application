// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RentalEscrow
 * @dev Smart contract for managing security deposit escrow in rental agreements
 * @author Rental Management Team
 */
contract RentalEscrow {
    // Events
    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed landlord,
        address indexed tenant,
        uint256 amount,
        uint256 releaseDate
    );
    
    event DepositReleased(
        uint256 indexed escrowId,
        address indexed recipient,
        uint256 amount,
        string reason
    );
    
    event DisputeRaised(
        uint256 indexed escrowId,
        address indexed initiator,
        string reason
    );
    
    event DisputeResolved(
        uint256 indexed escrowId,
        address indexed resolver,
        address indexed recipient,
        uint256 amount
    );

    // Escrow status enum
    enum EscrowStatus {
        ACTIVE,
        RELEASED_TO_TENANT,
        RELEASED_TO_LANDLORD,
        IN_DISPUTE,
        EXPIRED
    }

    // Escrow struct
    struct Escrow {
        uint256 id;
        address payable landlord;
        address payable tenant;
        uint256 depositAmount;
        string propertyHash;
        string agreementHash;
        uint256 releaseDate;
        EscrowStatus status;
        bool isDisputed;
        string disputeReason;
        address disputeInitiator;
        uint256 createdAt;
        uint256 releasedAt;
        address releasedTo;
        string releaseReason;
    }

    // State variables
    mapping(uint256 => Escrow) public escrows;
    mapping(address => uint256[]) public landlordEscrows;
    mapping(address => uint256[]) public tenantEscrows;
    
    uint256 public nextEscrowId;
    address public owner;
    address public disputeResolver;
    uint256 public constant DISPUTE_TIMEOUT = 30 days;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }
    
    modifier onlyDisputeResolver() {
        require(msg.sender == disputeResolver || msg.sender == owner, "Only dispute resolver can call this function");
        _;
    }
    
    modifier onlyParties(uint256 _escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        require(
            msg.sender == escrow.landlord || msg.sender == escrow.tenant,
            "Only landlord or tenant can call this function"
        );
        _;
    }
    
    modifier escrowExists(uint256 _escrowId) {
        require(escrows[_escrowId].id != 0, "Escrow does not exist");
        _;
    }
    
    modifier escrowActive(uint256 _escrowId) {
        require(escrows[_escrowId].status == EscrowStatus.ACTIVE, "Escrow is not active");
        _;
    }

    // Constructor
    constructor(address _disputeResolver) {
        owner = msg.sender;
        disputeResolver = _disputeResolver;
        nextEscrowId = 1;
    }

    /**
     * @dev Create a new escrow for security deposit
     * @param _landlord Landlord's address
     * @param _tenant Tenant's address
     * @param _propertyHash Hash of property details
     * @param _agreementHash Hash of rental agreement
     * @param _releaseDate Automatic release date (timestamp)
     */
    function createEscrow(
        address payable _landlord,
        address payable _tenant,
        string memory _propertyHash,
        string memory _agreementHash,
        uint256 _releaseDate
    ) external payable returns (uint256) {
        require(_landlord != address(0), "Invalid landlord address");
        require(_tenant != address(0), "Invalid tenant address");
        require(_landlord != _tenant, "Landlord and tenant cannot be the same");
        require(msg.value > 0, "Deposit amount must be greater than 0");
        require(_releaseDate > block.timestamp, "Release date must be in the future");
        require(bytes(_propertyHash).length > 0, "Property hash is required");
        require(bytes(_agreementHash).length > 0, "Agreement hash is required");

        uint256 escrowId = nextEscrowId++;

        escrows[escrowId] = Escrow({
            id: escrowId,
            landlord: _landlord,
            tenant: _tenant,
            depositAmount: msg.value,
            propertyHash: _propertyHash,
            agreementHash: _agreementHash,
            releaseDate: _releaseDate,
            status: EscrowStatus.ACTIVE,
            isDisputed: false,
            disputeReason: "",
            disputeInitiator: address(0),
            createdAt: block.timestamp,
            releasedAt: 0,
            releasedTo: address(0),
            releaseReason: ""
        });

        landlordEscrows[_landlord].push(escrowId);
        tenantEscrows[_tenant].push(escrowId);

        emit EscrowCreated(escrowId, _landlord, _tenant, msg.value, _releaseDate);

        return escrowId;
    }

    /**
     * @dev Release deposit to tenant (called by landlord or automatically after release date)
     * @param _escrowId Escrow ID
     * @param _reason Reason for release
     */
    function releaseToTenant(uint256 _escrowId, string memory _reason) 
        external 
        escrowExists(_escrowId) 
        escrowActive(_escrowId) 
    {
        Escrow storage escrow = escrows[_escrowId];
        
        require(
            msg.sender == escrow.landlord || 
            (block.timestamp >= escrow.releaseDate && !escrow.isDisputed),
            "Only landlord can release before due date, or auto-release after due date"
        );
        
        require(!escrow.isDisputed, "Cannot release during dispute");

        _releaseDeposit(_escrowId, escrow.tenant, _reason);
        escrow.status = EscrowStatus.RELEASED_TO_TENANT;
    }

    /**
     * @dev Release deposit to landlord (called by tenant or landlord with valid reason)
     * @param _escrowId Escrow ID
     * @param _reason Reason for release
     */
    function releaseToLandlord(uint256 _escrowId, string memory _reason) 
        external 
        escrowExists(_escrowId) 
        escrowActive(_escrowId) 
        onlyParties(_escrowId)
    {
        Escrow storage escrow = escrows[_escrowId];
        require(!escrow.isDisputed, "Cannot release during dispute");
        require(bytes(_reason).length > 0, "Reason is required for landlord release");

        _releaseDeposit(_escrowId, escrow.landlord, _reason);
        escrow.status = EscrowStatus.RELEASED_TO_LANDLORD;
    }

    /**
     * @dev Internal function to release deposit
     * @param _escrowId Escrow ID
     * @param _recipient Recipient address
     * @param _reason Reason for release
     */
    function _releaseDeposit(uint256 _escrowId, address payable _recipient, string memory _reason) internal {
        Escrow storage escrow = escrows[_escrowId];
        
        uint256 amount = escrow.depositAmount;
        escrow.depositAmount = 0;
        escrow.releasedAt = block.timestamp;
        escrow.releasedTo = _recipient;
        escrow.releaseReason = _reason;

        _recipient.transfer(amount);

        emit DepositReleased(_escrowId, _recipient, amount, _reason);
    }

    /**
     * @dev Raise a dispute for an escrow
     * @param _escrowId Escrow ID
     * @param _reason Reason for dispute
     */
    function raiseDispute(uint256 _escrowId, string memory _reason) 
        external 
        escrowExists(_escrowId) 
        escrowActive(_escrowId) 
        onlyParties(_escrowId) 
    {
        Escrow storage escrow = escrows[_escrowId];
        require(!escrow.isDisputed, "Dispute already raised");
        require(bytes(_reason).length > 0, "Dispute reason is required");

        escrow.isDisputed = true;
        escrow.disputeReason = _reason;
        escrow.disputeInitiator = msg.sender;
        escrow.status = EscrowStatus.IN_DISPUTE;

        emit DisputeRaised(_escrowId, msg.sender, _reason);
    }

    /**
     * @dev Resolve dispute (only by dispute resolver)
     * @param _escrowId Escrow ID
     * @param _recipient Address to receive the deposit
     * @param _reason Reason for resolution
     */
    function resolveDispute(uint256 _escrowId, address payable _recipient, string memory _reason) 
        external 
        escrowExists(_escrowId) 
        onlyDisputeResolver 
    {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.isDisputed, "No dispute to resolve");
        require(_recipient == escrow.landlord || _recipient == escrow.tenant, "Invalid recipient");
        require(bytes(_reason).length > 0, "Resolution reason is required");

        escrow.isDisputed = false;
        
        if (_recipient == escrow.tenant) {
            escrow.status = EscrowStatus.RELEASED_TO_TENANT;
        } else {
            escrow.status = EscrowStatus.RELEASED_TO_LANDLORD;
        }

        _releaseDeposit(_escrowId, _recipient, _reason);

        emit DisputeResolved(_escrowId, msg.sender, _recipient, escrow.depositAmount);
    }

    /**
     * @dev Get escrow details
     * @param _escrowId Escrow ID
     * @return Escrow details
     */
    function getEscrow(uint256 _escrowId) 
        external 
        view 
        escrowExists(_escrowId) 
        returns (
            uint256 id,
            address landlord,
            address tenant,
            uint256 depositAmount,
            string memory propertyHash,
            string memory agreementHash,
            uint256 releaseDate,
            EscrowStatus status,
            bool isDisputed,
            uint256 createdAt
        ) 
    {
        Escrow storage escrow = escrows[_escrowId];
        return (
            escrow.id,
            escrow.landlord,
            escrow.tenant,
            escrow.depositAmount,
            escrow.propertyHash,
            escrow.agreementHash,
            escrow.releaseDate,
            escrow.status,
            escrow.isDisputed,
            escrow.createdAt
        );
    }

    /**
     * @dev Get escrow IDs for a landlord
     * @param _landlord Landlord address
     * @return Array of escrow IDs
     */
    function getLandlordEscrows(address _landlord) external view returns (uint256[] memory) {
        return landlordEscrows[_landlord];
    }

    /**
     * @dev Get escrow IDs for a tenant
     * @param _tenant Tenant address
     * @return Array of escrow IDs
     */
    function getTenantEscrows(address _tenant) external view returns (uint256[] memory) {
        return tenantEscrows[_tenant];
    }

    /**
     * @dev Check if automatic release is due
     * @param _escrowId Escrow ID
     * @return bool indicating if auto-release is due
     */
    function isAutoReleaseDue(uint256 _escrowId) external view escrowExists(_escrowId) returns (bool) {
        Escrow storage escrow = escrows[_escrowId];
        return (
            escrow.status == EscrowStatus.ACTIVE &&
            !escrow.isDisputed &&
            block.timestamp >= escrow.releaseDate
        );
    }

    /**
     * @dev Emergency function to mark expired escrows
     * @param _escrowId Escrow ID
     */
    function markExpired(uint256 _escrowId) 
        external 
        escrowExists(_escrowId) 
        onlyOwner 
    {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.status == EscrowStatus.ACTIVE, "Escrow is not active");
        require(
            block.timestamp >= escrow.releaseDate + DISPUTE_TIMEOUT,
            "Escrow has not expired yet"
        );

        escrow.status = EscrowStatus.EXPIRED;
        
        // Auto-release to tenant after expiry
        _releaseDeposit(_escrowId, escrow.tenant, "Auto-released after expiry");
    }

    /**
     * @dev Update dispute resolver
     * @param _newResolver New dispute resolver address
     */
    function updateDisputeResolver(address _newResolver) external onlyOwner {
        require(_newResolver != address(0), "Invalid resolver address");
        disputeResolver = _newResolver;
    }

    /**
     * @dev Get contract balance
     * @return Contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Emergency withdrawal (only for unclaimed expired escrows)
     * @param _escrowId Escrow ID
     */
    function emergencyWithdraw(uint256 _escrowId) external onlyOwner escrowExists(_escrowId) {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.status == EscrowStatus.EXPIRED, "Escrow is not expired");
        require(
            block.timestamp >= escrow.releaseDate + (DISPUTE_TIMEOUT * 2),
            "Emergency withdrawal not yet available"
        );

        uint256 amount = escrow.depositAmount;
        escrow.depositAmount = 0;
        
        payable(owner).transfer(amount);
    }

    /**
     * @dev Fallback function to reject direct transfers
     */
    receive() external payable {
        revert("Direct transfers not allowed. Use createEscrow function.");
    }

    /**
     * @dev Fallback function
     */
    fallback() external payable {
        revert("Function not found");
    }
}