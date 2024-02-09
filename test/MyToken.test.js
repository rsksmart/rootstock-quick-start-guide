const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  // Test description
  it("Should deploy MyToken and assign the total supply to the owner", async function () {
    // Gets the account that obtained the initial balance after deploying the contract
    const [owner] = await ethers.getSigners();
    // Instantiates the MyToken contract
    const MyToken = await ethers.getContractFactory("MyToken");
    // Deploy the contract with and mint 1000 units
    const myToken = await MyToken.deploy(1000);
    // Wait for the contract to be deployed
    await myToken.deployed();
    // Validates that the contract total supply is equal to 1000
    expect((await myToken.totalSupply()).toString()).to.equal('1000');
    // Validates that the balance of the owner account is equal to 1000
    expect((await myToken.balanceOf(owner.address)).toString()).to.equal('1000');
  });
});
