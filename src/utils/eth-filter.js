const { ethers } = require('ethers')
const { contractAddress } = require('./constants.json')
const Web3 = require('web3')

const RPCNodeProvider = 'https://speedy-nodes-nyc.moralis.io/0c96cccf76f7c73514d15fcd/eth/mainnet/archive'
// const RPCNodeProvider = 'https://speedy-nodes-nyc.moralis.io/0c96cccf76f7c73514d15fcd/eth/goerli/archive'

// Declaring Blockchain variables
const ethersProvider = new ethers.providers.JsonRpcProvider(RPCNodeProvider)
const ABI = '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]'

const contract = new ethers.Contract(
  contractAddress,
  ABI,
  ethersProvider.getSigner(0)
)

// @dev you can check if the eth node provider is working by toggling the following block comment:
/* ethersProvider.getBlockNumber().then((result) => {
  console.log('Current Block Number:' + result)
}) */

const eventFilter = contract.filters.Transfer('0x0000000000000000000000000000000000000000')

async function listEvents (_filter) {
  try {
    const currentBlock = await ethersProvider.getBlockNumber()
    const initialBlock = currentBlock - 2000
    const events = await contract.queryFilter(_filter, initialBlock, currentBlock)
    return events
  } catch (e) {
    console.log(e)
  }
}

//const { ethereum } = window
window.web3 = new Web3(window.ethereum)

async function writeData () {
  const data = await listEvents(eventFilter)

  const jsonStr = '{"headings":["#","Address","Contribution","See on Etherscan"],"data":[]}'
  const formatedData = JSON.parse(jsonStr)

  for (let i = 0; i < Object.keys(data).length; i++) {
    formatedData.data.push([
      `${data[i].args.to}`,
      `${window.web3.utils.fromWei(`${data[i].args.value}`, 'ether')} ETH for ${window.web3.utils.fromWei(`${data[i].args.value}`, 'ether') * 10000} PBTY`,
      // `<a href="https://goerli.etherscan.io/tx/${data[i].transactionHash}" target="_blank">Go To Etherscan</a>`
      `<a href="https://etherscan.io/tx/${data[i].transactionHash}" target="_blank">Go To Etherscan</a>`
    ])
  }

  return formatedData
}

module.exports = { writeData }
