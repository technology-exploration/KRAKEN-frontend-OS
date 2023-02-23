// @flow

import { createAction } from 'redux-actions'

import type { NumberString, ReduxActionCreator, ErrorInUi } from '$shared/flowtype/common-types'
import type TransactionError from '$shared/errors/TransactionError'

import {
    GET_DATA_USD_RATE_REQUEST,
    GET_DATA_USD_RATE_SUCCESS,
    GET_DATA_USD_RATE_FAILURE,
    CHECK_ETHEREUM_NETWORK_REQUEST,
    CHECK_ETHEREUM_NETWORK_SUCCESS,
    CHECK_ETHEREUM_NETWORK_FAILURE,
} from './constants'
import type { dataPerEurActionCreator, GlobalEthereumErrorActionCreator } from './types'
import * as services from './services'

const getdataPerEurRequest: ReduxActionCreator = createAction(GET_DATA_USD_RATE_REQUEST)

const getdataPerEurSuccess: dataPerEurActionCreator = createAction(
    GET_DATA_USD_RATE_SUCCESS,
    (dataPerUsd: NumberString) => ({
        dataPerUsd,
    }),
)

const getdataPerEurError: GlobalEthereumErrorActionCreator = createAction(
    GET_DATA_USD_RATE_FAILURE,
    (error: TransactionError) => ({
        error,
    }),
)

export const getdataPerEur = () => (dispatch: Function) => {
    dispatch(getdataPerEurRequest())
    return services
        .getdataPerEur()
        .then(
            (dataPerUsd: NumberString) => dispatch(getdataPerEurSuccess(dataPerUsd)),
            (error: TransactionError) => {
                dispatch(getdataPerEurError({
                    message: error.message,
                }))
            },
        )
}

const checkEthereumNetworkRequest: ReduxActionCreator = createAction(CHECK_ETHEREUM_NETWORK_REQUEST)

const checkEthereumNetworkSuccess: ReduxActionCreator = createAction(CHECK_ETHEREUM_NETWORK_SUCCESS)

const checkEthereumNetworkError: GlobalEthereumErrorActionCreator = createAction(
    CHECK_ETHEREUM_NETWORK_FAILURE,
    (error: ErrorInUi) => ({
        error,
    }),
)

export const checkEthereumNetwork = () => (dispatch: Function) => {
    dispatch(checkEthereumNetworkRequest())
    return services
        .checkEthereumNetworkIsCorrect()
        .then(
            () => dispatch(checkEthereumNetworkSuccess()),
            (error: TransactionError) => {
                dispatch(checkEthereumNetworkError({
                    message: error.message,
                }))
            },
        )
}
