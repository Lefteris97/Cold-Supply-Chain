const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BlockchainAssignment", (m) => {

  const coldSupplyContract = m.contract("BlockchainAssignment");

  return { coldSupplyContract };
});