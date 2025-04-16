const NFTM = artifacts.require("NFTMarketPlace");
module.exports = function (deployer) {
    deployer.deploy(NFTM);
};