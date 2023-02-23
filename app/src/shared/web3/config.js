// @flow

import type { SmartContractConfig, SmartContractMetadata } from '$shared/flowtype/web3-types'
import marketplaceAbi from './abis/marketplace'
import tokenAbi from './abis/token'
import uniswapAdaptorAbi from './abis/uniswapAdaptor'
import communityProductMetadata from './contracts/communityProduct'
import dataUnionSidechainAbi from './abis/dataunionSidechain'

type SidechainConfig = {
    chainId: string,
    rpcUrl: string,
    dataUnionAbi: string,
}
type Config = {
    networkId: string,
    publicNodeAddress: string,
    websocketAddress: string,
    transactionConfirmationBlocks: number,
    marketplace: SmartContractConfig,
    dataToken: SmartContractConfig,
    daiToken: SmartContractConfig,
    communityProduct: SmartContractMetadata,
    uniswapAdaptor: SmartContractConfig,
    sidechain: SidechainConfig,
}

const getConfig = (): Config => ({
    networkId: process.env.WEB3_REQUIRED_NETWORK_ID || '',
    publicNodeAddress: process.env.WEB3_PUBLIC_HTTP_PROVIDER || '',
    websocketAddress: process.env.WEB3_PUBLIC_WS_PROVIDER || '',
    transactionConfirmationBlocks: parseInt(process.env.WEB3_TRANSACTION_CONFIRMATION_BLOCKS, 10) || 24,
    dataToken: {
        abi: tokenAbi,
        address: process.env.DATA_TOKEN_CONTRACT_ADDRESS || '',
    },
    daiToken: {
        abi: tokenAbi,
        address: process.env.DAI_TOKEN_CONTRACT_ADDRESS || '',
    },
    marketplace: {
        abi: marketplaceAbi,
        address: process.env.MARKETPLACE_CONTRACT_ADDRESS || '',
    },
    communityProduct: {
        abi: communityProductMetadata.abi,
        bytecode: communityProductMetadata.bytecode,
    },
    uniswapAdaptor: {
        abi: uniswapAdaptorAbi,
        address: process.env.UNISWAP_ADAPTOR_CONTRACT_ADDRESS || '',
    },
    sidechain: {
        chainId: process.env.SIDECHAIN_CHAIN_ID || '',
        rpcUrl: process.env.SIDECHAIN_HTTP_PROVIDER || '',
        dataUnionAbi: dataUnionSidechainAbi,
    },
})

export default getConfig
