// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/**
 * @title String helper
 * @author OKC-Application smart contract team
 * @notice You can use this contract to convert string to hex string
 */
contract StringHelper {
    /**
     * @notice Convert string to hex string
     * @param _str The string you want get hex string
     * @return Hex parameters of 'invoke'
     */
    function stringToHexString(
        string memory _str
    ) public pure returns (string memory) {
        bytes memory bytes_str = abi.encodePacked(_str);
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(bytes_str.length * 2);

        for (uint i = 0; i < bytes_str.length; i++) {
            str[0 + i * 2] = alphabet[uint(uint8(bytes_str[i] >> 4))];
            str[1 + i * 2] = alphabet[uint(uint8(bytes_str[i] & 0x0f))];
        }
        return string(str);
    }
}
