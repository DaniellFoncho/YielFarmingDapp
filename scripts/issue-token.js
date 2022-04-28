const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(callback) {
  let tokenfarm = await TokenFarm.deployed()
  await tokenfarm.issueTokens()

  console.log("Tokens issued!")
  callback()
}