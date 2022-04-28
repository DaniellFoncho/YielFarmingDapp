const FelipeToken = artifacts.require("FelipeToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require ("chai")
    .use(require("chai-as-promised"))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
    }

// quine ahce el deploy del contract : owner
contract('TokenFarm', ([owner, investor]) => {
   let daitoken, felipetoken, tokenfarm
      
        before(async () => {
          // Load Contracts
          daitoken = await DaiToken.new()
          felipetoken = await FelipeToken.new()
          tokenfarm = await TokenFarm.new(felipetoken.address, daitoken.address)
      
          // Transfer all Felipe tokens to farm (1 million)
          await felipetoken.transfer(tokenfarm.address, tokens('1000000'))
      
          // Send tokens to investor
          await daitoken.transfer(investor, tokens('100'), { from: owner })
        })

          describe('Mock DAI deployment', async () => {
            it('has a name', async () => {
              const name = await daitoken.name()
              assert.equal(name, 'Mock DAI Token')
            })
          })
        
          describe('felipetoken deployment', async () => {
            it('has a name', async () => {
              const name = await felipetoken.name()
              assert.equal(name, 'Felipe Token')
            })
          })
        
          describe('Token Farm deployment', async () => {
            it('has a name', async () => {
              const name = await tokenfarm.name()
              assert.equal(name, 'TokenFarm')
            })
        
            it('contract has tokens', async () => {
              let balance = await felipetoken.balanceOf(tokenfarm.address)
              assert.equal(balance.toString(), tokens('1000000'))
            })
          })

          describe('Farming tokens', async () => {

            it('rewards investors for staking mDai tokens', async () => {
              let result
        
              // Check investor balance before staking
              result = await daitoken.balanceOf(investor)
              assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')
        
              // Stake Mock DAI Tokens
              await daitoken.approve(tokenfarm.address, tokens('100'), { from: investor })
              await tokenfarm.stakeTokens(tokens('100'), { from: investor })
        
              // Check staking result
              result = await daitoken.balanceOf(investor)
              assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')
        
              result = await daitoken.balanceOf(tokenfarm.address)
              assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')
        
              result = await tokenfarm.stakingBalance(investor)
              assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')
        
              result = await tokenfarm.isStaking(investor)
              assert.equal(result.toString(), 'true', 'investor staking status correct after staking')
        
              // Issue Tokens
              await tokenfarm.issueTokens({ from: owner })
        
              // Check balances after issuance
              result = await felipetoken.balanceOf(investor)
              assert.equal(result.toString(), tokens('100'), 'investor FelipeToken wallet balance correct affter issuance')
        
              // Ensure that only onwer can issue tokens
              await tokenfarm.issueTokens({ from: investor }).should.be.rejected;
        
              // Unstake tokens
              await tokenfarm.unstakeTokens({ from: investor })
        
              // Check results after unstaking
              result = await daitoken.balanceOf(investor)
              assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')
        
              result = await daitoken.balanceOf(tokenfarm.address)
              assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')
        
              result = await tokenfarm.stakingBalance(investor)
              assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')
        
              result = await tokenfarm.isStaking(investor)
              assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
            })
          })
        
        })


        