import assert from 'assert-diff'

import * as all from '$mp/modules/global/selectors'

const state = {
    global: {
        dataPerUsd: 1,
        ethereumNetworkIsCorrect: true,
        checkingNetwork: false,
        fetchingdataPerEurRate: false,
        ethereumNetworkError: null,
        dataPerEurRateError: null,
    },
}

describe('global - selectors', () => {
    it('selects dataPerUsd', () => {
        assert.deepStrictEqual(all.selectdataPerEur(state), state.global.dataPerUsd)
    })

    it('selects dataPerUsd error', () => {
        assert.deepStrictEqual(all.selectdataPerEurError(state), null)
    })

    it('selects network is correct', () => {
        assert.deepStrictEqual(all.selectEthereumNetworkIsCorrect(state), true)
    })

    it('selects network error', () => {
        assert.deepStrictEqual(all.selectEthereumNetworkError(state), null)
    })
})
