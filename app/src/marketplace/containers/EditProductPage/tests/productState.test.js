import { productStates } from '$shared/utils/constants'
import { productTypes } from '$mp/utils/constants'
import * as State from '../state'

describe('Product State', () => {
    describe('isPublished', () => {
        it('detects published state', () => {
            expect(State.isPublished({
                state: productStates.DEPLOYED,
            })).toBe(true)
            expect(State.isPublished({
                state: productStates.DEPLOYING,
            })).toBe(true)
            expect(State.isPublished({
                state: productStates.NOT_DEPLOYED,
            })).toBe(false)
            expect(State.isPublished({
                state: productStates.UNDEPLOYING,
            })).toBe(false)
        })

        it('detects published state for empty product', () => {
            expect(State.isPublished({})).toBe(false)
            expect(State.isPublished(undefined)).toBe(false)
        })
    })

    describe('getPendingObject', () => {
        it('returns only the allowed fields', () => {
            const allowed = Object.fromEntries(State.PENDING_CHANGE_FIELDS.map((key) => [key, key]))
            const notAllowed = Object.fromEntries(['id', 'newImageToUpload', 'state'].map((key) => [key, key]))

            expect(State.getPendingObject({
                ...allowed,
                ...notAllowed,
            })).toMatchObject(allowed)
        })

        it('it returns only defined values', () => {
            expect(State.getPendingObject({
                id: '1',
                name: 'new name',
                description: 'new description',
                imageUrl: undefined,
                thumbnailUrl: undefined,
                streams: [],
                previewStream: '',
                updated: '2019-10-01 09:51:00',
                adminFee: '0.1',
            })).toMatchObject({
                name: 'new name',
                description: 'new description',
                streams: [],
                previewStream: '',
                adminFee: '0.1',
            })
        })

        it('it supports nested fields', () => {
            expect(State.getPendingObject({
                id: '1',
                name: 'new name',
                description: 'new description',
                imageUrl: undefined,
                thumbnailUrl: undefined,
                streams: [],
                previewStream: '',
                updated: '2019-10-01 09:51:00',
                adminFee: '0.1',
                contact: {
                    email: 'a@b.com',
                    social1: 'http://social1.com',
                    invalid: 1337,
                },
            })).toMatchObject({
                name: 'new name',
                description: 'new description',
                streams: [],
                previewStream: '',
                adminFee: '0.1',
                contact: {
                    email: 'a@b.com',
                    social1: 'http://social1.com',
                },
            })
        })
    })

    describe('getChangeObject', () => {
        it('returns the changed fields', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
            }
            expect(State.getChangeObject(product, {
                id: '2',
                name: 'New Name',
                state: 'DEPLOYED',
            })).toMatchObject({
                name: 'New Name',
            })
        })

        it('returns the changed fields for stream arrays', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
                streams: ['1', '2'],
            }
            expect(State.getChangeObject(product, {
                id: '2',
                name: 'New Name',
                state: 'DEPLOYED',
                streams: ['1', '3'],
            })).toMatchObject({
                name: 'New Name',
                streams: ['1', '3'],
            })
        })

        it('returns the changed fields for contact details', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
                contact: {
                    email: 'tester1@streamr.com',
                    url: 'http://streamr.network',
                },
            }
            expect(State.getChangeObject(product, {
                id: '2',
                name: 'New Name',
                state: 'DEPLOYED',
                contact: {
                    email: 'tester2@streamr.com',
                    url: 'http://streamr.network',
                },
            })).toMatchObject({
                name: 'New Name',
                contact: {
                    email: 'tester2@streamr.com',
                },
            })
        })

        it('returns the changed fields for contact details if they are not in the same order', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
                contact: {
                    social1: 'twitter',
                    url: 'http://streamr.network',
                    email: 'tester1@streamr.com',
                },
            }

            expect(State.getChangeObject(product, {
                id: '2',
                name: 'New Name',
                state: 'DEPLOYED',
                contact: {
                    email: 'tester2@streamr.com',
                    url: 'http://streamr.network',
                    social1: 'facebook',
                },
            })).toMatchObject({
                name: 'New Name',
                contact: {
                    social1: 'facebook',
                    email: 'tester2@streamr.com',
                },
            })
        })
    })

    describe('update', () => {
        it('updates unpublished product', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
            }
            expect(State.update(product, (p) => ({
                ...p,
                name: 'newName',
                description: 'A better description',
            }))).toMatchObject({
                id: '1',
                name: 'newName',
                description: 'A better description',
                state: productStates.NOT_DEPLOYED,
            })
        })

        it('puts admin fee as pending change for unpublished data union', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
                type: productTypes.STREAMS,
            }
            expect(State.update(product, (p) => ({
                ...p,
                name: 'Better Name',
                description: 'A better description',
                adminFee: '0.2',
            }))).toMatchObject({
                id: '1',
                name: 'Better Name',
                description: 'A better description',
                state: productStates.NOT_DEPLOYED,
                pendingChanges: {
                    adminFee: '0.2',
                },
            })
        })

        it('puts updates as pending changes for published product', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYED,
            }
            expect(State.update(product, (p) => ({
                ...p,
                name: 'Better Name',
                description: 'A better description',
            }))).toMatchObject({
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYED,
                pendingChanges: {
                    name: 'Better Name',
                    description: 'A better description',
                },
            })
        })

        it('puts updates as pending changes for product that is deploying', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYING,
            }
            expect(State.update(product, (p) => ({
                ...p,
                name: 'Better Name',
                description: 'A better description',
            }))).toMatchObject({
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYING,
                pendingChanges: {
                    name: 'Better Name',
                    description: 'A better description',
                },
            })
        })
    })

    describe('getPendingChanges', () => {
        it('returns empty object for unpublished product', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
            }
            expect(State.getPendingChanges(product)).toMatchObject({})
        })

        it('returns empty object for unpublished data union', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
                type: productTypes.STREAMS,
            }
            expect(State.getPendingChanges(product)).toMatchObject({})
        })

        it('returns pending admin fee for unpublished data union', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
                type: productTypes.STREAMS,
            }
            expect(State.getPendingChanges({
                ...product,
                pendingChanges: {
                    name: 'Better Name',
                    description: 'A better description',
                    adminFee: '0.2',
                },
            })).toMatchObject({
                adminFee: '0.2',
            })
        })

        it('returns pending changes for published product', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYED,
            }
            expect(State.getPendingChanges({
                ...product,
                pendingChanges: {
                    name: 'Better Name',
                    description: 'A better description',
                },
            })).toMatchObject({
                name: 'Better Name',
                description: 'A better description',
            })
        })

        it('returns pending changes for published data union', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                adminFee: '0.2',
                state: productStates.DEPLOYED,
                type: productTypes.STREAMS,
            }
            expect(State.getPendingChanges({
                ...product,
                pendingChanges: {
                    name: 'Better Name',
                    description: 'A better description',
                    adminFee: '0.4',
                },
            })).toMatchObject({
                name: 'Better Name',
                description: 'A better description',
                adminFee: '0.4',
            })
        })

        it('returns pending changes for unpublished data union', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                adminFee: '0.2',
                state: productStates.NOT_DEPLOYED,
                type: productTypes.STREAMS,
            }
            expect(State.getPendingChanges(State.update(product, (p) => ({
                ...p,
                name: 'Better Name',
                description: 'A better description',
                adminFee: '0.4',
            })))).toMatchObject({
                adminFee: '0.4',
            })
        })

        it('returns pending changes for nested objects', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYED,
                pendingChanges: {
                    contact: {
                        email: 'a@b.com',
                    },
                },
            }
            expect(State.getPendingChanges(product)).toMatchObject({
                contact: {
                    email: 'a@b.com',
                },
            })
        })
    })

    describe('hasPendingChange', () => {
        it('it returns false for unpublished product change', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
            }
            const nextProduct = {
                ...product,
                pendingChanges: {
                    name: 'Better Name',
                    description: 'A better description',
                },
            }
            expect(State.hasPendingChange(nextProduct, 'name')).toBe(false)
            expect(State.hasPendingChange(nextProduct, 'description')).toBe(false)
        })

        it('it returns true for unpublished data union admin fee change', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
                type: productTypes.STREAMS,
            }
            const nextProduct = {
                ...product,
                pendingChanges: {
                    name: 'Better Name',
                    description: 'A better description',
                    adminFee: '0.5',
                },
            }
            expect(State.hasPendingChange(nextProduct, 'name')).toBe(false)
            expect(State.hasPendingChange(nextProduct, 'description')).toBe(false)
            expect(State.hasPendingChange(nextProduct, 'adminFee')).toBe(true)
        })

        it('it returns true for published product change', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYED,
            }
            const nextProduct = {
                ...product,
                pendingChanges: {
                    name: 'Better Name',
                    description: 'A better description',
                },
            }
            expect(State.hasPendingChange(nextProduct, 'name')).toBe(true)
            expect(State.hasPendingChange(nextProduct, 'description')).toBe(true)
        })

        it('it returns true if pending fields are set to empty', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                otherField: 'asd',
                state: productStates.DEPLOYED,
            }
            const nextProduct = {
                ...product,
                pendingChanges: {
                    name: '',
                    description: null,
                    otherField: undefined,
                },
            }
            expect(State.hasPendingChange(nextProduct, 'name')).toBe(true)
            expect(State.hasPendingChange(nextProduct, 'description')).toBe(true)

            // undefined value can't be detected
            expect(State.hasPendingChange(nextProduct, 'otherField')).toBe(false)
        })

        it('it returns true for nested property changes', () => {
            const product = {
                id: '1',
                state: productStates.DEPLOYED,
                contact: {
                    email: 'a@b.com',
                },
            }
            const nextProduct = {
                ...product,
                pendingChanges: {
                    contact: {
                        email: 'a@b.com',
                    },
                },
            }
            expect(State.hasPendingChange(nextProduct, 'contact.email')).toBe(true)
        })
    })

    describe('withPendingChanges', () => {
        it('it returns the current data for unpublished product', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
            }
            expect(State.withPendingChanges({
                ...product,
                pendingChanges: {
                    name: 'Better Name',
                    description: 'A better description',
                },
            })).toMatchObject({
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.NOT_DEPLOYED,
            })
        })

        it('it returns the current data and updated admin fee for unpublished data union', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                adminFee: '0.2',
                state: productStates.NOT_DEPLOYED,
                type: productTypes.STREAMS,
            }
            expect(State.withPendingChanges({
                ...product,
                pendingChanges: {
                    name: 'Better Name',
                    description: 'A better description',
                    adminFee: '0.5',
                },
            })).toMatchObject({
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                adminFee: '0.5',
                state: productStates.NOT_DEPLOYED,
                type: productTypes.STREAMS,
            })
        })

        it('it returns the updated data for published product', () => {
            const product = {
                id: '1',
                name: 'My Product',
                description: 'My nice product',
                state: productStates.DEPLOYED,
            }
            expect(State.withPendingChanges({
                ...product,
                pendingChanges: {
                    name: 'Better Name',
                    description: 'A better description',
                },
            })).toMatchObject({
                id: '1',
                name: 'Better Name',
                description: 'A better description',
                state: productStates.DEPLOYED,
            })
        })
    })
})
