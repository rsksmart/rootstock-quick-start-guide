document.addEventListener('DOMContentLoaded', function () {
  // Instantiating HTML elements
  const connectButton = document.getElementById('connectButton');
  const getBalanceButton = document.getElementById('getBalanceButton');
  const walletAddressDiv = document.getElementById('walletAddress');
  const walletBalanceDiv = document.getElementById('walletBalance');
  // Instantiating variables
  let provider, account, myTokenContract;
  let contractABI = [];
  let networks = {};
  const contractAddress = `Replace with your contract's address`; // E.g. 0xa6fb392538BaC56e03a900BFDE22e76C05fb5122

  /**
 * Load data from external JSON files
 */
  async function fetchExternalFiles() {
    // Place MyToken.json generated in artifacts after compiling the contracts
    let response = await fetch('MyToken.json');
    const data = await response.json();
    contractABI = data.abi;
    // Place networks.json to set the network automatically with the checkNetwork() function
    // You can set it manually instead following this guide https://dev.rootstock.io/kb/rootstock-metamask/
    response = await fetch('networks.json');
    networks = await response.json();
  }

  /**
 * Check and set network automatically in case it is not already done
 */
  async function checkNetwork() {
    try {
      // Make sure Metamask is installed
      if (!window.ethereum){
        alert('Please install Metamask!');
        return;
      }
      // Switch network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networks.rskTestnet.chainId }],
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to Metamask
      if (error.code === 4902) {
        // Trying to add new chain to Metamask
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networks.rskTestnet],
        });
      } else {
        // Rethrow all other errors
        throw error;
      }
    }
  }

  // Get the required data and set the events
  fetchExternalFiles().then(() => {
    // Connect button event
    connectButton.addEventListener('click', async function () {
      // Check the network is set properly
      await checkNetwork();
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Get the account from Metamask
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          account = accounts[0];
          // Update the front with the account address
          walletAddressDiv.innerHTML = `Connected account: ${account}`;
          // Get the network provider
          provider = new ethers.providers.Web3Provider(window.ethereum);
          // Get the signer for network interaction
          signer = provider.getSigner();
          // Instantiate the contract
          myTokenContract = new ethers.Contract(contractAddress, contractABI, signer);
          // Activates the getBalanceButton
          connectButton.disabled = true;
          getBalanceButton.disabled = false;
        } catch (error) {
          console.error("Error connecting to MetaMask", error);
          walletAddressDiv.innerHTML = `Error: ${error.message}`;
        }
      } else {
        walletAddressDiv.innerHTML = 'Please install MetaMask!';
      }
    });

    // Get balance button event
    getBalanceButton.addEventListener('click', async function () {
      // Check if the contract is instatiated properly
      if (myTokenContract) {
        // Obtains the user balance
        const balance = await myTokenContract.balanceOf(account);
        // Show the user balance
        walletBalanceDiv.innerHTML = `MyToken Balance: ${balance} MTK`;
      }
    });
  });
});
