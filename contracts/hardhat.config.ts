import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import '@typechain/hardhat'
import './tasks'
import dotenv from 'dotenv'
import type { HardhatUserConfig } from 'hardhat/types'

dotenv.config()

const { PRIVATE_KEY } = process.env

export default <HardhatUserConfig>{
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
        details: { yul: false },
      },
    },
  },
  defaultNetwork: "calibrationnet",
  networks: {
    localnet: {
      chainId: 31415926,
      url: "http://127.0.0.1:1234/rpc/v1",
      accounts: [PRIVATE_KEY],
    },
    calibrationnet: {
      chainId: 314159,
      url: "https://api.calibration.node.glif.io/rpc/v1",
      accounts: [PRIVATE_KEY],
    },
    filecoinmainnet: {
      chainId: 314,
      url: "https://api.node.glif.io",
      accounts: [PRIVATE_KEY],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}
