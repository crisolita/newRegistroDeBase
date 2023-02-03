const CONTRACT_NAME = "BlockToWinV2";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const admins = [
    "0x5E73a0A61ed56B6b92f176118c11F9A2B5c8ED2b",
    "0xd26F402849069a42Dc917454b235893A1cB82061",
    "0xA46765F80B9977F92AC39f722859b2e156A24b8C",
  ];
  console.log(deployer);

  // Upgradeable Proxy
  const deployResult = await deploy("BlockToWinV2", {
    from: deployer,
    proxy: {
      owner: deployer,
      execute: {
        init: {
          methodName: "initialize",
          args: [admins, deployer],
        },
      },
    },
    log: true,
  });
};
module.exports.tags = [CONTRACT_NAME];
