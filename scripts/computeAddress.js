const { ethers } = require("ethers");
const initcodeD = require('./D.json').bytecode // contract with constructor params
const initcodeC = require('./D.json').bytecode
const provider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com	')


const from = '0xC1144C9dbf6F3489CE9C808a1Da653FB4465403d'

async function getAddressCreate1() {
    // get the factory contract's nonce
    const nonce = await getNonce(from)
    const contractAddress = ethers.utils.getContractAddress({from,nonce})
    console.log(`${contractAddress}`);
}

async function getAddressCreate2() {     
    const saltValue = 111  
    // converting salt the value into bytes32 format
    const salt = ethers.utils.hexZeroPad(ethers.utils.hexlify(saltValue), 32)
    // keccak256 expects a bytes input, returns the keccak256 hash
    const initcodeHash = ethers.utils.keccak256(initcodeC)
    const contractAddress = ethers.utils.getCreate2Address(from,salt,initcodeHash)
    console.log(`${contractAddress}`);
}


async function getAddressCreate2WithConstructorParams() {
    const saltValue = 111  
    const param1 = 111
    const paramEncoded = (ethers.utils.defaultAbiCoder.encode([ "uint"], [param1])).slice(2);
    const salt = ethers.utils.hexZeroPad(ethers.utils.hexlify(saltValue), 32)
    const initcodeHash = ethers.utils.keccak256(initcodeD + paramEncoded)
    const contractAddress = ethers.utils.getCreate2Address(from,salt,initcodeHash)
    console.log(`${contractAddress}`);
}


async function getNonce(address) {
    try {
        const nonce = await provider.getTransactionCount(address)
        return nonce
    } catch(e) {
        console.error("Error while fetching nonce:", e);
    }
} 

getAddressCreate1()
getAddressCreate2()
getAddressCreate2WithConstructorParams()