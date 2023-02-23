/* eslint-disable no-console */
// @flow

// import EventEmitter from 'events'
import StreamrClient from 'streamr-client'
import Web3 from 'web3'
import BN from 'bignumber.js'
import { deploy, getContract, call, send } from '$mp/utils/smartContract'
import getConfig from '$shared/web3/config'
import { getBlockNumberForTimestamp } from '$shared/utils/ethereum'

import type { SmartContractDeployTransaction, SmartContractTransaction, Address } from '$shared/flowtype/web3-types'
import type { Stream, NewStream } from '$shared/flowtype/stream-types'
import type { ProductId, DataUnionId } from '$mp/flowtype/product-types'
import type { Permission } from '$userpages/flowtype/permission-types'
import type { ApiResult } from '$shared/flowtype/common-types'

import { post, del, get, put } from '$shared/utils/api'
import { postStream, getStream } from '$userpages/modules/userPageStreams/services'
import {
    getResourcePermissions,
    addResourcePermission,
    removeResourcePermission,
} from '$userpages/modules/permission/services'
import { getWeb3, getPublicWeb3 } from '$shared/web3/web3Provider'
// import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
// import TransactionError from '$shared/errors/TransactionError'
// import Transaction from '$shared/utils/Transaction'
import routes from '$routes'
import type { Secret } from './types'

export const getStreamrEngineAddresses = (): Array<string> => {
    const addressesString = process.env.STREAMR_ENGINE_NODE_ADDRESSES || ''
    const addresses = addressesString.split(',')
    return addresses
}
type CreateClient = {
    usePublicNode?: boolean,
}

function createClient({ usePublicNode = false }: CreateClient = {}) {
    return new StreamrClient({
        url: process.env.STREAMR_WS_URL,
        restUrl: process.env.STREAMR_API_URL,
        tokenAddress: process.env.DATA_TOKEN_CONTRACT_ADDRESS,
        tokenAddressSidechain: process.env.DATA_TOKEN_SIDECHAIN_ADDRESS,
        dataUnion: {
            factoryMainnetAddress: process.env.DATA_UNION_FACTORY_MAINNET_ADDRESS,
            factorySidechainAddress: process.env.DATA_UNION_FACTORY_SIDECHAIN_ADDRESS,
            templateMainnetAddress: process.env.DATA_UNION_TEMPLATE_MAINNET_ADDRESS,
            templateSidechainAddress: process.env.DATA_UNION_TEMPLATE_SIDECHAIN_ADDRESS,
        },
        autoConnect: false,
        autoDisconnect: false,
        auth: {
            ethereum: usePublicNode ? undefined : getWeb3().currentProvider,
        },
        sidechain: {
            url: process.env.SIDECHAIN_HTTP_PROVIDER,
            chainId: parseInt(process.env.SIDECHAIN_CHAIN_ID, 10),
        },
        mainnet: {
            url: process.env.MAINNET_HTTP_PROVIDER,
        },
        streamrNodeAddress: getStreamrEngineAddresses()[0],
    })
}

// ----------------------
// transactions
// ----------------------

// type DeployDataUnion = {
//     productId: ProductId,
//     adminFee: string,
// }

// export const deployDataUnion = ({ productId, adminFee }: DeployDataUnion): SmartContractTransaction => {
//     const web3 = getWeb3()
//     const emitter = new EventEmitter()
//     const errorHandler = (error: Error) => {
//         emitter.emit('error', error)
//     }
//     const tx = new Transaction(emitter)

//     const client = createClient()

//     Promise.all([
//         web3.getDefaultAccount(),
//         checkEthereumNetworkIsCorrect(web3),
//     ])
//         .then(([account]) => {
//             console.log('account', account)
//             console.log('productId', productId)
//             // eslint-disable-next-line no-underscore-dangle
//             const dataUnion = client._getDataUnionFromName({
//                 dataUnionName: productId,
//                 deployerAddress: account,
//             })

//             console.log('get address: ', dataUnion)
//             return dataUnion.getAddress()
//         })
//         .then((futureAddress) => {
//             console.log('future address: ', futureAddress)
//             // send calculated contract address as the transaction hash,
//             // streamr-client doesn't tell us the actual tx hash
//             emitter.emit('transactionHash', futureAddress)

