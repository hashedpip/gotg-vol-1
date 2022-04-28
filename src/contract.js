const forwarderOrigin = "http://localhost:9010";
const Web3 = require("web3");
const MetaMaskOnboarding = require("@metamask/onboarding");
const utils = require("./utils/price-utils.js");
const { contractAddress } = require("./utils/constants.json");
const { DataTable } = require("simple-datatables");

const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"ACTION_ERROR_MARGIN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PREDICTION_ACTIVATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REDEEM_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REVEAL_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cancel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cancelNoWinner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"cancellationTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"executionTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"getCommitment","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"commitment","type":"bytes32"}],"name":"predictRemoval","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"predictionShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"predictions","outputs":[{"internalType":"address payable","name":"predictor","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"bytes32","name":"commitment","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"redeem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"report","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"predictedTime","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"}],"name":"reveal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"state","outputs":[{"internalType":"enum RemovePutinBounty.State","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBounty","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPredictionShares","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawRemaining","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];


const initialize = () => {
  //Basic Actions Section
  const onboardButton = document.getElementById("connectButton");
  const bountyLabel = document.getElementById("bounty");
  const bountyLabelUSD = document.getElementById("bounty-usd");
  const contractStatus = document.getElementById("contractStatus");

  //Contract Interaction Section
  const myTable = document.getElementById("predicts");
  const myCalendar = document.getElementById("calendar")

  // Date and Data utils for Vanilla JS
  const datePicker = new Datepicker(myCalendar);

  const dataTable = new DataTable(myTable, {
    perPageSelect : false,
    perPage : 15
  });

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  //This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = "Onboarding in progress";
    onboardButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await ethereum.request({ method: "eth_accounts" });
      onboardButton.innerText = accounts[0];
      onboardButton.disabled = true;
    } catch (error) {
      console.error(error);
    }
  };

  const onboardButtonUpdate = async (accounts) => {
    onboardButton.innerText = accounts[0];
    onboardButton.disabled = true;
  };

  const MetaMaskClientCheck = async () => {
    //Now we check to see if Metmask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = "Click here to install MetaMask!";
      //When the button is clicked we call th is function
      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;
    } else {
      //If MetaMask is installed we ask the user to connect to their wallet
      onboardButton.innerText = "Connect";
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts[0]) {
      onboardButtonUpdate(accounts);
    }

    if (ethereum) {
      const chainId = await ethereum.request({ method: "eth_chainId" });

      ethereum.on("chainChanged", (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload();
      });

      ethereum.on("accountsChanged", (accounts) => {
        // Handle the new accounts, or lack thereof.
        // 'accounts' will always be an array, but it can be empty.

        if (accounts.length === 0) {
          window.location.reload();
        } else {
          onboardButtonUpdate(accounts);
        }
      });

      window.web3 = new Web3(window.ethereum);

      try { 
        let status;
        let contract = new web3.eth.Contract(contractABI, contractAddress);
        let balance = await window.web3.eth.getBalance(contractAddress);
        let contractState = await contract.methods.state().call();
        let ethPrice = await utils.getPrice();

        if(contractState == 0){
          status = "Initiated";
        } else if (contractState == 1) {
          status = "Cancelled";
        } else if (contractState == 2) {
          status = "Executed";
        } else {
          status = "Contract Not Implemented";
        }

        bountyLabel.innerHTML = `${parseInt(balance) / 10 ** 18} ETH`;
        bountyLabelUSD.innerHTML = `${(ethPrice * parseInt(balance) / 10 ** 18).toFixed()} USD`;
        contractStatus.innerHTML = status;
      } catch (e) {
        console.log(`ERROR: ${e}`)
      }
      
    }
  };

  // chainIdtoName is a map list to attribute each chain ID to
  // a specific chain name. A full chain id and name list can be found
  // at https://github.com/DefiLlama/chainlist/blob/main/components/chains.js

  function chainIdtoName(chainId) {
    var chainlist_map = [];

    chainlist_map[1] = "Ethereum Mainnet";
    chainlist_map[3] = "Ropsten Testnet";
    chainlist_map[4] = "Rinkeby Testnet";

    return chainlist_map[chainId];
  }

  MetaMaskClientCheck();

  web3 = new Web3(window.web3.currentProvider);

  //
  // Deploy New VestingVault Section
  //
