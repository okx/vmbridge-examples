/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
    solidity: "0.8.17",
    networks: {
        hardhat: {
        },
        OKCTest: {
            url: "https://exchaintestrpc.okex.org",
            accounts: [process.env.TEST_USER1_PRIVATE_KEY]
        },
        localHost: {
            url: "http://localhost:8545",
            accounts: [process.env.TEST_USER1_PRIVATE_KEY]
        },
    }
};