//             return client.deployDataUnion({
//                 dataUnionName: productId,
//                 adminFee: +adminFee,
//             })
//         })
//         .then((dataUnion) => {
//             if (!dataUnion || !dataUnion.contractAddress) {
//                 errorHandler(new TransactionError('Transaction failed'))
//             } else {
//                 emitter.emit('receipt', {
//                     contractAddress: dataUnion.getAddress(),
//                 })
//             }
//         }, errorHandler)
//         .catch(errorHandler)

//     return tx
// }

export const createJoinPartStream = async (account: Address, productId: ProductId): Promise<Stream> => {
    const newStream: NewStream = {
        id: `${account}/dataunions/${productId}/joinPartStream`,
        description: 'Automatically created JoinPart stream for data union',
    }
    await newStream
    let stream
    try {
        try {
            // eslint-disable-next-line no-console
            console.log('stream: ', stream)
            stream = await getStream(newStream.id)
                .then((res) => res)
        } finally {
            if (stream == null || stream.id == null) {
                stream = await postStream(newStream)
            }
        }
    } catch (e) {
        console.error('Could not create a new JoinPart stream or get an existing one', e)
        throw e
    }

    // Add public read permission
    try {
        await Promise.all([
            addResourcePermission({
                resourceType: 'STREAM',
                resourceId: stream.id,
                data: {
                    anonymous: true,
                    operation: 'stream_get',
                    user: null,
                },
            }),
            addResourcePermission({
                resourceType: 'STREAM',
                resourceId: stream.id,
                data: {
                    anonymous: true,
                    operation: 'stream_subscribe',
                    user: null,
                },
            }),
        ])
    } catch (e) {
        console.error('Could not add public read permission for JoinPart stream', e)
        throw e
    }

    // Add write permissions for all Streamr Engine nodes
    try {
        const nodeAddresses = getStreamrEngineAddresses()

        // Process node addresses and add share & write permissions for each of them.
        // We need to add permissions in series because adding them in parallel causes
        // a race condition on backend and some of the calls will fail.
        // eslint-disable-next-line no-restricted-syntax
        for (const address of nodeAddresses) {
            // Share permission is not strictly necessary but needed to avoid error when
            // removing user's share permission (must have at least one share permission)
            // eslint-disable-next-line no-await-in-loop
            await Promise.all([
                addResourcePermission({
                    resourceType: 'STREAM',
                    resourceId: stream.id,
                    data: {
                        operation: 'stream_get',
                        user: address,
                    },
                }),
                addResourcePermission({
                    resourceType: 'STREAM',
                    resourceId: stream.id,
                    data: {
                        operation: 'stream_publish',
                        user: address,
                    },
                }),
            ])
        }
    } catch (e) {
        console.error('Could not add write keys to JoinPart stream', e)
        throw e
    }

    // Remove share & edit permission to prevent deleting the stream
    try {
        const myPermissions: Array<Permission> = await getResourcePermissions({
            resourceType: 'STREAM',
            resourceId: stream.id,
        })
        const deletedTypes = new Set(['stream_edit', 'stream_delete'])
        const deletedPermissions = myPermissions.filter((p) => deletedTypes.has(p.operation))

        if (deletedPermissions && deletedPermissions.length > 0) {
            await Promise.all([
                ...deletedPermissions.map(async ({ id }) => removeResourcePermission({
                    resourceType: 'STREAM',
                    resourceId: stream.id,
                    id,
                })),
            ])
        }
    } catch (e) {
        console.error('Could not remove share permission from JoinPart stream', e)
    }

    return stream
}

export const getAdminFeeInEther = (adminFee: number) => {
    if (adminFee < 0 || adminFee > 1) {
        throw new Error(`${adminFee} is not a valid admin fee`)
    }

    const web3 = getWeb3()
    return web3.utils.toWei(`${adminFee}`, 'ether')
}

const getDataUnionObject = async (address: string, usePublicNode: boolean = false) => {
    const client = createClient({
        usePublicNode,
    })
    const dataUnion = await client.safeGetDataUnion(address)
    const version = await dataUnion.getVersion()
    if (version !== 2) {
        throw new Error(`Unsupported DU version: ${version}`)
    }
    return dataUnion
}

const getSidechainWeb3 = () => new Web3(new Web3.providers.HttpProvider(process.env.SIDECHAIN_HTTP_PROVIDER))

