// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleSignatureVerifier {
    // Verifies that the provided signature matches the given address
    function verifySignature(address _signer, string memory _message, bytes memory _signature) public pure returns (bool) {
        // Hash the message
        bytes32 messageHash = getMessageHash(_message);
        // Convert the message hash to Ethereum Signed Message hash
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        // Recover the signer address from the signature
        return recoverSigner(ethSignedMessageHash, _signature) == _signer;
    }

    // Helper function to hash the message
    function getMessageHash(string memory _message) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_message));
    }

    // Helper function to get the Ethereum Signed Message hash
    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    // Recover the signer from the signature
    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    // Split the signature into r, s, and v components
    function splitSignature(bytes memory _signature) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(_signature.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(_signature, 0x20))
            s := mload(add(_signature, 0x40))
            v := byte(0, mload(add(_signature, 0x60)))
        }

        return (r, s, v);
    }
}
