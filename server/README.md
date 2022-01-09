# server

## Blockchain

### Geth

**Attach to ganache blockchain**
```shell
$ geth attach http://127.0.0.1:8545
```

**Get account balance**
```shell
$ web3.eth.getBalance(<account_address>)
```

**Get block by block number**
```shell
$ web3.eth.getBlock(<block_number>)
```

**Get block by block hash**
```shell
$ web3.eth.getBlockByHash(<block_hash>)
```

**Get transaction by hash**
```shell
$ web3.eth.getTransaction(<transaction_hash>)
```

**Get transaction receipt by transaction hash**
```shell
$ web3.eth.getTransactionReceipt(<transaction_hash>)
```

**Transaction input toAscii**
```shell
$ web3.toAscii(<transaction_input>)
```
