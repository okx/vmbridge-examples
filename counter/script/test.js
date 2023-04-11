const hre = require("hardhat");
var encoding = require("@cosmjs/encoding");
const { expect } = require("chai");
const wasm = require("cosmwasm");
const { OKCSecp256k1Wallet } = require("@okexchain/javascript-sdk")
require('dotenv').config();

var wasmDeploy = require("./tools/WASMdeploy");

describe("WASM bridge", function () {

    let wasmCounter
    let evmCounter
    let wasmClient
    let aliceInEvm, aliceInWASM


    before(async () => {

        //get users
        [aliceInEvm,] = await hre.ethers.getSigners();
        let signer = await OKCSecp256k1Wallet.fromKey(encoding.fromHex(process.env.TEST_USER1_PRIVATE_KEY), "ex");
        [aliceInWASM,] = await signer.getAccounts();
        //Wallet connect WASM
        wasmClient = await wasm.SigningCosmWasmClient.connectWithSigner(process.env.RPC_END_POINT, signer);

        //deploy evm contract by hardhat
        const Counter = await hre.ethers.getContractFactory("Counter");
        evmCounter = await Counter.connect(aliceInEvm).deploy();
        await evmCounter.deployed()

        //deploy WASM contract(include init)
        wasmCounter = await wasmDeploy.deployWASMContract('./wasmContracts/Counter/target/wasm32-unknown-unknown/release/counter.wasm');

    })


    it("evm2wasm add should success", async () => {

        //before check
        result = await wasmClient.queryContractSmart(wasmCounter.contractAddress, { get_counter: {} });
        expect(result, 0)

        //execute
        result = await evmCounter.connect(aliceInEvm).addCounterForWasm(wasmCounter.contractAddress, "1");
        //wait tx
        let txReceipt = await result.wait();
        expect(txReceipt.status, 1);

        result = await wasmClient.queryContractSmart(wasmCounter.contractAddress, { get_counter: {} });
        expect(result, 1)
    })

    it("wasm2evm add should success", async () => {

        //before check
        result = await evmCounter.count();
        expect(JSON.stringify(result), 0)

        //execute
        result = await wasmClient.execute(aliceInWASM.address.toString(), wasmCounter.contractAddress, { "add_counter_for_evm": { evm_contract: evmCounter.address, delta: "1" } }, { "amount": wasm.parseCoins("200000000000000000wei"), "gas": "20000000" })

        result = await evmCounter.count();
        expect(JSON.stringify(result), 0)
    })


})