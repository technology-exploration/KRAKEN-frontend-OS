// @flow

import { useMemo, useCallback, useContext } from 'react'
import BN from 'bignumber.js'

import { Context as UndoContext } from '$shared/contexts/Undo'

import { pricePerSecondFromTimeUnit } from '$mp/utils/price'

import type { Product, ContactDetails } from '$mp/flowtype/product-types'
import type { StreamIdList } from '$shared/flowtype/stream-types'
import useEditableProductUpdater from '../ProductController/useEditableProductUpdater'
import { Context as ValidationContext } from './ValidationContextProvider'

const getPricePerSecond = (isFree, price, timeUnit) => (
    isFree ? BN(0) : pricePerSecondFromTimeUnit(BN(price || 0), timeUnit)
    // || timeUnits.hour
)

type SocialLinks = {
    social1?: string,
    social2?: string,
    social3?: string,
    social4?: string,
}

export function useEditableProductActions() {
    const { updateProduct: commit } = useEditableProductUpdater()
    const { undo } = useContext(UndoContext)
    const { setTouched } = useContext(ValidationContext)

    const updateProduct = useCallback((product: Object, msg: string = 'Update product') => {
        commit(msg, (p) => ({
            ...p,
            ...product,
        }))
    }, [commit])
    const updateName = useCallback((name: $ElementType<Product, 'name'>) => {
        commit('Update name', (p) => ({
            ...p,
            name,
        }))
        setTouched('name')
    }, [commit, setTouched])
    const updateTags = useCallback((tags: $ElementType<Product, 'tags'>) => {
        commit('Update tags', (p) => ({
            ...p,
            tags,
        }))
        setTouched('tags')
    }, [commit, setTouched])
    const updateDescription = useCallback((description: $ElementType<Product, 'description'>) => {
        commit('Update description', (p) => ({
            ...p,
            description,
        }))
        setTouched('description')
    }, [commit, setTouched])
    const updateShortDescription = useCallback((shortDescription: $ElementType<Product, 'shortDescription'>) => {
        commit('Update shortDescription', (p) => ({
            ...p,
            shortDescription,
        }))
        setTouched('shortDescription')
    }, [commit, setTouched])
    const updateImageUrl = useCallback((image: $ElementType<Product, 'imageUrl'>) => {
        commit('Update image url', (p) => ({
            ...p,
            imageUrl: image,
        }))
        setTouched('imageUrl')
    }, [commit, setTouched])
    const updateImageFile = useCallback((image: File) => {
        commit('Update image file', ({ imageUrl, ...p }) => ({
            ...p,
            newImageToUpload: image,
        }))
        setTouched('imageUrl')
    }, [commit, setTouched])
    const updateStreams = useCallback((streams: StreamIdList) => {
        commit('Update streams', (p) => ({
            ...p,
            streams,
        }))
        setTouched('streams')
    }, [commit, setTouched])
    const updateCategory = useCallback((category: $ElementType<Product, 'category'>) => {
        commit('Update category', (p) => ({
            ...p,
            category,
        }))
        setTouched('category')
        setTouched('details')
    }, [commit, setTouched])
    const updateAdminFee = useCallback((adminFee: number) => {
        commit('Update admin fee', (p) => ({
            ...p,
            adminFee,
        }))
        setTouched('adminFee')
        setTouched('details')
    }, [commit, setTouched])
    const updateRequiresWhitelist = useCallback((requiresWhitelist: boolean, touched: boolean = true) => {
        commit('Update whitelist enabled', (p) => ({
            ...p,
            requiresWhitelist,
        }))
        setTouched('requiresWhitelist', touched)
    }, [commit, setTouched])
    const updateIsFree = useCallback((isFree: $ElementType<Product, 'isFree'>) => {
        commit('Update is free', (p) => {
            // Switching product from free to paid also changes its price from 0 (only
            // if it's 0) to 1. We're doing it to avoid premature validation errors.
            const price = p.isFree && !isFree && BN(p.price).isZero() ? new BN(1) : p.price

            return {
                ...p,
                isFree,
                price,
                pricePerSecond: getPricePerSecond(isFree, price, p.timeUnit),
            }
        })
        setTouched('pricePerSecond')
    }, [commit, setTouched])
    const updatePrice = useCallback((
        price: $ElementType<Product, 'price'>,
        priceCurrency: $ElementType<Product, 'priceCurrency'>,
        timeUnit: $ElementType<Product, 'timeUnit'>,
    ) => {
        commit('Update price', (p) => ({
            ...p,
            price,
            priceCurrency,
            pricePerSecond: getPricePerSecond(p.isFree, price, timeUnit),
            timeUnit,
        }))
        setTouched('pricePerSecond')
    }, [commit, setTouched])
    const updateCurrency = useCallback((priceCurrency: $ElementType<Product, 'priceCurrency'>) => {
        commit('Update currency', (p) => ({
            ...p,
            priceCurrency,
        }))
        setTouched('currency')
    }, [commit, setTouched])
    const updateBeneficiaryAddress = useCallback((beneficiaryAddress: $ElementType<Product, 'beneficiaryAddress'>) => {
        commit('Update beneficiary address', (p) => ({
            ...p,
            beneficiaryAddress,
        }))
        setTouched('beneficiaryAddress')
    }, [commit, setTouched])
    const updateType = useCallback((type: $ElementType<Product, 'type'>) => {
        commit('Update type', (p) => ({
            ...p,
            type,
        }))
        setTouched('type')
    }, [commit, setTouched])
    const updateTermsOfUse = useCallback((termsOfUse: $ElementType<Product, 'termsOfUse'>) => {
        commit('Update terms of use', (p) => ({
            ...p,
            termsOfUse,
        }))
        setTouched('termsOfUse')
    }, [commit, setTouched])
    const updateFormats = useCallback((formats: $ElementType<Product, 'formats'>) => {
        commit('Update formats', (p) => ({
            ...p,
            formats,
        }))
        setTouched('formats')
    }, [commit, setTouched])
    const updatePolicies = useCallback((policies: $ElementType<Product, 'policies'>) => {
        commit('Update policies', (p) => ({
            ...p,
            policies,
        }))
        setTouched('policies')
    }, [commit, setTouched])
    const updateSector = useCallback((sector: $ElementType<Product, 'sector'>) => {
        commit('Update sector', (p) => ({
            ...p,
            sector,
        }))
        setTouched('sector')
    }, [commit, setTouched])
    const updateUniversity = useCallback((university: $ElementType<Product, 'university'>) => {
        commit('Update university', (p) => ({
            ...p,
            university,
        }))
        setTouched('university')
    }, [commit, setTouched])
    const updateStudyProgram = useCallback((studyProgram: $ElementType<Product, 'studyProgram'>) => {
        commit('Update studyProgram', (p) => ({
            ...p,
            studyProgram,
        }))
        setTouched('studyProgram')
    }, [commit, setTouched])
    const updateCourse = useCallback((course: $ElementType<Product, 'course'>) => {
        commit('Update course', (p) => ({
            ...p,
            course,
        }))
        setTouched('course')
    }, [commit, setTouched])
    const updateProductDatasetInfo = useCallback((datasetInfo: $ElementType<Product, 'datasetInfo'>) => {
        commit('Update dataset info', (p) => ({
            ...p,
            datasetInfo,
        }))
        setTouched('keyShares')
    }, [commit, setTouched])
    const updateAnonymizeDataset = useCallback((anonymizeDataset: $ElementType<Product, 'anonymizeDataset'>) => {
        commit('Update anonymize dataset', (p) => ({
            ...p,
            anonymizeDataset,
        }))
        setTouched('anonymizeDataset')
    }, [commit, setTouched])
    const updateContactUrl = useCallback((url: $ElementType<ContactDetails, 'url'>) => {
        commit('Update contact url', (p) => ({
            ...p,
            contact: {
                ...p.contact || {},
                url,
            },
        }))
        setTouched('url')
    }, [commit, setTouched])
    const updateContactEmail = useCallback((email: $ElementType<ContactDetails, 'email'>) => {
        commit('Update contact email', (p) => ({
            ...p,
            contact: {
                ...p.contact || {},
                email,
            },
        }))
        setTouched('email')
    }, [commit, setTouched])
    const updateSocialLinks = useCallback(({ social1, social2, social3, social4 }: SocialLinks) => {
        commit('Update social links', (p) => ({
            ...p,
            contact: {
                ...p.contact || {},
                // $FlowFixMe: "Computing object literal may lead to an exponentially large number of cases to reason about because inferred union"
                ...(social1 != null && {
                    social1,
                }),
                ...(social2 != null && {
                    social2,
                }),
                ...(social3 != null && {
                    social3,
                }),
                ...(social4 != null && {
                    social4,
                }),
            },
        }))
        setTouched('socialLinks')
    }, [commit, setTouched])
    const updateColumnVariables = useCallback((columnVariables: $ElementType<Product, 'columnVariables'>) => {
        commit('Update column variables', (p) => ({
            ...p,
            columnVariables,
        }))
        setTouched('columnVariables')
    }, [commit, setTouched])
    const updateNumberOfRecords = useCallback((numberOfRecords: $ElementType<Product, 'numberOfRecords'>) => {
        commit('Update number of records', (p) => ({
            ...p,
            numberOfRecords,
        }))
        setTouched('numberOfRecords')
    }, [commit, setTouched])
    const updateSharingCountries = useCallback((dataShareCountries: $ElementType<Product, 'dataShareCountries'>) => {
        commit('Update sharing coountries', (p) => ({
            ...p,
            dataShareCountries,
        }))
        setTouched('dataShareCountries')
    }, [commit, setTouched])
    const updatePurposes = useCallback((purposes: $ElementType<Product, 'purposes'>) => {
        commit('Update purposes', (p) => ({
            ...p,
            purposes,
        }))
        setTouched('purposes')
    }, [commit, setTouched])
    const updateAutomatedConsequences = useCallback((automatedConsequences: $ElementType<Product, 'automatedConsequences'>) => {
        commit('Update automated consequences', (p) => ({
            ...p,
            automatedConsequences,
        }))
        setTouched('automatedConsequences')
    }, [commit, setTouched])

    return useMemo(() => ({
        undo,
        updateProduct,
        updateName,
        updateDescription,
        updateImageUrl,
        updateImageFile,
        updateStreams,
        updateTags,
        updateCategory,
        updateAdminFee,
        updateRequiresWhitelist,
        updateIsFree,
        updatePrice,
        updateCurrency,
        updateSector,
        updateShortDescription,
        updateBeneficiaryAddress,
        updateType,
        updateTermsOfUse,
        updatePolicies,
        updateFormats,
        updateUniversity,
        updateStudyProgram,
        updateCourse,
        updateProductDatasetInfo,
        updateAnonymizeDataset,
        updateContactUrl,
        updateContactEmail,
        updateSocialLinks,
        updateColumnVariables,
        updateNumberOfRecords,
        updateSharingCountries,
        updatePurposes,
        updateAutomatedConsequences,
    }), [
        undo,
        updateProduct,
        updateName,
        updateTags,
        updateDescription,
        updateImageUrl,
        updateImageFile,
        updateStreams,
        updateCategory,
        updateAdminFee,
        updateRequiresWhitelist,
        updateIsFree,
        updatePrice,
        updateCurrency,
        updateBeneficiaryAddress,
        updateType,
        updateUniversity,
        updateStudyProgram,
        updateCourse,
        updateSector,
        updateShortDescription,
        updateTermsOfUse,
        updatePolicies,
        updateFormats,
        updateProductDatasetInfo,
        updateAnonymizeDataset,
        updateContactUrl,
        updateContactEmail,
        updateSocialLinks,
        updateColumnVariables,
        updateNumberOfRecords,
        updateSharingCountries,
        updatePurposes,
        updateAutomatedConsequences,
    ])
}

export default useEditableProductActions
