# Chainlink Data Feed Sample

This repository contains example of data feed from Chainlink Oracle.

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Features](#features)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Example of data feed from Chainlink Oracle.

## Technologies

The following technologies are used in this project:

- Solidity
- Chainlink Oracle

## Features

Just an example that performs following:

- **Contract**: Create contract and specify AggregatorV3Interface.
- **Constructor**: Specify in constructor interface address according to required Aggregator pair (in this example BTC/USD).
- **GetChainlinkDataFeedLatestAnswer**: Return latest data feed from the aggregator.

## Getting Started

To get started with this project, fork or clone the repository:

```bash
   git clone https://github.com/st-mn/chainlink-feed-sample.git
```

To test in remix go to:

- https://remix.ethereum.org/
- Open from Github
- https://github.com/st-mn/chainlink-feed-sample/blob/main/DataConsumerV3.sol

Note you will require ether to cover gas cost of deployment of the contact and sending transactions.

## Contributing

Contributions are welcome! If you have any ideas or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.


