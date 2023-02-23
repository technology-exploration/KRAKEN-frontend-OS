import assert from 'assert-diff'

import reducer, { initialState } from '$mp/modules/global/reducer'
import * as constants from '$mp/modules/global/constants'

describe('global - reducer', () => {
    it('has initial state', () => {
        assert.deepStrictEqual(reducer(undefined, {}), initialState)
    })

    describe('GET_DATA_USD_RATE', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                fetchingdataPerEurRate: true,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_DATA_USD_RATE_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const dataPerUsd = 1
            const expectedState = {
                ...initialState,
                dataPerUsd,
                dataPerEurRateError: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_DATA_USD_RATE_SUCCESS,
                payload: {
                    dataPerUsd,
                },
            }), expectedState)
        })

        it('handles failure', () => {
            const errorMessage = 'error'

            const expectedState = {
                ...initialState,
                dataPerUsd: null,
                fetchingdataPerEurRate: false,
                dataPerEurRateError: {
                    message: errorMessage,
                },
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.GET_DATA_USD_RATE_FAILURE,
                payload: {
                    error: {
                        message: errorMessage,
                    },
                },
            }), expectedState)
        })
    })

    describe('CHECK_ETHEREUM_NETWORK', () => {
        it('handles request', () => {
            const expectedState = {
                ...initialState,
                ethereumNetworkIsCorrect: null,
                checkingNetwork: true,
                ethereumNetworkError: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.CHECK_ETHEREUM_NETWORK_REQUEST,
                payload: {},
            }), expectedState)
        })

        it('handles success', () => {
            const expectedState = {
                ...initialState,
                ethereumNetworkIsCorrect: true,
                checkingNetwork: false,
                ethereumNetworkError: null,
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.CHECK_ETHEREUM_NETWORK_SUCCESS,
                payload: {},
            }), expectedState)
        })

        it('handles failure', () => {
            const errorMessage = 'error'

            const expectedState = {
                ...initialState,
                ethereumNetworkIsCorrect: false,
                checkingNetwork: false,
                ethereumNetworkError: {
                    message: errorMessage,
                },
            }

            assert.deepStrictEqual(reducer(undefined, {
                type: constants.CHECK_ETHEREUM_NETWORK_FAILURE,
                payload: {
                    error: {
                        message: errorMessage,
                    },
                },
            }), expectedState)
        })
    })
})
