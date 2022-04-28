const FelipeToken = artifacts.require("FelipeToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function (deployer, network, accounts) {
//deploy Dai token
await deployer.deploy(DaiToken)
//Fetch Dai Token with adress
const daitoken = await DaiToken.deployed()
//deploy Felipe token
await deployer.deploy(FelipeToken)
//Fetch Felipe Token with adress
const felipetoken = await FelipeToken.deployed()
//deploy Farm token
await deployer.deploy(TokenFarm, felipetoken.address, daitoken.address )
//Fetch Felipe Token with adress
const tokenfarm = await TokenFarm.deployed()

//trnafer all the tokens from felipetoken to farmtoken
await felipetoken.transfer(tokenfarm.address, "1000000000000000000000000")
//trnafer 100  Mok dai tokens  to investor
await daitoken.transfer(accounts[1], "1000000000000000000000000")}
