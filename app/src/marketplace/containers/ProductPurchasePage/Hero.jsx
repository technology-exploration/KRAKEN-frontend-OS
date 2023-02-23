/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable flowtype/no-types-missing-file-annotation */
/* eslint-disable max-len */

import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import moment from 'moment'
import { I18n } from 'react-redux-i18n'
import styled from 'styled-components'

import useProduct from '$mp/containers/ProductController/useProduct'
import useModal from '$shared/hooks/useModal'
import usePending from '$shared/hooks/usePending'
import { selectUserData } from '$shared/modules/user/selectors'
import { addFreeProductBatch, buyerEligibility } from '$mp/modules/product/services'
import { getMyPurchases } from '$mp/modules/myPurchaseList/actions'
import { getProductSubscription } from '$mp/modules/product/actions'
import useIsMounted from '$shared/hooks/useIsMounted'

import Button from '$shared/components/Button'
import { isPaidProduct } from '$mp/utils/product'
import { NotificationIcon } from '$shared/utils/constants'
import Notification from '$shared/utils/Notification'
import { isAddressWhitelisted } from '$mp/modules/contractProduct/services'
import useAccountAddress from '$shared/hooks/useAccountAddress'
import type { ProductId } from '$mp/flowtype/product-types'
import { getWeb3, validateWeb3 } from '$shared/web3/web3Provider'

import routes from '$routes'

type WhitelistStatus = {
    productId: ProductId,
    validate?: boolean,
}

type Props = {
    purposes: any,
}

const getWhitelistStatus = async ({ productId, validate = false }: WhitelistStatus) => {
    const web3 = getWeb3()

    try {
        if (validate) {
            await validateWeb3({
                web3,
                checkNetwork: false, // network check is done later if purchase is possible
            })
        }
        const account = await web3.getDefaultAccount()

        return !!account && isAddressWhitelisted(productId, account)
    } catch (e) {
        // log error but ignore otherwise
        console.warn(e)
    }

    return false
}

const ButtonRow = styled.div`
    display:flex;
    align-items: center;
    justify-content: center;
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
`

const PrimaryButton = styled(Button)`
    background-color: #0000BA;
    margin-left: 2.5rem;
`

