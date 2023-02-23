/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-mixed-operators */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import React, { useState, useContext, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { replace } from 'connected-react-router'
import usePending from '$shared/hooks/usePending'
import Notification from '$shared/utils/Notification'
import { addFreeProduct, buyerEligibility, requestAnalyticsComputation, setMyDataAllowance } from '$mp/modules/product/services'
import { addTransaction } from '$mp/modules/transactions/actions'
import { transactionTypes, NotificationIcon } from '$shared/utils/constants'
import { buyAnalyticsPackage } from '$mp/modules/contractProduct/services'
import { selectUserData } from '$shared/modules/user/selectors'
import routes from '$routes'

export const BasketContext = React.createContext([])

export const useBasketContext = () => useContext(BasketContext)

export const ComputationBasketProvider = ({ children }) => {
    const [basket, setBasket] = useState(localStorage.getItem('Basket') ? JSON.parse(localStorage.getItem('Basket')) : [])
    const [itemsCount, setItemsCount] = useState(basket.length)
    // eslint-disable-next-line no-return-assign
    const [totalEntries, setTotalEntries] = useState(basket.reduce((acc, p) => (acc += p.numOfEntries), 0))
    const { wrap } = usePending('product.PURCHASE_DIALOG')
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const [waiting, setWaiting] = useState(false)
    // const history = useHistory()
    const dispatch = useDispatch()

    let totalVariables
    let ids

    useEffect(() => {
    }, [totalVariables])

    const addToBasket = useCallback(async (product) => (
        wrap(async () => {
            if (isLoggedIn) {
                const eligibility = await buyerEligibility(product.id, {
                    purposes: Object,
                })
                if (eligibility === 'eligible') {
                    Notification.push({
                        title: I18n.t('notifications.eligibleBuyer'),
                        icon: NotificationIcon.CHECKMARK,
                    })
                    setBasket([...basket, product])
                } else {
                    Notification.push({
                        title: I18n.t('notifications.notEligibleBuyer'),
                        icon: NotificationIcon.ERROR,
                    })
                }
            }
        })
    ))

    const getIds = () => {
        ids = basket.map((item) => item.id)
    }
    getIds()

    const calculateCommonVariables = () => {
        if (basket.length > 1) {
            const newBasket = basket
            const basketDuplicate = newBasket.slice()
            const firstFilter = basketDuplicate.map((item) => item.columnVariables.toString().split(','))

            const array = [].concat(...firstFilter)
                .map((item) => item.trim())
                .filter((e, i, a) => a.indexOf(e) !== i)
                .filter((e, i, a) => a.indexOf(e) === i)

            totalVariables = array.join(', ')
        } else if (basket.length === 1) {
            totalVariables = basket[0].columnVariables.join(', ')
        }
    }
    calculateCommonVariables()

    const removeItem = (item) => {
        const newBasket = basket.filter((i) => i.id !== item.id)
        setBasket(newBasket)
    }

    const calculateTotalEntries = () => {
        // eslint-disable-next-line no-return-assign
        const newAmount = basket.reduce((acc, p) => (acc += p.numberOfRecords), 0)
        setTotalEntries(newAmount)
    }

    const clearAll = () => {
        setBasket([])
        setItemsCount(0)
        totalVariables = []
    }

    const added = () => {
        setItemsCount(basket.length)
        setTotalEntries(basket.reduce((acc, p) => (acc += p.numOfEntries), 0))
    }

    const purchaseAnalyticsComputation = async (productIds, price) => {
        setWaiting(true)
        const keyPair = window.GenerateKeypair()
        const subscriberPubKey = keyPair[0]
        const subscriberSecKey = keyPair[1]
        setMyDataAllowance(price)
            .onTransactionHash((hash) => {
                console.log(hash)
            })
            .onTransactionComplete(() => {
                console.log('allowance completed')
                buyAnalyticsPackage(productIds.map((id) => `0x${id}`))
                    .onTransactionHash((hash) => {
                        // update(transactionStates.PENDING)
                        // done()
                        dispatch(addTransaction(hash, transactionTypes.BUY_ANALYTICS_PACKAGE))
                        // postSetDeploying(product.id || '', hash)
                        // Activity.push({
                        //     action: actionTypes.PUBLISH,
                        //     txHash: hash,
                        //     resourceId: product.id,
                        //     resourceType: resourceTypes.PRODUCT,
                        // })
                    })
                    .onTransactionComplete(() => {
                        // update(transactionStates.CONFIRMED)

                        // request computation
                        requestAnalyticsComputation(productIds, subscriberPubKey).then((res) => {
                            const joinShares = window.JoinSharesShamir(subscriberPubKey, subscriberSecKey, res[0], res[1], res[2])

                            const funcName = 'stats'

                            const csvText = window.VecToCsvText(joinShares, totalVariables, funcName)

                            const decryptedDatasetFile = new Blob([csvText])
                            const decryptedDatasetFileURL = window.URL.createObjectURL(decryptedDatasetFile)
                            const tempLink = document.createElement('a')
                            tempLink.href = decryptedDatasetFileURL
                            tempLink.setAttribute('download', 'result.csv')
                            tempLink.click()
                            setWaiting(false)
                            clearAll()
                            dispatch(replace(routes.subscriptions()))
                            console.log('computation completed')
                        })
                    })
                    .onError((error) => {
                        console.log(error)
                        // update(transactionStates.FAILED, error)
                        // done()
                    })
            })
            .onError((error) => {
                console.log(error)
            })
        // const endsAt = moment().add(1, 'year').unix() // Unix timestamp (seconds)

        // const subscriptionsRequests = []
        // // subscription
        // productIds.forEach((id) => subscriptionsRequests.push(addFreeProduct(id, endsAt)))
        // await Promise.all(subscriptionsRequests)
    }

    // useCallback(() => {
    //     history.push(routes.subscriptions())
    // }, [history])

    useEffect(() => {
        localStorage.setItem('Basket', JSON.stringify(basket))
        added()
        calculateCommonVariables()
        getIds()
        calculateTotalEntries()
    }, [basket, clearAll])

    return (
        <BasketContext.Provider value={{
            removeItem,
            itemsCount,
            basket,
            addToBasket,
            setBasket,
            clearAll,
            totalEntries,
            totalVariables,
            ids,
            purchaseAnalyticsComputation,
            waiting,
        }}
        >
            {children}
        </BasketContext.Provider>
    )
}
export default ComputationBasketProvider
