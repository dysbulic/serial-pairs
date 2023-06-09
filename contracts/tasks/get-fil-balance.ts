import { task } from 'hardhat/config'
import { formatEther } from 'ethers'

task(
  "get-fil-balance",
  "Displays the amount of Filecoin held by the account.",
)
.addOptionalParam(
  "account",
  "The address of the account you want the balance for",
)
.setAction(async ({ account }, { ethers, network, getNamedAccounts }) => {
  if (!account) {
    ({ deployer: account } = (await getNamedAccounts()))
  }
  console.log(`${account}’s ${network.name} Balance:`)
  const balance = await ethers.provider.getBalance(account)
  const currency = `${network.config.chainId !== 314 ? 't' : ''}FIL`
  // passing `balance` straight in causes an invalid BigNumberish value error
  console.log(`  ${formatEther(balance.toString())}${currency}`)
})
