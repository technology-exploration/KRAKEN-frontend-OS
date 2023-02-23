import assert from 'assert-diff'
import sinon from 'sinon'

import * as all from '$mp/modules/global/services'
import * as smartContractUtils from '$mp/utils/smartContract'
import * as getWeb3 from '$shared/web3/web3Provider'
import * as web3Utils from '$shared/utils/web3'

describe('global - services', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    afterEach(() => {
        sandbox.reset()
        sandbox.restore()
    })

    describe('getdataPerEur', () => {
        it('must call the correct method', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const balanceStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve('10000'),
            }))
            const getContractStub = sandbox.stub(smartContractUtils, 'getContract').callsFake(() => ({
                methods: {
                    dataPerUsd: balanceStub,
                },
            }))
            await all.getdataPerEur()
            assert(getContractStub.calledOnce)
            assert(getContractStub.getCall(0).args[0].abi.find((f) => f.name === 'dataPerUsd'))
            assert(balanceStub.calledOnce)
        })

        it('must transform the result from attoUnit to unit', async () => {
            sandbox.stub(getWeb3, 'default').callsFake(() => ({
                getDefaultAccount: () => Promise.resolve('testAccount'),
            }))
            const dataPerEurStub = sandbox.stub().callsFake(() => ({
                call: () => Promise.resolve(('209000000000000000000').toString()),
            }))
            sandbox.stub(smartContractUtils, 'getContract').callsFake(() => ({
                methods: {
                    dataPerUsd: dataPerEurStub,
                },
            }))
            const result = await all.getdataPerEur()
            assert.equal(209, result)
        })
    })

    describe('checkEthereumNetworkIsCorrect', () => {
        it('must call checkEthereumNetworkIsCorrect util', () => {
            sandbox.stub(getWeb3, 'default').callsFake()
            const getContractStub = sandbox.stub(web3Utils, 'checkEthereumNetworkIsCorrect').callsFake(() => {})

            all.checkEthereumNetworkIsCorrect()
            assert(getContractStub.calledOnce)
        })
    })
})
