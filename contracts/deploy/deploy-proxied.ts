import chalk from 'chalk'

export default async (
  { deployments: { deploy }, getNamedAccounts }
) => {
  const contractName = 'RecordingsTracker'
  const { deployer } = await getNamedAccounts()

  const deployment = (
    await deploy(contractName, {
      from: deployer,
      proxy: true,
      args: ['¡Yo! '],  
    })
  )

  // console.info(`${chalk.cyan(deployer)} deployed ${chalk.greenBright(contractName)}`)
  // console.info(` ${chalk.hex('#FE4B03')('proxied')} from ${chalk.hex('#EB6300')(deployment.address)}`)
  // console.info(` chalk.hex('#5DBCFA')('implemented') at ${chalk.hex('#5DBCFA')(deployment.implementation)}`)
  // console.info(` in ${chalk.hex('#AD3FF1')(`transaction ${deployment.receipt.transactionHash}`)}`)
  // console.info(` for ${chalk.hex('#EBC500')(`${deployment.receipt.gasUsed} gas`)}`)
  console.info(`${deployer} deployed ${contractName}`)
  console.info(` proxied from ${deployment.address}`)
  console.info(` implemented at ${deployment.implementation}`)
  console.info(` in transaction ${deployment.receipt.transactionHash}`)
  console.info(` for ${deployment.receipt.gasUsed} gas`)
}