const Hero = ({
    purposes, countries, categories, period, safeGuards, setClicked, automatedDecision,
}: Props) => {
    const dispatch = useDispatch()
    const product = useProduct()

    const { sector } = product
    const { api: purchaseDialog } = useModal('purchase')
    const { isPending, wrap } = usePending('product.PURCHASE_DIALOG')
    const isMounted = useIsMounted()
    const { api: requestAccessDialog } = useModal('requestWhitelistAccess')

    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const account = useAccountAddress()

    const productId = product.id
    const contactEmail = product && product.contact && product.contact.email
    const productName = product && product.name
    const isPaid = isPaidProduct(product)
    const isWhitelistEnabled = !!(isPaid && product.requiresWhitelist)
    const [isWhitelisted, setIsWhitelisted] = useState(isWhitelistEnabled ? null : false)

    const onPurchase = useCallback(async (purposesTwo) => (

        wrap(async () => {
            if (isLoggedIn) {
                const eligibility = await buyerEligibility(productId, {
                    purposes: Object.keys(purposesTwo).filter((x) => purposesTwo[x] !== false),
                })

                if (eligibility === 'eligible') {
                    Notification.push({
                        title: I18n.t('notifications.eligibleBuyer'),
                        icon: NotificationIcon.CHECKMARK,
                    })

                    if (isPaid) {
                        if (isWhitelistEnabled && !isWhitelisted) {
                            // at this point we know either that user has access or Metamask was locked
                            // do a another check but this time validate web3 which will prompt Metamask
                            const canPurchase = await getWhitelistStatus({
                                productId,
                                validate: true, // prompts metamask if locked
                            })

                            if (!isMounted()) { return }

                            if (!canPurchase) {
                                await requestAccessDialog.open({
                                    contactEmail,
                                    productName,
                                })
                                return
                            }
                        }

                        // Paid product has to be bought with Metamask
                        const { started, succeeded, viewInCore } = await purchaseDialog.open({
                            productId,
                        })

                        if (isMounted() && !!started && !!succeeded) {
                            if (viewInCore) {
                                dispatch(replace(routes.subscriptions()))
                            } else {
                                dispatch(getProductSubscription(productId))
                            }
                        }
                    } else {
                        // Free product can be bought directly

                        // subscribe for one year (TODO: move to constant)
                        const endsAt = moment().add(1, 'year').unix() // Unix timestamp (seconds)

                        await addFreeProductBatch(productId || '', true, endsAt, purposes, automatedDecision, categories, countries, safeGuards)

                        if (!isMounted()) { return }

                        Notification.push({
                            title: I18n.t('notifications.productSaved'),
                            icon: NotificationIcon.CHECKMARK,
                        })

                        dispatch(getMyPurchases())

                        if (isMounted()) {
                            dispatch(replace(routes.subscriptions()))
                        }
                    }
                } else {
                    Notification.push({
                        title: I18n.t('notifications.notEligibleBuyer'),
                        icon: NotificationIcon.ERROR,
                    })
                }
            } else {
                dispatch(replace(routes.auth.login({
                    redirect: routes.marketplace.product({
                        id: productId,
                    }),
                })))
            }
        })
    ), [wrap, isLoggedIn, productId, isPaid, isWhitelistEnabled, isWhitelisted, purchaseDialog, isMounted, requestAccessDialog, contactEmail, productName, dispatch, purposes, countries, categories, period, safeGuards])

    const validate = (purpo) => {
        setClicked(true)
        if (
            (sector === 'Health and wellness' && !categories.patients_medical_records && !categories.genetic_data && !categories.imaging_data && !categories.mobile_data)
            || (sector === 'Education' && !categories.grades && !categories.diplomas && !categories.matriculation)
            || (!countries.EUCountry && !countries.nonEU && !countries.noAdeqDecision)
            || (countries.nonEU && (countries.nonEUCountry.length === 0 || !countries.nonEUCountry))
            || (countries.noAdeqDecision && (countries.noAdeqDecisionCountry.length === 0 || !countries.noAdeqDecisionCountry))
            || (countries.noAdeqDecision && (!safeGuards.length === 0 || !safeGuards || safeGuards === ''))
            || (purposes.automated && !automatedDecision.clinical_risks_assessment && !automatedDecision.diagnostic_or_treatment && !automatedDecision.hiring_assessments && !automatedDecision.automated_placing)
            || (sector === 'Health and wellness' && !purposes.marketing && !purposes.publicly_funded_research && !purposes.private_research && !purposes.managment && !purposes.automated)
            || (sector === 'Education' && !purposes.study_recommendations && !purposes.job_offers && !purposes.statistical_research)
            // || !period.period
            // || !period.periodNumber
        ) {
            console.log('nt validated')
        } else {
            onPurchase(purpo)
        }
    }

    useEffect(() => {
        const loadWhitelistStatus = async () => {
            // set product as whitelisted if that feature is enabled, and if
            // 1) metamask is locked -> clicking request access will prompt Metamask
            // 2) metamask is unlocked and user has access
            const whitelisted = !isWhitelistEnabled || await getWhitelistStatus({
                productId,
            })

            if (isMounted()) {
                setIsWhitelisted(whitelisted)
            }
        }

        if (productId && !isPending) {
            loadWhitelistStatus()
        }
    }, [productId, account, isWhitelistEnabled, isPending, isMounted])

    return (
        <ButtonRow>
            <Button
                kind="secondary"
                size="mini"
                onClick={() => {}}
            >
                Clear
            </Button>
            <PrimaryButton
                size="mini"
                onClick={() => validate(purposes)}
                waiting={isPending}
            >
                Complete purchase
            </PrimaryButton>
        </ButtonRow>
    )
}

export default Hero
