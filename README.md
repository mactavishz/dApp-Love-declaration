# dApp-Love-declaration

## Brief Introduction

A dApp deployed on Nebulas[](https://nebulas.io/) Mainnet.

Check live demo on https://mactaivsh.github.io/dApp-Love-declaration/

Use Wallet address as a unique key to store single message on blockchain (a key-value storage system like eg:redis).

Generated QR Code which contains a link ends with a `wallet hash` query string can be shared to check the result early operated on the Nebulas blockchain.

Note: due to being a fast prototype, the code is not elegant, please do not tangle in this.


## Contract api

| Method | Arguments |
| ------ | --------- |
| setProposal | [time(millisecond), message(string)] |
| getProposal | [walletAddress(hash string)] |

Note: All the arugments of the contract api must be a JSON String

## Web Transaction SDK

See [nebpay](https://github.com/nebulasio/nebPay)
