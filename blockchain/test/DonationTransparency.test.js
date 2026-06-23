const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DonationTransparency", function () {
  let DonationTransparency;
  let donationTransparency;
  let owner;
  let addr1;

  beforeEach(async function () {
    DonationTransparency = await ethers.getContractFactory("DonationTransparency");
    [owner, addr1] = await ethers.getSigners();
    donationTransparency = await DonationTransparency.deploy();
    await donationTransparency.deployed();
  });

  it("Should record a donation correctly", async function () {
    const donorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("donor@example.com"));
    const amount = ethers.utils.parseEther("1.0");
    const category = "Education";
    const orderId = "ORDER123";
    const timestamp = Math.floor(Date.now() / 1000);

    await donationTransparency.recordDonation(donorHash, amount, category, orderId, timestamp);

    const donation = await donationTransparency.getDonation(orderId);
    expect(donation.donorHash).to.equal(donorHash);
    expect(donation.amount).to.equal(amount);
    expect(donation.category).to.equal(category);
    expect(donation.timestamp).to.equal(timestamp);
  });

  it("Should fail if amount is 0", async function () {
    const donorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("donor@example.com"));
    const amount = 0;
    const category = "Education";
    const orderId = "ORDER123";
    const timestamp = Math.floor(Date.now() / 1000);

    await expect(
      donationTransparency.recordDonation(donorHash, amount, category, orderId, timestamp)
    ).to.be.revertedWith("DonationTransparency: Amount must be greater than 0");
  });

  it("Should prevent duplicate order IDs", async function () {
    const donorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("donor@example.com"));
    const amount = ethers.utils.parseEther("1.0");
    const category = "Education";
    const orderId = "ORDER123";
    const timestamp = Math.floor(Date.now() / 1000);

    await donationTransparency.recordDonation(donorHash, amount, category, orderId, timestamp);

    await expect(
      donationTransparency.recordDonation(donorHash, amount, category, orderId, timestamp)
    ).to.be.revertedWith("DonationTransparency: Order ID already exists");
  });

  it("Should return total donation count", async function () {
    const donorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("donor@example.com"));
    const amount = ethers.utils.parseEther("1.0");
    const timestamp = Math.floor(Date.now() / 1000);

    await donationTransparency.recordDonation(donorHash, amount, "Education", "ORDER1", timestamp);
    await donationTransparency.recordDonation(donorHash, amount, "Health", "ORDER2", timestamp);

    expect(await donationTransparency.getTotalDonations()).to.equal(2);
  });

  it("Should filter donations by category", async function () {
    const donorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("donor@example.com"));
    const amount = ethers.utils.parseEther("1.0");
    const timestamp = Math.floor(Date.now() / 1000);

    await donationTransparency.recordDonation(donorHash, amount, "Education", "ORDER1", timestamp);
    await donationTransparency.recordDonation(donorHash, amount, "Health", "ORDER2", timestamp);
    await donationTransparency.recordDonation(donorHash, amount, "Education", "ORDER3", timestamp);

    const eduDonations = await donationTransparency.getDonationsByCategory("Education", 0, 10);
    expect(eduDonations.length).to.equal(2);
    expect(eduDonations[0]).to.equal("ORDER1");
    expect(eduDonations[1]).to.equal("ORDER3");
  });
});
