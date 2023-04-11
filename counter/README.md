# vmbridge-examples
This project is a sample contract using the OKC VM bridge function, through which the user can realize the mutual call of messages between EVM and WASM. Users can modify the deployment contract according to their needs. This item is for user reference only
## 1、before starting
a. rename .env.example to .env and add your private key and RPC point.

b. Start the local okc network or directly link to the test network.

## 2、Compile the wasm contract
```
$ cd project/WASMContract

$ RUSTFLAGS='-C link-arg=-s' cargo wasm
```
You can also compile in other ways, but make sure the generated files are in the path `project/WASMContract/target/wasm32-unknown-unknown/release/`

## 3、Deploy and test
```
$ cd project

$ npm install

$ npx hardhat test scripts/test.js
```
## principle
`evm=>cm`

After receiving the EVM specific event `__OKCCallToWasm`, the OKC will trigger a CM transaction to call the specified address

`cm=>evm`

when receiving the `CosmosMsg::Custom(CallToEvmMsg)` message sent by the CM, the VM bridge will trigger a evm transaction to call the specified address
