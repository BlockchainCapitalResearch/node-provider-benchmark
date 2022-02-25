import { providers } from '../providers'
import { ProviderMetadata } from '../types/provider'
import { runTestAndReport } from './runner'
import { abi as ERC20 } from '@openzeppelin/contracts/build/contracts/ERC20.json'
import { Contract } from 'ethers'

export const runBenchmarks = async () => {
  await Promise.all(
    providers.map(async (providerMetadata: ProviderMetadata) => {
      const erc20: Contract = new Contract(
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        ERC20,
        providerMetadata.provider,
      )
      await Promise.all([
        runTestAndReport(providerMetadata, 10, 'getBlockNumber', () =>
          providerMetadata.provider.getBlockNumber(),
        ),
        runTestAndReport(providerMetadata, 10, 'getBlock', () =>
          providerMetadata.provider.getBlock(14000000),
        ),
        runTestAndReport(providerMetadata, 10, 'getBalance', () =>
          providerMetadata.provider.getBalance(
            '0x5337122c6b5ce24D970Ce771510D22Aeaf038C44',
          ),
        ),
        runTestAndReport(
          providerMetadata,
          10,
          'getBalanceERC20(eth_call)',
          () => erc20.balanceOf('0x5337122c6b5ce24D970Ce771510D22Aeaf038C44'),
        ),
        // this thing isnt returning anything... switch to uni router or something
        runTestAndReport(providerMetadata, 10, 'getLogs_erc20', () =>
          providerMetadata.provider.getLogs(
            erc20.filters.Transfer(
              '0xdAE2E842b26dF1968D587F73d7475fA4Fbaf5c20',
            ),
          ),
        ),
      ])
    }),
  )
}