export async function* getSidechainEvents(address: string, eventName: string, fromBlock: number): any {
    const dataUnion = await getDataUnionObject(address, true)
    const sidechainAddress = await dataUnion.getSidechainAddress()

    const web3 = getSidechainWeb3()
    const { sidechain } = getConfig()
    const contract = new web3.eth.Contract(sidechain.dataUnionAbi, sidechainAddress)
    const latestBlock = await web3.eth.getBlock('latest')

    // Get events in batches since xDai RPC seems to timeout if fetching too large sets
    const batchSize = 10000

    for (let blockNumber = fromBlock; blockNumber < latestBlock.number; blockNumber += (batchSize + 1)) {
        let toBlockNumber = blockNumber + batchSize
        if (toBlockNumber > latestBlock.number) {
            toBlockNumber = latestBlock.number
        }

        // eslint-disable-next-line no-await-in-loop
        const events = await contract.getPastEvents(eventName, {
            fromBlock: blockNumber,
            toBlock: toBlockNumber,
        })
        yield events
    }
}

export async function* getJoinsAndParts(id: DataUnionId, fromTimestamp: number): any {
    const web3 = getSidechainWeb3()
    const fromBlock = await getBlockNumberForTimestamp(web3, Math.floor(fromTimestamp / 1000))

    const handleEvent = async (e, type) => {
        // eslint-disable-next-line no-await-in-loop
        const block = await web3.eth.getBlock(e.blockHash)
        if (block && block.timestamp && (block.timestamp * 1000 >= fromTimestamp)) {
            const event = {
                timestamp: block.timestamp * 1000,
                diff: type === 'join' ? 1 : -1,
            }
            return event
        }

        return null
    }

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for await (const joins of getSidechainEvents(id, 'MemberJoined', fromBlock)) {
        for (const join of joins) {
            const result = await handleEvent(join, 'join')
            yield result
        }
    }

    for await (const parts of getSidechainEvents(id, 'MemberParted', fromBlock)) {
        for (const part of parts) {
            const result = await handleEvent(part, 'part')
            yield result
        }
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
}

export async function* getMemberEventsFromBlock(id: DataUnionId, blockNumber: number): any {
    const client = createClient()
    const web3 = getSidechainWeb3()

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for await (const joins of getSidechainEvents(id, 'MemberJoined', blockNumber)) {
        for (const e of joins) {
            const memberAddress = e.returnValues.member
            const block = await web3.eth.getBlock(e.blockHash)
            if (block) {
                const dataUnion = await client.safeGetDataUnion(id)
                const memberData = await dataUnion.getMemberStats(memberAddress)
                yield {
                    ...memberData,
                    address: memberAddress,
                }
            }
        }
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
}

export async function* getAllMemberEvents(id: DataUnionId): any {
    const duFirstPossibleBlock = parseInt(process.env.DATA_UNION_FACTORY_SIDECHAIN_CREATION_BLOCK, 10)
    yield* getMemberEventsFromBlock(id, duFirstPossibleBlock)
}

export const removeMembers = async (id: DataUnionId, memberAddresses: string[]) => {
    const dataUnion = await getDataUnionObject(id, true)
    const receipt = await dataUnion.removeMembers(memberAddresses)
    return receipt
}
// export const deployContract = (joinPartStreamId: string, adminFee: number): SmartContractDeployTransaction => {
export const deployContract = (id: string, adminFee: number): SmartContractDeployTransaction => {
    const operatorAddress = process.env.DATA_UNION_OPERATOR_ADDRESS
    const tokenAddress = process.env.DATA_TOKEN_CONTRACT_ADDRESS
    const blockFreezePeriodSeconds = process.env.DATA_UNION_BLOCK_FREEZE_PERIOD_SECONDS || 1
    return deploy(getConfig().communityProduct, [
        operatorAddress,
        id,
        tokenAddress,
        blockFreezePeriodSeconds,
        getAdminFeeInEther(adminFee),
    ])
}

export const getCommunityContract = (address: DataUnionId, usePublicNode: boolean = false) => {
    const { abi } = getConfig().communityProduct

    return getContract({
        abi,
        address,
    }, usePublicNode)
}

export const getDataUnionOwner = async (address: DataUnionId, usePublicNode: boolean = false) => {
    const contract = getCommunityContract(address, usePublicNode)
    const owner = await call(contract.methods.owner())

    return owner
}

export const isDataUnionDeployed = async (address: DataUnionId, usePublicNode: boolean = false) => (
    !!getDataUnionOwner(address, usePublicNode)
)

export const getAdminFee = async (address: DataUnionId, usePublicNode: boolean = false) => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()
    const contract = getCommunityContract(address, usePublicNode)
    const adminFee = await call(contract.methods.adminFee())

    return web3.utils.fromWei(web3.utils.toBN(adminFee), 'ether')
}

export const setAdminFee = (address: DataUnionId, adminFee: number): SmartContractTransaction => (
    send(getCommunityContract(address).methods.setAdminFee(getAdminFeeInEther(adminFee)))
)

export const getJoinPartStreamId = (address: DataUnionId, usePublicNode: boolean = false) =>
    call(getCommunityContract(address, usePublicNode).methods.joinPartStream())

export const getDataUnionStats = async (address: DataUnionId, usePublicNode: boolean = false): ApiResult<Object> => {
    {
        const dataUnion = await getDataUnionObject(address, usePublicNode)
        const { activeMemberCount, inactiveMemberCount, totalEarnings } = await dataUnion.getStats()

        const active = (activeMemberCount && BN(activeMemberCount.toString()).toNumber()) || 0
        const inactive = (inactiveMemberCount && BN(inactiveMemberCount.toString()).toNumber()) || 0
        return {
            memberCount: {
                active,
                inactive,
                total: active + inactive,
            },
            totalEarnings: totalEarnings && BN(totalEarnings.toString()).toNumber(),
        }
    }
}

export const getDataUnions = async (): ApiResult<Array<Object>> => {
    const { dataunions } = await get({
        url: routes.api.dataunions.index(),
        useAuthorization: false,
    })

    return Object.keys(dataunions || {}).map((id) => ({
        id: id.toLowerCase(),
        ...dataunions[id],
    }))
}

export const getDataUnion = async (id: DataUnionId, usePublicNode: boolean = true): ApiResult<Object> => {
    const adminFee = await getAdminFee(id, usePublicNode)
    const joinPartStreamId = await getJoinPartStreamId(id, usePublicNode)
    const owner = await getDataUnionOwner(id, usePublicNode)

    return {
        id,
        adminFee,
        joinPartStreamId,
        owner,
    }
}

type GetSecrets = {
    dataUnionId: DataUnionId,
}

export const getSecrets = ({ dataUnionId }: GetSecrets): ApiResult<Array<Secret>> => get({
    url: routes.api.dataunions.secrets.index({
        dataUnionId,
    }),
})

type PostSecrect = {
    dataUnionId: DataUnionId,
    name: string,
}

export const postSecret = ({ dataUnionId, name }: PostSecrect): ApiResult<Secret> => post({
    url: routes.api.dataunions.secrets.index({
        dataUnionId,
    }),
    data: {
        name,
    },
})

type PutSecrect = {
    dataUnionId: DataUnionId,
    id: string,
    name: string,
}

export const putSecret = ({ dataUnionId, id, name }: PutSecrect): ApiResult<Secret> => put({
    url: routes.api.dataunions.secrets.show({
        dataUnionId,
        id,
    }),
    data: {
        name,
    },
})

type DeleteSecrect = {
    dataUnionId: DataUnionId,
    id: string,
}

export const deleteSecret = ({ dataUnionId, id }: DeleteSecrect): ApiResult<void> => del({
    url: routes.api.dataunions.secrets.show({
        dataUnionId,
        id,
    }),
})

type GetJoinRequests = {
    dataUnionId: DataUnionId,
    params?: any,
}

export const getJoinRequests = ({ dataUnionId, params }: GetJoinRequests): ApiResult<any> => get({
    url: routes.api.dataunions.joinRequests.index({
        dataUnionId,
    }),
    options: {
        params,
    },
})

type PutJoinRequest = {
    dataUnionId: DataUnionId,
    joinRequestId: string,
    state: 'ACCEPTED' | 'REJECTED' | 'PENDING',
}

export const updateJoinRequest = async ({ dataUnionId, joinRequestId: id, state }: PutJoinRequest): ApiResult<any> => put({
    url: routes.api.dataunions.joinRequests.show({
        dataUnionId,
        id,
    }),
    data: {
        state,
    },
})

type PostJoinRequest = {
    dataUnionId: DataUnionId,
    memberAddress: Address,
}

export const addJoinRequest = async ({ dataUnionId, memberAddress }: PostJoinRequest): ApiResult<any> => post({
    url: routes.api.dataunions.joinRequests.index({
        dataUnionId,
    }),
    data: {
        memberAddress,
    },
})

type DeleteJoinRequest = {
    dataUnionId: DataUnionId,
    joinRequestId: string,
}

export const removeJoinRequest = async ({ dataUnionId, joinRequestId: id }: DeleteJoinRequest): ApiResult<void> => del({
    url: routes.api.dataunions.joinRequests.show({
        dataUnionId,
        id,
    }),
})
