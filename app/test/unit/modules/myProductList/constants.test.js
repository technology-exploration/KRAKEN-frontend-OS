import * as constants from '$mp/modules/myProductList/constants'

describe('myProductList - constants', () => {
    it('is namespaced correctly', () => {
        Object.keys(constants).forEach((key) => {
            expect(constants[key]).toEqual(expect.stringMatching(/^marketplace\/myProductList\//))
        })
    })
})
