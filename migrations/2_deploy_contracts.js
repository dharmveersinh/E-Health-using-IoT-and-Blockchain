const MetaCoin = artifacts.require("Storage");

module.exports = function(deployer) {
  deployer.deploy(MetaCoin);
};
