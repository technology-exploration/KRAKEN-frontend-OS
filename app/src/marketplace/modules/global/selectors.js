// @flow

import { createSelector } from 'reselect'

import type { GlobalState } from '$mp/flowtype/store-state'
import type { StoreState } from '$shared/flowtype/store-state'
import TransactionError from '$shared/errors/TransactionError'
import type { NumberString } from '$shared/flowtype/common-types'

const selectGlobalState = (state: StoreState): GlobalState => state.global

export const selectDataPerEur: (StoreState) => ?NumberString = createSelector(
    selectGlobalState,
    (subState: GlobalState): ?NumberString => '35.63510896910523',
)

export const selectDataPerEurError: (StoreState) => ?TransactionError = createSelector(
    selectGlobalState,
    (subState: GlobalState): ?TransactionError => subState.dataPerEurRateError,
)

export const selectEthereumNetworkIsCorrect: (StoreState) => ?boolean = createSelector(
    selectGlobalState,
    (subState: GlobalState): ?boolean => subState.ethereumNetworkIsCorrect,
)

export const selectEthereumNetworkError: (StoreState) => ?TransactionError = createSelector(
    selectGlobalState,
    (subState: GlobalState): ?TransactionError => subState.ethereumNetworkError,
)