/*   createToken.onclick = async () => {
    contractStatus.innerHTML = "Deploying Test Token";
    const accounts = await ethereum.request({ method: "eth_accounts" });

    await window.token
      .deploy({
        data: "60806040526003805460ff191660121790553480156200001e57600080fd5b506040516200122d3803806200122d833981810160405260608110156200004457600080fd5b81019080805160405193929190846401000000008211156200006557600080fd5b9083019060208201858111156200007b57600080fd5b82516401000000008111828201881017156200009657600080fd5b82525081516020918201929091019080838360005b83811015620000c5578181015183820152602001620000ab565b50505050905090810190601f168015620000f35780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200011757600080fd5b9083019060208201858111156200012d57600080fd5b82516401000000008111828201881017156200014857600080fd5b82525081516020918201929091019080838360005b83811015620001775781810151838201526020016200015d565b50505050905090810190601f168015620001a55780820380516001836020036101000a031916815260200191505b5060405260200151915060009050620001bd62000288565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a35081516200021c9060029060208501906200028c565b508251620002329060019060208601906200028c565b503360008181526005602090815260408083208590556004859055805185815290517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350505062000338565b3390565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282620002c457600085556200030f565b82601f10620002df57805160ff19168380011785556200030f565b828001600101855582156200030f579182015b828111156200030f578251825591602001919060010190620002f2565b506200031d92915062000321565b5090565b5b808211156200031d576000815560010162000322565b610ee580620003486000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c8063715018a611610097578063a457c2d711610066578063a457c2d714610301578063a9059cbb1461032d578063dd62ed3e14610359578063f2fde38b1461038757610100565b8063715018a6146102a157806379cc6790146102a95780638da5cb5b146102d557806395d89b41146102f957610100565b8063313ce567116100d3578063313ce56714610212578063395093511461023057806342966c681461025c57806370a082311461027b57610100565b806306fdde0314610105578063095ea7b31461018257806318160ddd146101c257806323b872dd146101dc575b600080fd5b61010d6103ad565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561014757818101518382015260200161012f565b50505050905090810190601f1680156101745780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101ae6004803603604081101561019857600080fd5b506001600160a01b038135169060200135610442565b604080519115158252519081900360200190f35b6101ca61045f565b60408051918252519081900360200190f35b6101ae600480360360608110156101f257600080fd5b506001600160a01b03813581169160208101359091169060400135610465565b61021a6104ec565b6040805160ff9092168252519081900360200190f35b6101ae6004803603604081101561024657600080fd5b506001600160a01b0381351690602001356104f5565b6102796004803603602081101561027257600080fd5b5035610543565b005b6101ca6004803603602081101561029157600080fd5b50356001600160a01b0316610557565b610279610572565b610279600480360360408110156102bf57600080fd5b506001600160a01b038135169060200135610626565b6102dd610680565b604080516001600160a01b039092168252519081900360200190f35b61010d61068f565b6101ae6004803603604081101561031757600080fd5b506001600160a01b0381351690602001356106ed565b6101ae6004803603604081101561034357600080fd5b506001600160a01b038135169060200135610755565b6101ca6004803603604081101561036f57600080fd5b506001600160a01b0381358116916020013516610769565b6102796004803603602081101561039d57600080fd5b50356001600160a01b0316610794565b60018054604080516020601f600260001961010087891615020190951694909404938401819004810282018101909252828152606093909290918301828280156104385780601f1061040d57610100808354040283529160200191610438565b820191906000526020600020905b81548152906001019060200180831161041b57829003601f168201915b5050505050905090565b600061045661044f61089e565b84846108a2565b50600192915050565b60045490565b600061047284848461098e565b6104e28461047e61089e565b6104dd85604051806060016040528060288152602001610dd5602891396001600160a01b038a166000908152600660205260408120906104bc61089e565b6001600160a01b031681526020810191909152604001600020549190610aeb565b6108a2565b5060019392505050565b60035460ff1690565b600061045661050261089e565b846104dd856006600061051361089e565b6001600160a01b03908116825260208083019390935260409182016000908120918c168152925290205490610b82565b61055461054e61089e565b82610be3565b50565b6001600160a01b031660009081526005602052604090205490565b61057a61089e565b6000546001600160a01b039081169116146105dc576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b600061065d82604051806060016040528060248152602001610dfd602491396106568661065161089e565b610769565b9190610aeb565b90506106718361066b61089e565b836108a2565b61067b8383610be3565b505050565b6000546001600160a01b031690565b60028054604080516020601f60001961010060018716150201909416859004938401819004810282018101909252828152606093909290918301828280156104385780601f1061040d57610100808354040283529160200191610438565b60006104566106fa61089e565b846104dd85604051806060016040528060258152602001610e8b602591396006600061072461089e565b6001600160a01b03908116825260208083019390935260409182016000908120918d16815292529020549190610aeb565b600061045661076261089e565b848461098e565b6001600160a01b03918216600090815260066020908152604080832093909416825291909152205490565b61079c61089e565b6000546001600160a01b039081169116146107fe576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b0381166108435760405162461bcd60e51b8152600401808060200182810382526026815260200180610d676026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b3390565b6001600160a01b0383166108e75760405162461bcd60e51b8152600401808060200182810382526024815260200180610e676024913960400191505060405180910390fd5b6001600160a01b03821661092c5760405162461bcd60e51b8152600401808060200182810382526022815260200180610d8d6022913960400191505060405180910390fd5b6001600160a01b03808416600081815260066020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b0383166109d35760405162461bcd60e51b8152600401808060200182810382526025815260200180610e426025913960400191505060405180910390fd5b6001600160a01b038216610a185760405162461bcd60e51b8152600401808060200182810382526023815260200180610d226023913960400191505060405180910390fd5b610a2383838361067b565b610a6081604051806060016040528060268152602001610daf602691396001600160a01b0386166000908152600560205260409020549190610aeb565b6001600160a01b038085166000908152600560205260408082209390935590841681522054610a8f9082610b82565b6001600160a01b0380841660008181526005602090815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008184841115610b7a5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610b3f578181015183820152602001610b27565b50505050905090810190601f168015610b6c5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b600082820183811015610bdc576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b6001600160a01b038216610c285760405162461bcd60e51b8152600401808060200182810382526021815260200180610e216021913960400191505060405180910390fd5b610c348260008361067b565b610c7181604051806060016040528060228152602001610d45602291396001600160a01b0385166000908152600560205260409020549190610aeb565b6001600160a01b038316600090815260056020526040902055600454610c979082610cdf565b6004556040805182815290516000916001600160a01b038516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9181900360200190a35050565b6000610bdc83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250610aeb56fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a206275726e20616d6f756e7420657863656564732062616c616e63654f776e61626c653a206e6577206f776e657220697320746865207a65726f206164647265737345524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a206275726e20616d6f756e74206578636565647320616c6c6f77616e636545524332303a206275726e2066726f6d20746865207a65726f206164647265737345524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa26469706673582212204e216be23843b0a0cd80fedd3713322dfc84e48e4c6e4ccc8eb164fe42a6c97564736f6c63430007060033",
        arguments: ["TOKEN", "TKN", web3.utils.toWei("100000", "ether")],
      })
      .send({
        from: accounts[0],
        gas: "1200000",
      })
      .on("error", function (error) {
        console.log(error);
        contractStatus.innerHTML = "Deployment Failed";
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        if (confirmationNumber < 1) {
          console.log(confirmationNumber);
          console.log(receipt);
          contractStatus.innerHTML = "Contract Deployed";
        }
        createToken.disabled = true;
        deployButton.disabled = false;
      })
      .then(function (newContractInstance) {
        window.token.options.address = newContractInstance.options.address;
        tokenAddress.innerHTML = newContractInstance.options.address;
      });
  }; */
};

window.addEventListener("DOMContentLoaded", initialize);
