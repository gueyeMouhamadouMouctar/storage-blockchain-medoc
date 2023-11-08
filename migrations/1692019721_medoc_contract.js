const MedocContract = artifacts.require('MedocContract')

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(MedocContract)
};
