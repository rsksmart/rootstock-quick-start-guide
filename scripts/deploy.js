async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy(1000);

  console.log("Token address:", myToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
