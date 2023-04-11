var wasm = require("cosmwasm");
const { OKCSecp256k1Wallet } = require("@okexchain/javascript-sdk")
var encoding = require("@cosmjs/encoding");
var fs = require("fs");

async function deployWASMContract(path) {

    let signer = await OKCSecp256k1Wallet.fromKey(encoding.fromHex(process.env.TEST_USER1_PRIVATE_KEY), "ex");
    let [alice,] = await signer.getAccounts();

    const cwclient = await wasm.SigningCosmWasmClient.connectWithSigner(process.env.RPC_END_POINT, signer);

    let filedata = fs.readFileSync(path)

    //update the contract
    var result = await cwclient.upload(alice.address, filedata, { "amount": wasm.parseCoins("200000000000000000wei"), "gas": "20000000" })

    var initMsg = {};

    //init the contract
    var res2 = await cwclient.instantiate(alice.address, result.codeId, initMsg, "hello world", { "amount": wasm.parseCoins("200000000000000000wei"), "gas": "20000000" }, { "funds": [], "admin": alice.address })

    return res2;
}

module.exports = {
    deployWASMContract,
}