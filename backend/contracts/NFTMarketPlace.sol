// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract NFTMarketPlace {
    address public owner;
    uint256 public totalSupply;
    uint256 public listPrice = 0.01 ether;
    mapping(string => bool) private usedURIs;


    struct NFT {
        uint256 id;
        address owner;
        address seller;
        uint256 price;
        string uri;
        bool listed;
    }

    mapping(uint256 => NFT) public nfts;
    mapping(address => uint256[]) public ownedNFTs;

    event Minted(uint256 indexed id, address owner, string uri);
    event Listed(uint256 indexed id, uint256 price);
    event Unlisted(uint256 indexed id, address seller);
    event Purchased(uint256 indexed id, address newOwner, uint256 price);
    event PriceUpdated(uint256 indexed id, uint256 oldPrice, uint256 newPrice);
    event Deleted(uint256 indexed id, string uri);
    event FeesWithdrawn(uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function mint(string calldata _uri) external returns (uint256) {
        require(!usedURIs[_uri], "NFT with this URI already exists");

        totalSupply++;
        uint256 newId = totalSupply;

        nfts[newId] = NFT({
            id: newId,
            owner: msg.sender,
            seller: address(0),
            price: 0,
            uri: _uri,
            listed: false
        });

        ownedNFTs[msg.sender].push(newId);
        usedURIs[_uri] = true;

        emit Minted(newId, msg.sender, _uri);
        return newId;
    }

    function listNFTforsale(uint256 _id, uint256 _price) external payable {
        require(nfts[_id].owner == msg.sender, "You are not the owner of this NFT");
        require(_price > 0, "Price must be greater than 0");
        require(msg.value == listPrice, "Listing fee is required");
        require(!nfts[_id].listed, "NFT is already listed");

        nfts[_id].listed = true;
        nfts[_id].price = _price;
        nfts[_id].seller = msg.sender;

        emit Listed(_id, _price);
    }

    function unlistNFT(uint256 _id) external {
        NFT storage item = nfts[_id];
        require(item.owner == msg.sender, "Only the owner can unlist");
        require(item.listed == true, "NFT is not listed");

        item.listed = false;
        item.price = 0;
        item.seller = address(0);

        emit Unlisted(_id, msg.sender);
    }

    function updatePrice(uint256 _id, uint256 _newPrice) external {
        NFT storage item = nfts[_id];
        require(item.owner == msg.sender, "Only the owner can update price");
        require(item.listed == true, "NFT must be listed");
        require(_newPrice > 0, "Price must be greater than 0");

        uint256 oldPrice = item.price;
        item.price = _newPrice;

        emit PriceUpdated(_id, oldPrice, _newPrice);
    }

    function buyNFT(uint256 _id) external payable {
        NFT storage item = nfts[_id];
        require(item.listed, "NFT not listed");
        require(msg.value == item.price, "Incorrect price");
        require(msg.sender != item.seller, "Cannot buy your own NFT");

        address seller = item.seller;

        item.owner = msg.sender;
        item.seller = address(0);
        item.price = 0;
        item.listed = false;

        ownedNFTs[msg.sender].push(_id);

        payable(seller).transfer(msg.value);
        payable(owner).transfer(listPrice);

        uint256[] storage prevOwnerNFTs = ownedNFTs[seller];
        for (uint256 i = 0; i < prevOwnerNFTs.length; i++) {
            if (prevOwnerNFTs[i] == _id) {
                prevOwnerNFTs[i] = prevOwnerNFTs[prevOwnerNFTs.length - 1];
                prevOwnerNFTs.pop();
                break;
            }
        }
        emit Purchased(_id, msg.sender, msg.value);
    }

    function myNFTs() external view returns (uint256[] memory) {
        return ownedNFTs[msg.sender];
    }

    function getURI(uint256 _id) external view returns (string memory) {
        return nfts[_id].uri;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdrawFees() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance to withdraw");
        payable(owner).transfer(amount);

        emit FeesWithdrawn(amount);
    }

    function getListedNFTs() external view returns (NFT[] memory) {
    uint256 listedCount = 0;
    
    // Count how many NFTs are listed
    for (uint256 i = 1; i <= totalSupply; i++) {
        if (nfts[i].listed) {
            listedCount++;
        }
    }
    
    // Create an array to store listed NFTs
    NFT[] memory listedNFTs = new NFT[](listedCount);
    uint256 index = 0;
    
    // Populate the array with listed NFTs
    for (uint256 i = 1; i <= totalSupply; i++) {
        if (nfts[i].listed) {
            listedNFTs[index] = nfts[i];
            index++;
        }
    }
    
    return listedNFTs;
}


    function deleteNFT(uint256 _id) external {
        NFT storage item = nfts[_id];
        require(item.owner == msg.sender, "Not your NFT");
        require(!item.listed, "Unlist before deletion");

        // Remove URI tracking
        usedURIs[item.uri] = false;

        // Remove NFT data
        delete nfts[_id];

        // Remove from owned NFTs mapping
        uint256[] storage userNFTs = ownedNFTs[msg.sender];
        for (uint256 i = 0; i < userNFTs.length; i++) {
            if (userNFTs[i] == _id) {
                userNFTs[i] = userNFTs[userNFTs.length - 1];
                userNFTs.pop();
                break;
            }
        }

        emit Deleted(_id, item.uri);
    }
}
