const forwarderOrigin = 'http://localhost:9010'
const Web3 = require('web3')
const MetaMaskOnboarding = require('@metamask/onboarding')
const flatpickr = require('flatpickr')
const bootstrap = require('bootstrap')
const { contractAddress } = require('./utils/constants.json')
const { DataTable } = require('simple-datatables')

// -----------⬇⬇ AUTHORIAL DEVELOPMENT LIBRARIES ⬇⬇ -----------
const utils = require('./utils/price-utils') // Library for Fetching ETH Price
const wepgen = require('./utils/wepgen') // Library for WEP 256-bit key generation
const ethFilter = require('./utils/eth-filter') // Library to Fetch for historical data on Ethereum
const blobUtils = require('./utils/download-blob') // Library for formating BLOB for download

const contractABI = [{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'owner', type: 'address' }, { indexed: true, internalType: 'address', name: 'spender', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }], name: 'Approval', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'from', type: 'address' }, { indexed: true, internalType: 'address', name: 'to', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event' }, { inputs: [], name: 'ACTION_ERROR_MARGIN', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'PREDICTION_ACTIVATION', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'REDEEM_TIME', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'REVEAL_TIME', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: '', type: 'address' }, { internalType: 'address', name: '', type: 'address' }], name: 'allowance', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'cancel', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'cancelNoWinner', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'cancellationTime', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }], name: 'changeOwner', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'decimals', outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'executionTime', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'time', type: 'uint256' }, { internalType: 'uint256', name: 'salt', type: 'uint256' }], name: 'getCommitment', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'pure', type: 'function' }, { inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'owner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'commitment', type: 'bytes32' }], name: 'predictRemoval', outputs: [], stateMutability: 'payable', type: 'function' }, { inputs: [{ internalType: 'address', name: '', type: 'address' }], name: 'predictionShares', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'predictions', outputs: [{ internalType: 'address payable', name: 'predictor', type: 'address' }, { internalType: 'uint256', name: 'value', type: 'uint256' }, { internalType: 'uint256', name: 'time', type: 'uint256' }, { internalType: 'bytes32', name: 'commitment', type: 'bytes32' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'redeem', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'time', type: 'uint256' }], name: 'report', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }, { internalType: 'uint256', name: 'predictedTime', type: 'uint256' }, { internalType: 'uint256', name: 'salt', type: 'uint256' }], name: 'reveal', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'state', outputs: [{ internalType: 'enum RemovePutinBounty.State', name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'totalBounty', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'totalPredictionShares', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'totalSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'transfer', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'sender', type: 'address' }, { internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'transferFrom', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'withdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'withdrawRemaining', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { stateMutability: 'payable', type: 'receive' }]

const initialize = () => {
  // ------------- ⬇⬇ TOP PAGE LABELS ⬇⬇ -------------
  const bountyLabel = document.getElementById('bounty')
  const bountyLabelUSD = document.getElementById('bounty-usd')
  const contractStatus = document.getElementById('contractStatus')

  // ------------- ⬇⬇ DAPP BUTTONS ⬇⬇ -------------
  const onboardButton = document.getElementById('connectButton')
  const createPredict = document.getElementById('createPredict')
  const downloadReceipt = document.getElementById('downloadReceipt')
  const sendPredict = document.getElementById('sendToBlockchain')
  const sendContribution = document.getElementById('donationSend')

  // ------------- ⬇⬇ INPUT FIELDS ⬇⬇ -------------
  const predictMsgValue = document.getElementById('msg.value')
  const donationValue = document.getElementById('donationValue')

  // ------------- ⬇⬇ POP-UP MODALS ⬇⬇ -------------
  const errorModal = new bootstrap.Modal(document.getElementById('errorModal'))
  const closeModal = document.getElementById('closeModal')

  const receiptSucceded = new bootstrap.Modal(document.getElementById('predictSucessful'))
  const closeReceiptSucceded = document.getElementById('closeSucessNote')

  // ------------- ⬇⬇ TABLE AND CALENDAR ⬇⬇ -------------
  const myTable = document.getElementById('predicts')
  const myCalendar = document.getElementById('calendar')

  let data

  // ------------ ⬇⬇ DATE AND DATA UTILS ⬇⬇ -------------
  flatpickr(myCalendar, {
    minDate: 'today',
    enableTime: true,
    minuteIncrement: 1
  })

  const dataTable = new DataTable(myTable, {
    perPageSelect: false,
    perPage: 15
  })

  const fillTableData = async () => {
    const tableData = await ethFilter.writeData()
    dataTable.insert(tableData)
  }

  fillTableData()

  // ------------- ⬇⬇ ENABLING METAMASK ⬇⬇ -------------
  // Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
  // Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  // We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin })

  // This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress'
    onboardButton.disabled = true
    // On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding()
  }

  const onClickConnect = async () => {
    try {
    // Will open the MetaMask UI
    // You should disable this button while the request is pending!
      await ethereum.request({ method: 'eth_requestAccounts' })
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      onboardButton.innerText = accounts[0]
      onboardButton.disabled = true
    } catch (error) {
      console.error(error)
    }
  }

  const onboardButtonUpdate = async (accounts) => {
    onboardButton.innerText = accounts[0]
    onboardButton.disabled = true
  }

  // If Not in default network, ask user to go back to default
  const defaultNetwork = async () => {
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }] // chainId must be in hexadecimal numbers
      })
    } catch (error) {
      console.error(error)
    }
  }

  const MetaMaskClientCheck = async () => {
  // Now we check to see if Metmask is installed
    if (!isMetaMaskInstalled()) {
    // If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!'
      // When the button is clicked we call th is function
      onboardButton.onclick = onClickInstall
      // The button is now disabled
      onboardButton.disabled = false
    } else {
    // If MetaMask is installed we ask the user to connect to their wallet
      onboardButton.innerText = 'Connect'
      // When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect
      // The button is now disabled
      onboardButton.disabled = false
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    if (accounts[0]) {
      onboardButtonUpdate(accounts)
    }
    if (ethereum) {
      const chainId = await ethereum.request({ method: 'eth_chainId' })

      if (chainId !== '0x1') {
        defaultNetwork()
      }

      ethereum.on('chainChanged', (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
        window.location.reload()
      })

      ethereum.on('accountsChanged', (accounts) => {
      // Handle the new accounts, or lack thereof.
      // 'accounts' will always be an array, but it can be empty.

        if (accounts.length === 0) {
          window.location.reload()
        } else {
          onboardButtonUpdate(accounts)
          window.location.reload()
        }
      })

      window.web3 = new Web3(window.ethereum)

      try {
        let status
        const contract = new window.web3.eth.Contract(contractABI, contractAddress)
        // Check ETH balance on the contract (AKA total contribution)
        const balance = await window.web3.eth.getBalance(contractAddress)
        // Check contract state: 0 || 1 || 2
        const contractState = await contract.methods.state().call()
        // Get current ETH price
        const ethPrice = await utils.getPrice()

        // Checking if contractState is INITIALIZED || CANCELLED || EXECUTED
        if (contractState == 0) {
          status = 'Initiated'
        } else if (contractState == 1) {
          status = 'Cancelled'
        } else if (contractState == 2) {
          status = 'Executed'
        } else {
          status = 'Contract Not Implemented'
        }

        bountyLabel.innerHTML = `${parseInt(balance) / 10 ** 18} ETH`
        bountyLabelUSD.innerHTML = `${(ethPrice * parseInt(balance) / 10 ** 18).toFixed()} USD`
        contractStatus.innerHTML = status
      } catch (e) {
        console.log(`ERROR: ${e}`)
      }
    }
  }

  MetaMaskClientCheck()

  web3 = new Web3(window.web3.currentProvider)

  window.contract = new web3.eth.Contract(contractABI, contractAddress)

  // ------------- ⬇⬇ GENERATING PREDICTS ⬇⬇ -------------

  createPredict.onclick = async () => {
    const dateStr = new Date(myCalendar.value)
    const timeStamp = Date.parse(dateStr) / 1000
    // new Date().getTime() / 1000) + (12 * 60 * 60)
    // THIS SECTION MEANS: if prediction > 12 hours from now do the following code.
    if (timeStamp > (new Date().getTime() / 1000) + (12 * 60 * 60)) {
      data = {
        date: `${timeStamp}`,
        salt: `0x${wepgen.generateHexString(64)}` // wepgen for WEP 256-bit key gen
      }
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const parentDiv = downloadReceipt.parentNode
      // Replacing downloadReceipt button with blob'd element
      parentDiv.replaceChild(blobUtils.downloadBlob(blob, 'data.json'), downloadReceipt)
      createPredict.disabled = true
    } else {
      // This error modal pops up if user tries to create predict
      // less than 12 hours from now, or not having a predict at all
      errorModal.toggle()
    }
  }

  // closeModal catch if user is trying to close errorModal
  closeModal.onclick = async () => {
    errorModal.toggle()
  }

  closeReceiptSucceded.onclick = async () => {
    window.location.reload()
  }

  // ------------- ⬇⬇ BLOCKCHAIN TRANSACTIONS ⬇⬇ -------------

  sendPredict.onclick = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    const commitment = await contract.methods.getCommitment(data.date, data.salt).call()

    await contract.methods.predictRemoval(commitment)
      .send({
        from: accounts[0],
        value: web3.utils.toWei(predictMsgValue.value, 'ether')
      })
      .on('error', function (error) {
        console.log(error)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber < 1) {
          console.log(confirmationNumber)
          console.log(receipt)
          receiptSucceded.toggle()
        }
      })
      .then(function (receipt) {
        console.log(receipt)
      })
  }

  sendContribution.onclick = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: contractAddress,
      value: web3.utils.toWei(donationValue.value, 'ether')
    })
      .on('error', function (error) {
        console.log(error)
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber < 1) {
          console.log(confirmationNumber)
          console.log(receipt)
          window.location.reload()
        }
      })
      .then(function (receipt) {
        console.log(receipt)
      })
  }
}

window.addEventListener('DOMContentLoaded', initialize)
