/* eslint-disable no-unused-vars */
// @flow

import { createAction } from 'redux-actions'
import { denormalize } from 'normalizr'

import { dataUnionSchema, dataUnionsSchema, productsSchema } from '$shared/modules/entities/schema'
import { handleEntities } from '$shared/utils/entities'
import type { ErrorInUi, ReduxActionCreator } from '$shared/flowtype/common-types'
import type { DataUnionId, DataUnionSecretId, ProductIdList } from '$mp/flowtype/product-types'
import { selectEntities } from '$shared/modules/entities/selectors'
import { isDataUnionProduct } from '$mp/utils/product'
import { isEthereumAddress } from '$mp/utils/validate'
import * as services from './services'
import {
    GET_DATA_UNION_REQUEST,
    GET_DATA_UNION_SUCCESS,
    GET_DATA_UNION_FAILURE,
    GET_DATA_UNION_STATS_REQUEST,
    GET_DATA_UNION_STATS_SUCCESS,
    GET_DATA_UNION_STATS_FAILURE,
    SET_DATA_UNION_SECRETS,
    ADD_DATA_UNION_SECRET,
    REMOVE_DATA_UNION_SECRET,
    GET_ALL_DATA_UNION_STATS_REQUEST,
    RESET_DATA_UNION,
    RESET_DATA_UNION_STATS,
} from './constants'
import type {
    DataUnionIdActionCreator,
    DataUnionIdsActionCreator,
    DataUnionErrorActionCreator,
    DataUnionsErrorActionCreator,
    DataUnionSecretsActionCreator,
    DataUnionSecretActionCreator,
} from './types'
import { selectDataUnionDeployedIds } from './selectors'

const getDataUnionRequest: DataUnionIdActionCreator = createAction(
    GET_DATA_UNION_REQUEST,
    (id: DataUnionId) => ({
        id,
    }),
)

const getDataUnionSuccess: DataUnionIdActionCreator = createAction(
    GET_DATA_UNION_SUCCESS,
    (id: DataUnionId) => ({
        id,
    }),
)

const getDataUnionFailure: DataUnionErrorActionCreator = createAction(
    GET_DATA_UNION_FAILURE,
    (id: DataUnionId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

let dataUnionStatsCancel = () => null

const getDataUnionStatsRequest: DataUnionIdActionCreator = createAction(
    GET_DATA_UNION_STATS_REQUEST,
    (id: DataUnionId) => ({
        id,
    }),
)

const getDataUnionStatsSuccess: DataUnionIdActionCreator = createAction(
    GET_DATA_UNION_STATS_SUCCESS,
    (id: DataUnionId) => ({
        id,
    }),
)

const getDataUnionStatsFailure: DataUnionErrorActionCreator = createAction(
    GET_DATA_UNION_STATS_FAILURE,
    (id: DataUnionId, error: ErrorInUi) => ({
        id,
        error,
    }),
)

export const setDataUnionSecrets: DataUnionSecretsActionCreator = createAction(
    SET_DATA_UNION_SECRETS,
    (id: DataUnionId, secrets: Array<DataUnionSecretId>) => ({
        id,
        secrets,
    }),
)

export const addDataUnionSecret: DataUnionSecretActionCreator = createAction(
    ADD_DATA_UNION_SECRET,
    (id: DataUnionId, secret: DataUnionSecretId) => ({
        id,
        secret,
    }),
)

export const removeDataUnionSecret: DataUnionSecretActionCreator = createAction(
    REMOVE_DATA_UNION_SECRET,
    (id: DataUnionId, secret: DataUnionSecretId) => ({
        id,
        secret,
    }),
)

// const getAllDataUnionsRequest: ReduxActionCreator = createAction(GET_ALL_DATA_UNIONS_REQUEST)

// const getAllDataUnionsSuccess: DataUnionIdsActionCreator = createAction(
//     GET_ALL_DATA_UNIONS_SUCCESS,
//     (ids: Array<DataUnionId>) => ({
//         ids,
//     }),
// )

// const getAllDataUnionsFailure: DataUnionsErrorActionCreator = createAction(
//     GET_ALL_DATA_UNIONS_FAILURE,
//     (error: ErrorInUi) => ({
//         error,
//     }),
// )

export const getDataUnionById = (id: DataUnionId) => async (dispatch: Function) => {
    dispatch(getDataUnionRequest(id))

    try {
        const result = await services.getDataUnion(id, true)
        handleEntities(dataUnionSchema, dispatch)(result)
        dispatch(getDataUnionSuccess(id))
    } catch (e) {
        dispatch(getDataUnionFailure(id, e))
    }
}

export const getDataUnionStats = (id: DataUnionId) => async (dispatch: Function) => {
    dispatch(getDataUnionStatsRequest(id))

    try {
        const result = await services.getDataUnionStats(id)
        result.id = id
        handleEntities(dataUnionSchema, dispatch)(result)
        dispatch(getDataUnionStatsSuccess(id))
    } catch (e) {
        dispatch(getDataUnionStatsFailure(id, e))
    }
}

export const startUpdateDataUnionStats = (ids: Array<DataUnionId>) => (dispatch: Function) => {
    let cancelled = false

    const fetchStats = async () => {
        for (let index = 0; index < ids.length && !cancelled; index += 1) {
            try {
                // eslint-disable-next-line no-await-in-loop
                await dispatch(getDataUnionStats(ids[index]))
            } catch (e) {
                // ignore error and continue
            }
        }
    }

    fetchStats()

    return () => {
        cancelled = true
    }
}

const getAllDataUnionStatsRequest: DataUnionIdsActionCreator = createAction(
    GET_ALL_DATA_UNION_STATS_REQUEST,
    (ids: Array<DataUnionId>) => ({
        ids,
    }),
)

// export const getAllDataUnions = () => async (dispatch: Function) => {
//     dispatch(getAllDataUnionsRequest())

//     try {
//         const result = await services.getDataUnions()
//         const ids = handleEntities(dataUnionsSchema, dispatch)(result)
//         dispatch(getAllDataUnionsSuccess(ids))
//     } catch (e) {
//         dispatch(getAllDataUnionsFailure(e))
//     }
// }

export const updateDataUnionStats = (productIds: ProductIdList) => (dispatch: Function, getState: Function) => {
    dataUnionStatsCancel()

    const state = getState()
    const entities = selectEntities(state)
    const products = denormalize(productIds, productsSchema, entities)
    const alreadyLoaded = new Set(selectDataUnionDeployedIds(state))

    const dataUnionIds = (products || [])
        .reduce((result, { type, beneficiaryAddress }) => {
            const id = (beneficiaryAddress || '').toLowerCase()

            if (isDataUnionProduct(type) && isEthereumAddress(id) && !alreadyLoaded.has(id)) {
                return [
                    ...result,
                    id,
                ]
            }

            return result
        }, [])

    dispatch(getAllDataUnionStatsRequest(dataUnionIds))
    dataUnionStatsCancel = dispatch(startUpdateDataUnionStats(dataUnionIds))
}
