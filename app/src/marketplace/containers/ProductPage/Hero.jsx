/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable flowtype/no-types-missing-file-annotation */
/* eslint-disable no-console */

import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { replace } from 'connected-react-router'
import moment from 'moment'
import { I18n } from 'react-redux-i18n'
import naclFactory from 'js-nacl'

import useProduct from '$mp/containers/ProductController/useProduct'
import useModal from '$shared/hooks/useModal'
import usePending from '$shared/hooks/usePending'
import { selectUserData } from '$shared/modules/user/selectors'
import { addFreeProduct, buyerEligibility } from '$mp/modules/product/services'
import { getMyPurchases } from '$mp/modules/myPurchaseList/actions'
import { getProductSubscription } from '$mp/modules/product/actions'
import useIsMounted from '$shared/hooks/useIsMounted'
import { post } from '$shared/utils/api'

import ProductDetails from '$mp/components/ProductPage/ProductDetails'
import HeroComponent from '$mp/components/Hero'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import {
    selectSubscriptionIsValid,
    selectContractSubscription,
    selectProductIsPending,
} from '$mp/modules/product/selectors'
import { ImageTile } from '$shared/components/Tile'
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

let nacl
naclFactory.instantiate((naclInstance) => { nacl = naclInstance })

// const Base64toUint8 = (data) => Uint8Array.from(atob(data), (el) => el.charCodeAt(0))
const Base64toUint8 = (data) => Uint8Array.from(atob(data).split('').map((el) => el.charCodeAt(0)))

const Uint8ToBase64 = (data) => btoa(String.fromCharCode(...data))

const downloadDataset = (product) => {
    // const keyPair = window.GenerateKeypair() // position 0: secret key, position 1: public key
    const keyPair = window.GenerateKeypairWASM() // position 0: secret key, position 1: public key

    const subscriberPubKey = Uint8ToBase64(keyPair[1])
    const aggregationKey = Uint8ToBase64(window.GenerateAggregationKey(keyPair[0], Base64toUint8(product.datasetInfo.publisherPubKey)))

    const downloads = [
        post({
            url: routes.api.products.keyRequest({
                id: product.id,
            }),
            headers: {
                Accept: 'text',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                subscriberPubKey, aggregationKey,
            }),
        }),
        fetch(product.datasetInfo.datasetUrl).then((response) => response.arrayBuffer()),
    ]

    Promise.all(downloads).then(async (results) => {
        const encryptedKey = Base64toUint8(results[0])

        const encryptedDataset = new Uint8Array(results[1])
        const mpcNode1PubKey = new Uint8Array(await fetch(routes.api.products.mpcNode1PubKey()).then((response) => response.arrayBuffer()))
        // console.log('mpc node: ', mpcNode1PubKey.toString())
        const mpcNode2PubKey = new Uint8Array(await fetch(routes.api.products.mpcNode2PubKey()).then((response) => response.arrayBuffer()))
        // console.log('mpc node: ', mpcNode2PubKey.toString())
        const mpcNode3PubKey = new Uint8Array(await fetch(routes.api.products.mpcNode3PubKey()).then((response) => response.arrayBuffer()))
        // console.log('mpc node: ', mpcNode3PubKey.toString())
        const mpcNodesPubKeys = [mpcNode1PubKey, mpcNode2PubKey, mpcNode3PubKey]
        const key = window.Decrypt(encryptedKey, keyPair[0], mpcNodesPubKeys.length, ...mpcNodesPubKeys)
        const keyString = String.fromCharCode(...key)

        const randomNonce = Base64toUint8(product.datasetInfo.randomNonce)

        const dataset = nacl.decode_utf8(nacl.crypto_secretbox_open(encryptedDataset, randomNonce, keyString))

        const datasetFile = new Blob([dataset])
        const datasetFileURL = window.URL.createObjectURL(datasetFile)
        const tempLink = document.createElement('a')
        tempLink.href = datasetFileURL
        tempLink.setAttribute('download', 'dataset.csv')
        tempLink.click()
    }).catch((err) => {
        console.log(err)
    })
}

const Hero = () => {
    const dispatch = useDispatch()
    const product = useProduct()
    const { api: purchaseDialog } = useModal('purchase')
    const { isPending, wrap } = usePending('product.PURCHASE_DIALOG')
    const isMounted = useIsMounted()
    const { api: requestAccessDialog } = useModal('requestWhitelistAccess')

    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const isProductSubscriptionValid = useSelector(selectSubscriptionIsValid)
    const isFiatPending = useSelector(selectProductIsPending)
    const subscription = useSelector(selectContractSubscription)
    const account = useAccountAddress()
    const isFiatCurrency = product && product.priceCurrency === 'EUR'

    const productId = product.id
    const productType = product.type
    const contactEmail = product && product.contact && product.contact.email
    const productName = product && product.name
    const isPaid = isPaidProduct(product)
    const isWhitelistEnabled = !!(isPaid && product.requiresWhitelist)
    const [isWhitelisted, setIsWhitelisted] = useState(isWhitelistEnabled ? null : false)

    // eslint-disable-next-line no-unused-vars
    const onPurchase = useCallback(async () => (
        wrap(async () => {
            if (isLoggedIn) {
                const eligibility = await buyerEligibility(productId)
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

                        await addFreeProduct(productId || '', endsAt)

                        if (!isMounted()) { return }

                        Notification.push({
                            title: I18n.t('notifications.productSaved'),
                            icon: NotificationIcon.CHECKMARK,
                        })

                        dispatch(getMyPurchases())
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
    ), [wrap, isLoggedIn, productId, product.currency, isPaid, isMounted, dispatch, isWhitelistEnabled, isWhitelisted, purchaseDialog, requestAccessDialog, contactEmail, productName])

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
        <HeroComponent
            leftContent={
                <ImageTile
                    alt={product.name}
                    src={product.imageUrl}
                    showDataUnionBadge={isDataUnion}
                    showAnalyticsBadge={productType === 'ANALYTICS'}
                    showBatchBadge={productType === 'BATCH'}
                />
            }
            rightContent={
                <ProductDetails
                    product={product}
                    isValidSubscription={!!isProductSubscriptionValid}
                    isFiatPending={isFiatCurrency && isFiatPending}
                    productSubscription={subscription}
                    onPurchase={() => {
                        window.location.href = routes.marketplace.purchase({
                            id: product.id,
                        })
                    }}
                    downloadDataset={() => downloadDataset(product)}
                    isPurchasing={isPending}
                    isWhitelisted={isWhitelisted}
                />
            }
        />
    )
}

export default Hero
