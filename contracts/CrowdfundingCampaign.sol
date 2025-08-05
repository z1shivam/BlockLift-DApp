pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract CrowdfundingCampaign is ReentrancyGuard, Ownable, Pausable {
    struct Campaign {
        address payable creator;
        string title;
        string description;
        string imageHash; // IPFS hash for decentralized storage
        string category;
        uint256 goal;
        uint256 deadline;
        uint256 totalRaised;
        uint256 createdAt;
        bool goalReached;
        bool fundsWithdrawn;
        bool isActive;
        mapping(address => uint256) contributions;
        address[] contributors;
    }
    
    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCounter;
    
    // Platform settings
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 250; // 2.5% in basis points
    uint256 public constant MAX_CAMPAIGN_DURATION = 365 days;
    uint256 public constant MIN_CAMPAIGN_DURATION = 1 days;
    uint256 public constant MIN_GOAL = 0.01 ether;
    uint256 public constant MAX_GOAL = 1000 ether;
    
    // Platform fee collection
    address public feeCollector;
    uint256 public totalFeesCollected;
    
    // Events with comprehensive logging
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 goal,
        uint256 deadline,
        string category,
        uint256 timestamp
    );
    
    event ContributionMade(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount,
        uint256 newTotal,
        uint256 timestamp
    );
    
    event GoalReached(
        uint256 indexed campaignId,
        uint256 totalRaised,
        uint256 timestamp
    );
    
    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount,
        uint256 platformFee,
        uint256 timestamp
    );
    
    event RefundClaimed(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount,
        uint256 timestamp
    );
    
    event CampaignCancelled(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 timestamp
    );
    
    event EmergencyWithdrawal(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount,
        string reason
    );
    
    // Custom errors for gas efficiency
    error InvalidCampaignId();
    error CampaignNotActive();
    error DeadlinePassed();
    error DeadlineNotPassed();
    error UnauthorizedAccess();
    error InvalidAmount();
    error GoalNotReached();
    error GoalAlreadyReached();
    error FundsAlreadyWithdrawn();
    error NoContributionFound();
    error InvalidCampaignParameters();
    error CampaignDurationInvalid();
    error RefundNotAvailable();
    
    constructor(address _feeCollector) Ownable(msg.sender) {
        require(_feeCollector != address(0), "Invalid fee collector address");
        feeCollector = _feeCollector;
    }
    
    modifier validCampaignId(uint256 _campaignId) {
        if (_campaignId >= campaignCounter) revert InvalidCampaignId();
        _;
    }
    
    modifier onlyCampaignCreator(uint256 _campaignId) {
        if (campaigns[_campaignId].creator != msg.sender) revert UnauthorizedAccess();
        _;
    }
    
    modifier campaignActive(uint256 _campaignId) {
        if (!campaigns[_campaignId].isActive) revert CampaignNotActive();
        _;
    }
    
    modifier beforeDeadline(uint256 _campaignId) {
        if (block.timestamp > campaigns[_campaignId].deadline) revert DeadlinePassed();
        _;
    }
    
    modifier afterDeadline(uint256 _campaignId) {
        if (block.timestamp <= campaigns[_campaignId].deadline) revert DeadlineNotPassed();
        _;
    }
    
    
    /**
     * @dev Create a new crowdfunding campaign
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _imageHash IPFS hash for campaign image
     * @param _category Campaign category
     * @param _goal Funding goal in wei
     * @param _durationInDays Campaign duration in days
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _imageHash,
        string memory _category,
        uint256 _goal,
        uint256 _durationInDays
    ) external whenNotPaused returns (uint256) {
        // Validate inputs
        if (bytes(_title).length == 0 || bytes(_title).length > 100) revert InvalidCampaignParameters();
        if (bytes(_description).length < 50 || bytes(_description).length > 1000) revert InvalidCampaignParameters();
        if (_goal < MIN_GOAL || _goal > MAX_GOAL) revert InvalidCampaignParameters();
        if (_durationInDays < MIN_CAMPAIGN_DURATION / 1 days || 
            _durationInDays > MAX_CAMPAIGN_DURATION / 1 days) revert CampaignDurationInvalid();
        
        uint256 campaignId = campaignCounter++;
        Campaign storage newCampaign = campaigns[campaignId];
        
        newCampaign.creator = payable(msg.sender);
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.imageHash = _imageHash;
        newCampaign.category = _category;
        newCampaign.goal = _goal;
        newCampaign.deadline = block.timestamp + (_durationInDays * 1 days);
        newCampaign.createdAt = block.timestamp;
        newCampaign.totalRaised = 0;
        newCampaign.goalReached = false;
        newCampaign.fundsWithdrawn = false;
        newCampaign.isActive = true;
        
        emit CampaignCreated(
            campaignId,
            msg.sender,
            _title,
            _goal,
            newCampaign.deadline,
            _category,
            block.timestamp
        );
        
        return campaignId;
    }
    
    
    /**
     * @dev Contribute to a campaign
     * @param _campaignId ID of the campaign to contribute to
     */
    function contribute(uint256 _campaignId) 
        external 
        payable 
        nonReentrant
        whenNotPaused
        validCampaignId(_campaignId) 
        campaignActive(_campaignId)
        beforeDeadline(_campaignId) 
    {
        if (msg.value == 0) revert InvalidAmount();
        
        Campaign storage campaign = campaigns[_campaignId];
        
        // Prevent creator from contributing to their own campaign
        if (msg.sender == campaign.creator) revert UnauthorizedAccess();
        
        // Check if this would exceed the goal (optional limit)
        if (campaign.totalRaised + msg.value > campaign.goal * 150 / 100) {
            revert InvalidAmount(); // Prevent more than 150% of goal
        }
        
        // Track new contributors
        if (campaign.contributions[msg.sender] == 0) {
            campaign.contributors.push(msg.sender);
        }
        
        campaign.contributions[msg.sender] += msg.value;
        campaign.totalRaised += msg.value;
        
        emit ContributionMade(
            _campaignId,
            msg.sender,
            msg.value,
            campaign.totalRaised,
            block.timestamp
        );
        
        // Check if goal is reached
        if (!campaign.goalReached && campaign.totalRaised >= campaign.goal) {
            campaign.goalReached = true;
            emit GoalReached(_campaignId, campaign.totalRaised, block.timestamp);
        }
    }
    
    
    /**
     * @dev Withdraw funds (only if goal reached and deadline passed or goal reached)
     * @param _campaignId Campaign ID to withdraw from
     */
    function withdrawFunds(uint256 _campaignId) 
        external 
        nonReentrant
        validCampaignId(_campaignId) 
        onlyCampaignCreator(_campaignId) 
    {
        Campaign storage campaign = campaigns[_campaignId];
        
        if (!campaign.goalReached) revert GoalNotReached();
        if (campaign.fundsWithdrawn) revert FundsAlreadyWithdrawn();
        if (campaign.totalRaised == 0) revert InvalidAmount();
        
        campaign.fundsWithdrawn = true;
        campaign.isActive = false;
        
        uint256 totalAmount = campaign.totalRaised;
        uint256 platformFee = (totalAmount * PLATFORM_FEE_PERCENTAGE) / 10000;
        uint256 creatorAmount = totalAmount - platformFee;
        
        totalFeesCollected += platformFee;
        
        emit FundsWithdrawn(
            _campaignId,
            msg.sender,
            creatorAmount,
            platformFee,
            block.timestamp
        );
        
        // Transfer fee to platform
        if (platformFee > 0) {
            (bool feeSuccess, ) = feeCollector.call{value: platformFee}("");
            require(feeSuccess, "Fee transfer failed");
        }
        
        // Transfer remaining amount to creator
        (bool success, ) = campaign.creator.call{value: creatorAmount}("");
        require(success, "Transfer to creator failed");
    }
    
    
    /**
     * @dev Claim refund if goal not reached after deadline
     * @param _campaignId Campaign ID to claim refund from
     */
    function claimRefund(uint256 _campaignId) 
        external 
        nonReentrant
        validCampaignId(_campaignId) 
        afterDeadline(_campaignId) 
    {
        Campaign storage campaign = campaigns[_campaignId];
        
        if (campaign.goalReached) revert RefundNotAvailable();
        if (campaign.fundsWithdrawn) revert FundsAlreadyWithdrawn();
        
        uint256 contributedAmount = campaign.contributions[msg.sender];
        if (contributedAmount == 0) revert NoContributionFound();
        
        campaign.contributions[msg.sender] = 0;
        campaign.totalRaised -= contributedAmount;
        
        emit RefundClaimed(
            _campaignId,
            msg.sender,
            contributedAmount,
            block.timestamp
        );
        
        (bool success, ) = payable(msg.sender).call{value: contributedAmount}("");
        require(success, "Refund transfer failed");
    }
    
    /**
     * @dev Cancel campaign (only creator, only if no contributions)
     * @param _campaignId Campaign ID to cancel
     */
    function cancelCampaign(uint256 _campaignId)
        external
        validCampaignId(_campaignId)
        onlyCampaignCreator(_campaignId)
        campaignActive(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        
        if (campaign.totalRaised > 0) revert InvalidAmount();
        
        campaign.isActive = false;
        
        emit CampaignCancelled(_campaignId, msg.sender, block.timestamp);
    }
    
    
    // ===== VIEW FUNCTIONS =====
    
    /**
     * @dev Get comprehensive campaign details
     */
    function getCampaignDetails(uint256 _campaignId) 
        external 
        view 
        validCampaignId(_campaignId) 
        returns (
            address creator,
            string memory title,
            string memory description,
            string memory imageHash,
            string memory category,
            uint256 goal,
            uint256 deadline,
            uint256 totalRaised,
            uint256 createdAt,
            bool goalReached,
            bool fundsWithdrawn,
            bool isActive,
            uint256 contributorCount
        ) 
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.title,
            campaign.description,
            campaign.imageHash,
            campaign.category,
            campaign.goal,
            campaign.deadline,
            campaign.totalRaised,
            campaign.createdAt,
            campaign.goalReached,
            campaign.fundsWithdrawn,
            campaign.isActive,
            campaign.contributors.length
        );
    }
    
    /**
     * @dev Get user's contribution to a specific campaign
     */
    function getContribution(uint256 _campaignId, address _contributor) 
        external 
        view 
        validCampaignId(_campaignId) 
        returns (uint256) 
    {
        return campaigns[_campaignId].contributions[_contributor];
    }
    
    /**
     * @dev Get all contributors for a campaign
     */
    function getContributors(uint256 _campaignId) 
        external 
        view 
        validCampaignId(_campaignId) 
        returns (address[] memory) 
    {
        return campaigns[_campaignId].contributors;
    }
    
    /**
     * @dev Check if campaign goal is reached
     */
    function isGoalReached(uint256 _campaignId) 
        external 
        view 
        validCampaignId(_campaignId) 
        returns (bool) 
    {
        return campaigns[_campaignId].goalReached;
    }
    
    /**
     * @dev Check if user can claim refund
     */
    function canClaimRefund(uint256 _campaignId, address _contributor) 
        external 
        view 
        validCampaignId(_campaignId) 
        returns (bool) 
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            block.timestamp > campaign.deadline &&
            !campaign.goalReached &&
            !campaign.fundsWithdrawn &&
            campaign.contributions[_contributor] > 0
        );
    }
    
    /**
     * @dev Get campaign statistics
     */
    function getCampaignStats(uint256 _campaignId)
        external
        view
        validCampaignId(_campaignId)
        returns (
            uint256 percentageFunded,
            uint256 timeLeft,
            uint256 contributorCount,
            bool isExpired
        )
    {
        Campaign storage campaign = campaigns[_campaignId];
        
        percentageFunded = campaign.goal > 0 ? (campaign.totalRaised * 100) / campaign.goal : 0;
        timeLeft = block.timestamp < campaign.deadline ? campaign.deadline - block.timestamp : 0;
        contributorCount = campaign.contributors.length;
        isExpired = block.timestamp > campaign.deadline;
        
        return (percentageFunded, timeLeft, contributorCount, isExpired);
    }
    
    /**
     * @dev Get platform statistics
     */
    function getPlatformStats()
        external
        view
        returns (
            uint256 totalCampaigns,
            uint256 totalFundsRaised,
            uint256 successfulCampaigns,
            uint256 totalContributors,
            uint256 platformFeesCollected
        )
    {
        totalCampaigns = campaignCounter;
        platformFeesCollected = totalFeesCollected;
        
        // Calculate other stats
        uint256 allTimeFundsRaised = 0;
        uint256 successful = 0;
        address[] memory uniqueContributors = new address[](0);
        
        for (uint256 i = 0; i < campaignCounter; i++) {
            Campaign storage campaign = campaigns[i];
            allTimeFundsRaised += campaign.totalRaised;
            
            if (campaign.goalReached) {
                successful++;
            }
            
            // Note: This is a simplified count, real implementation might use a set
            for (uint256 j = 0; j < campaign.contributors.length; j++) {
                // Add unique contributor counting logic here if needed
            }
        }
        
        return (totalCampaigns, allTimeFundsRaised, successful, uniqueContributors.length, platformFeesCollected);
    }
    
    // ===== ADMIN FUNCTIONS =====
    
    /**
     * @dev Emergency pause function (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause function (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Update fee collector address (only owner)
     */
    function updateFeeCollector(address _newFeeCollector) external onlyOwner {
        require(_newFeeCollector != address(0), "Invalid address");
        feeCollector = _newFeeCollector;
    }
    
    /**
     * @dev Emergency withdrawal function (only in extreme cases)
     */
    function emergencyWithdraw(uint256 _campaignId, string memory _reason) 
        external 
        onlyOwner 
        validCampaignId(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.totalRaised > 0, "No funds to withdraw");
        
        uint256 amount = campaign.totalRaised;
        campaign.totalRaised = 0;
        campaign.isActive = false;
        
        emit EmergencyWithdrawal(_campaignId, campaign.creator, amount, _reason);
        
        (bool success, ) = campaign.creator.call{value: amount}("");
        require(success, "Emergency withdrawal failed");
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Fallback function to receive ETH
     */
    receive() external payable {
        revert("Direct payments not allowed");
    }
    
    /**
     * @dev Fallback function
     */
    fallback() external payable {
        revert("Function not found");
    }
}
