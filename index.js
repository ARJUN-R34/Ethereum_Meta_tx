const Web3 = require('web3');

const { TokenABI } = require('./ABI/Token');
const { TOKEN_CONTRACT_ADDRESS, DEPLOYER_PRIVATE_KEY, DEPLOYER_ACCOUNT, ACCOUNT_2, WEB3_PROVIDER } = require('./config');

const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));

const tokenContract = new web3.eth.Contract(TokenABI, TOKEN_CONTRACT_ADDRESS);

const transact = async() => {
    const target = TOKEN_CONTRACT_ADDRESS;
    const nonce = await tokenContract.methods.nonces(DEPLOYER_ACCOUNT).call();
    const data = await tokenContract.methods.transfer(ACCOUNT_2, web3.utils.toHex(500 * 10**18)).encodeABI();
    const hash = web3.utils.sha3(target + data.substr(2) + web3.utils.toBN(nonce).toString(16,64));
    const sig = await web3.eth.accounts.sign(hash, DEPLOYER_PRIVATE_KEY);
    
    const response = await tokenContract.methods.performFeelessTransaction(DEPLOYER_ACCOUNT, target, data, nonce, sig).send({ from: ACCOUNT_2 });

    console.log(response)
}

transact()

// 9.981263


