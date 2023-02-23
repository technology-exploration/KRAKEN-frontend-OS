/* eslint-disable flowtype/no-types-missing-file-annotation */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

import React, { useMemo, useCallback, useState, type Node, type Context } from 'react'
import * as yup from 'yup'
import get from 'lodash/get'
import set from 'lodash/fp/set'
import isPlainObject from 'lodash/isPlainObject'
import { useSelector } from 'react-redux'
import { selectUserData } from '$shared/modules/user/selectors'
import useIsMounted from '$shared/hooks/useIsMounted'

import { isEthereumAddress } from '$mp/utils/validate'
import { isPaidProduct, isDataUnionProduct } from '$mp/utils/product'
import { isPriceValid } from '$mp/utils/price'
import { isPublished, getPendingChanges, PENDING_CHANGE_FIELDS } from '../EditProductPage/state'
import useProduct from '../ProductController/useProduct'

export const INFO = 'info'
export const WARNING = 'warning'
export const ERROR = 'error'

export type Level = 'info' | 'warning' | 'error'

type ContextProps = {
    setStatus: (string, Level, string) => void,
    clearStatus: (string) => void,
    status: Object,
    isValid: (string) => boolean,
    validate: (Object) => void,
    touched: Object,
    setTouched: (string, ?boolean) => void,
    isTouched: (string) => boolean,
    isAnyTouched: () => boolean,
    resetTouched: () => void,
    pendingChanges: Object,
    isPendingChange: (string) => boolean,
    isAnyChangePending: () => boolean,
}

const ValidationContext: Context<ContextProps> = React.createContext({})

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const urlValidator = yup.string().trim().url()
const emailValidator = yup.string().trim().email()

