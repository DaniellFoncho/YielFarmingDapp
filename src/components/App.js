import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import FelipeToken from '../abis/FelipeToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

    // Load DaiToken
    const daitokenData = DaiToken.networks[networkId]
    if(daitokenData) {
      const daitoken = new web3.eth.Contract(DaiToken.abi, daitokenData.address)
      this.setState({ daitoken })
      let daitokenBalance = await daitoken.methods.balanceOf(this.state.account).call()
      this.setState({ daitokenBalance: daitokenBalance.toString() })
    } else {
      window.alert('DaiToken contract not deployed to detected network.')
    }

    // Load FelipeToken
    const felipetokenData = FelipeToken.networks[networkId]
    if(felipetokenData) {
      const felipetoken = new web3.eth.Contract(FelipeToken.abi, felipetokenData.address)
      this.setState({ felipetoken })
      let felipetokenBalance = await felipetoken.methods.balanceOf(this.state.account).call()
      this.setState({ felipetokenBalance: felipetokenBalance.toString() })
    } else {
      window.alert('DappToken contract not deployed to detected network.')
    }

    // Load TokenFarm
    const tokenfarmData = TokenFarm.networks[networkId]
    if(tokenfarmData) {
      const tokenfarm = new web3.eth.Contract(TokenFarm.abi, tokenfarmData.address)
      this.setState({ tokenfarm })
      let stakingBalance = await tokenfarm.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
    } else {
      window.alert('TokenFarm contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daitoken.methods.approve(this.state.tokenfarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenfarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenfarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daitoken: {},
      felipetoken: {},
      tokenfarm: {},
      daitokenBalance: '0',
      felipetokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        daitokenBalance={this.state.daitokenBalance}
        felipetokenBalance={this.state.felipetokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.felipecoin.com"
                  target="_blank"
                  rel="feliper"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;