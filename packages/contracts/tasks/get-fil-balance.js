task(
  "get-fil-balance",
  "Displays the amount of Filecoin held by the account.",
)
.addOptionalParam(
  "account",
  "The address of the account you want the balance for",
)
.setAction(async ({ account }) => {
  if(!account) {
    const [PRIVATE_KEY] = network.config.accounts
    const deployer = new ethers.Wallet(PRIVATE_KEY)
    account = deployer.address
  }
  console.log(`${account}’s ${network.name} Balance:`)
  const balance = await ethers.provider.getBalance(account)
  const currency = `${network.config.chainId !== 314 ? 't' : ''}FIL`
  console.log(`  ${ethers.utils.formatEther(balance)}${currency}`)
})