function useValidationContext(): ContextProps {
    const [status, setStatusState] = useState({})
    const [pendingChanges, setPendingChanges] = useState({})
    const [touched, setTouchedState] = useState({})
    const originalProduct = useProduct()
    // const { isRequired: isEthIdentityRequired } = useIsEthIdentityNeeded()
    const currentUser = useSelector(selectUserData)

    const setTouched = useCallback((name: string, value = true) => {
        setTouchedState((existing) => ({
            ...existing,
            [name]: !!value,
        }))
    }, [setTouchedState])
    const isTouched = useCallback((name: string) => !!touched[name], [touched])

    const isAnyTouched = useCallback(() => Object.values(touched).some(Boolean), [touched])

    const resetTouched = useCallback(() => setTouchedState({}), [])

    const isMounted = useIsMounted()

    const setPendingChange = useCallback((name: string, isPending: boolean = true): Object => {
        if (!isMounted()) { return }
        if (!name) {
            throw new Error('pending change needs a name')
        }

        setPendingChanges((state) => set(name, isPending, state))
    }, [setPendingChanges, isMounted])

    const isPendingChange = useCallback((name: string) => !!(get(pendingChanges, name)), [pendingChanges])

    const isAnyChangePending = useCallback(() => (
        // flatten nested values
        Object.values(pendingChanges)
            .reduce((result, value) => ([
                ...result,
                // $FlowFixMe value is in fact an object
                ...(isPlainObject(value) ? Object.values(value) : [value]),
            ]), [])
            .some(Boolean)
    ), [pendingChanges])

    const setStatus = useCallback((name: string, level: Level, message: string): Object => {
        if (!isMounted()) { return }
        if (!name) {
            throw new Error('validation needs a name')
        }

        setStatusState((state) => ({
            ...state,
            [name]: {
                level,
                message,
            },
        }))
    }, [setStatusState, isMounted])

    const clearStatus = useCallback((name: string): Object => {
        if (!isMounted()) { return }
        if (!name) {
            throw new Error('validation needs a name')
        }

        setStatusState((prevState) => {
            const newState = {
                ...prevState,
            }
            delete newState[name]

            return newState
        })
    }, [setStatusState, isMounted])

    const isValid = useCallback((name: string) => !status[name], [status])

    const validate = useCallback((product) => {
        if (!isMounted() || !product) { return }
        ['name', 'description', 'shortDescription'].forEach((field) => {
            if (!product[field]) {
                setStatus(field, ERROR, `Product ${field} cannot be empty`)
            } else {
                clearStatus(field)
            }
        })

        if (!product.imageUrl && !product.newImageToUpload) {
            clearStatus('tags')
            setStatus('imageUrl', ERROR, 'Product must have a cover image')
        } else {
            clearStatus('imageUrl')
        }

        if (!isDataUnionProduct(product) && product.sector === 'Health and wellness' && (product.tags === undefined || product.tags.length === 0)) {
            clearStatus('category')
            clearStatus('university')
            clearStatus('studyProgram')
            clearStatus('course')
            setStatus('tags', ERROR, 'Product must have Health and wellness tags')
        } else {
            clearStatus('category')
            clearStatus('university')
            clearStatus('studyProgram')
            clearStatus('course')
            clearStatus('tags')
        }

        if (product.policies) {
            let result = true
            if (product.policies.personalData === undefined) {
                setStatus('policies.personalData', ERROR, 'please select an option')
                result = false
            } else {
                clearStatus('policies.personalData')
            }
        }

        if (product.policies && product.policies.personalData === 'Yes') {
            let result = true
            if (product.sector === 'Health and wellness' && product.policies.sensitiveData === undefined) {
                setStatus('policies.sensitiveData', ERROR, 'please select an option')
                result = false
            } else {
                clearStatus('policies.sensitiveData')
            }
        }

        if (currentUser?.institutionalAffiliation === 'Yes' && product.type !== 'ANALYTICS' && product.policies.personalData) {
            let result = true
            if (product.policies.personalDataOfOthers === undefined) {
                setStatus('policies.consentObtained', ERROR, 'please select an option')
                result = false
            } else if (!product.policies.personalDataOfOthers) {
                setStatus('policies.consentObtained', ERROR, 'you must have consent from all the data subjects')
                result = false
            } else {
                clearStatus('policies.consentObtained')
            }
        }
        if (currentUser?.institutionalAffiliation === 'Yes' && product.type !== 'ANALYTICS' && !product.policies.personalData) {
            clearStatus('policies.consentObtained')
        }

        if (product.type !== 'ANALYTICS' &&
        product.purposes &&
        ((product.sector === 'Health and wellness'
        && !product.purposes.marketing
        && !product.purposes.publicly_funded_research
        && !product.purposes.private_research
        && !product.purposes.managment
        && !product.purposes.automated)
        ||
        (product.sector === 'Health and wellness'
        && Object.values(product.purposes).every((v) => v === false))
        ||
        (product.sector === 'Education'
        && !product?.purposes?.study_recommendations
        && !product?.purposes?.job_offers
        && !product?.purposes?.statistical_research
        )
        ||
        (product.sector === 'Education'
        && Object.values(product.purposes).every((v) => v === false)
        ))) {
            let result = true
            setStatus('product.purposes', ERROR, 'List at least one purpose')
            result = false
        } else {
            clearStatus('product.purposes')
        }

        // product.automatedConsequences && console.log(Object.values(product.automatedConsequences).every((v) => v === false))
        if (product.automatedConsequences) {
            let result = true
            if ((product.sector === 'Health and wellness' && product.type !== 'ANALYTICS') || product.type === 'STREAMS') {
                if ((product.automatedConsequences === undefined) || (product.automatedConsequences.automated_placing === false &&
                product.automatedConsequences.hiring_assessments === false &&
                product.automatedConsequences.clinical_risks_assessment === false &&
                product.automatedConsequences.diagnostic_or_treatment === false
                )
                ||
                (Object.values(product.automatedConsequences).every((v) => v === false))
                ) {
                    setStatus('policies.automatedConsequences', ERROR, 'please select an option')
                    result = false
                } else {
                    clearStatus('policies.automatedConsequences')
                }
            }
        }

        if (!isDataUnionProduct(product) && product.sector === 'Education') {
            ['category', 'university', 'studyProgram', 'course'].forEach((field) => {
                if (!product[field]) {
                    setStatus(field, ERROR, `${field} cannot be empty`)
                } else {
                    clearStatus(field)
                }
            })
        }

        if (product.type === 'STREAMS' && (!product.streams || product.streams.length <= 0)) {
            setStatus('streams', ERROR, 'No streams selected')
        } else {
            clearStatus('streams')
        }

        if (product.type === 'ANALYTICS' && product.sector === 'Health and wellness') {
            if ((!product.policies.recipientType)
                || (product.policies && Object.values(product.policies.recipientType).every((v) => v === false))) {
                setStatus('policies.access', ERROR, 'Select at least one buyer')
            } else {
                clearStatus('policies.access')
            }
        }

        if (product.sector === 'Education') {
            if ((product.policies && Object.values(product.policies.recipientType).every((v) => v === false))
                ||
                (!product.policies.recipientType)
            ) {
                setStatus('policies.access', ERROR, 'Select at least one buyer')
            } else {
                clearStatus('policies.access')
            }
        }

        if (product.type !== 'ANALYTICS' && product.sector === 'Health and wellness') {
            if (!product.policies.approvedOrgs) {
                setStatus('allowedCompanies', ERROR, 'Select at least one buyer')
            } else {
                clearStatus('allowedCompanies')
            }
        }

        if ((product.dataShareCountries && !product.dataShareCountries.euCountries && !product.dataShareCountries.thirdCountries && !product.dataShareCountries.allOther)
        || (product.dataShareCountries && Object.values(product.dataShareCountries).every((v) => v === false))) {
            setStatus('policies.sharedWith', ERROR, 'Select at least one country to share')
        } else {
            clearStatus('policies.sharedWith')
        }

        // if (!isDataUnionProduct(product)) {
        //     let result = true
        // }

        if (!isDataUnionProduct(product) && !(product.datasetInfo && product.datasetInfo.datasetUrl)) {
            setStatus('datasetUrl', ERROR, 'This field must contain a url')
        } else {
            clearStatus('datasetUrl')
        }

        if (product.keyShares != null) {
            clearStatus('keyShares')
        }

        if (product.termsOfUse != null && product.termsOfUse.termsUrl) {
            const result = urlValidator.isValidSync(product.termsOfUse.termsUrl)
            if (!result) {
                setStatus('termsOfUse', ERROR, 'Invalid URL for detailed terms')
            } else {
                clearStatus('termsOfUse')
            }
        }

        const isPaid = isPaidProduct(product)

        // isPaid && product.priceCurrency === 'DATA' &&
        if (!product.beneficiaryAddress || !isEthereumAddress(product.beneficiaryAddress)) {
            setStatus('beneficiaryAddress', ERROR, 'A valid ethereum address is needed')
        } else {
            clearStatus('beneficiaryAddress')
        }
        clearStatus('adminFee')

        if (isPaid) {
            if (!isPriceValid(product.pricePerSecond) && product.type !== 'ANALYTICS') {
                setStatus('pricePerSecond', ERROR, 'Price should be greater or equal to 0')
            } else {
                clearStatus('pricePerSecond')
            }
        } else {
            clearStatus('pricePerSecond')
        }

        if (product.contact) {
            ['url', 'social1', 'social2', 'social3', 'social4'].forEach((field) => {
                if (product.contact[field] && product.contact[field].length > 0) {
                    const result = urlValidator.isValidSync(product.contact[field])
                    if (!result) {
                        setStatus(`contact.${field}`, ERROR, 'Invalid URL')
                    } else {
                        clearStatus(`contact.${field}`)
                    }
                } else {
                    clearStatus(`contact.${field}`)
                }
            })

            if (product.contact.email && product.contact.email.length > 0) {
                const result = emailValidator.isValidSync(product.contact.email)
                if (!result && product.contact.email) {
                    setStatus('contact.email', ERROR, 'Invalid email address')
                } else {
                    clearStatus('contact.email')
                }
            } else {
                clearStatus('contact.email')
            }
        }

        if (product.requiresWhitelist && (product.contact == null || product.contact.email == null || product.contact.email.length === 0)) {
            setStatus('contact.email', ERROR, 'Email address is required')
        } else if (!product.requiresWhitelist) {
            clearStatus('contact.email')
        }

        // Set pending fields, a change is marked pending if there was a saved pending change or
        // we made a change that is different from the loaded product
        const changes = getPendingChanges(product)
        const isPublic = isPublished(product)
        PENDING_CHANGE_FIELDS.forEach((field) => {
            setPendingChange(
                field,
                get(changes, field) != null || (isPublic && isTouched(field) && !isEqual(get(product, field), get(originalProduct, field))),
            )
        })
    }, [isMounted, currentUser, clearStatus, setStatus, setPendingChange, isTouched, originalProduct])

    return useMemo(() => ({
        setStatus,
        clearStatus,
        isValid,
        touched,
        setTouched,
        isTouched,
        isAnyTouched,
        resetTouched,
        pendingChanges,
        isPendingChange,
        isAnyChangePending,
        status,
        validate,
    }), [
        status,
        setStatus,
        isValid,
        touched,
        setTouched,
        isTouched,
        isAnyTouched,
        resetTouched,
        pendingChanges,
        isPendingChange,
        isAnyChangePending,
        clearStatus,
        validate,
    ])
}

type Props = {
    children?: Node,
}

function ValidationContextProvider({ children }: Props) {
    return (
        <ValidationContext.Provider value={useValidationContext()}>
            {children || null}
        </ValidationContext.Provider>
    )
}

export {
    ValidationContextProvider as Provider,
    ValidationContext as Context,
}
