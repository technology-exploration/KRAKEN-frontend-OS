// @flow

import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { I18n } from 'react-redux-i18n'

import styled from 'styled-components'
import Button from '$shared/components/Button'
import { isPaidProduct } from '$mp/utils/product'
import { useBasketContext } from '$mp/Context/ComputationBasketContext'
import ModalPackages from '$shared/components/ModalPackages'
import type { Product, Subscription } from '$mp/flowtype/product-types'
import PaymentRate from '$mp/components/PaymentRate'
import ExpirationCounter from '$mp/components/ExpirationCounter'
import { timeUnits, productStates } from '$shared/utils/constants'
import SocialIcons from './SocialIcons'
import styles from './productDetails2.pcss'

type Props = {
   product: Product,
   isValidSubscription: boolean,
   isFiatPending: boolean,
   productSubscription?: Subscription,
   onPurchase: () => void | Promise<void>,
   downloadDataset?: () => void,
   isPurchasing?: boolean,
   isWhitelisted?: ?boolean,
}

const TWO_DAYS = 2 * 24 * 60 * 60 * 1000

const shouldShowCounter = (endTimestamp: number) => (
    (Date.now() - (endTimestamp * 1000)) < TWO_DAYS
)

const ProductDetails = ({
    product,
    isValidSubscription,
    isFiatPending,
    productSubscription,
    onPurchase,
    downloadDataset,
    isPurchasing,
    isWhitelisted,
}: Props) => {
    const [show, setShow] = useState(false)
    const { addToBasket, basket } = useBasketContext()

    useEffect(() => {

    }, [basket])

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    // eslint-disable-next-line no-shadow
    const buttonTitle = (product: Product, isValidSubscription: boolean, isFiatPending: boolean, isWhitelisted: ?boolean) => {
        if (isFiatPending) {
            return 'Access pending'
        } else if (isPaidProduct(product)) {
            if (product.requiresWhitelist && isWhitelisted === false) {
                return I18n.t('productPage.productDetails.requestAccess')
            }

            if (isValidSubscription && !isFiatPending) {
                return I18n.t('productPage.productDetails.renew')
            }

            if (isValidSubscription && !isFiatPending) {
                return !isValidSubscription && I18n.t('productPage.productDetails.buy')
            }
        }

        if (isPaidProduct(product) && product.type === 'STREAMS') {
            return isValidSubscription ?
                I18n.t('productPage.productDetails.renew') :
                I18n.t('productPage.productDetails.subscribe')
        }
        if (!isPaidProduct(product) && product.type === 'STREAMS') {
            return isValidSubscription ?
                I18n.t('productPage.productDetails.saved') :
                I18n.t('productPage.productDetails.subscribe')
        }
        if (product.type === 'ANALYTICS' && !basket.find((i) => i.id === product.id)) {
            return isValidSubscription ?
                'Subscribed' :
                'Add to basket'
        } else if ((product.type === 'ANALYTICS' && basket.find((i) => i.id === product.id))) {
            return isValidSubscription ?
                'Subscribed' :
                'Added to basket!'
        }

        return isValidSubscription ?
            I18n.t('productPage.productDetails.saved') :
            I18n.t('productPage.productDetails.buy')
    }
    return (
        <div className={styles.root}>
            <div
                className={cx(styles.basics, {
                    [styles.active]: !!isValidSubscription,
                })}
            >
                <h2 className={styles.title}>
                    {product.name}
                </h2>
                <div className={styles.offer}>
                    <div className={styles.paymentRate}>
                        {product.isFree && product.type !== 'ANALYTICS' ?
                            I18n.t('productPage.productDetails.free')
                            : (
                                <React.Fragment>
                                    {
                                        product.type === 'ANALYTICS' ?
                                            <div>
                                                <p className="mt-4">See analyitcs <Link onClick={handleShow}>package options</Link></p>
                                            </div>
                                            :
                                            <PaymentRate
                                                className={styles.price}
                                                amount={product.pricePerSecond}
                                                currency={product.priceCurrency}
                                                timeUnit={timeUnits.hour}
                                            />
                                    }
                                </React.Fragment>
                            )}
                    </div>

                    <ModalPackages show={show} handleClose={handleClose} />

                    {productSubscription != null && !!productSubscription.endTimestamp && shouldShowCounter(productSubscription.endTimestamp) && (
                        <ExpirationCounter expiresAt={new Date(productSubscription.endTimestamp * 1000)} />
                    )}
                </div>
            </div>
            <div className={cx(styles.separator, styles.titleSeparator)} />
            <div className={styles.purchaseWrapper}>
                <div className={styles.buttonWrapper}>
                    <Button
                        className={styles.button}
                        kind="primary"
                        size="big"
                        disabled={
                            isFiatPending || isPurchasing ||
                       isWhitelisted === null ||
                       (!isPaidProduct(product) && isValidSubscription) ||
                       product.state !== productStates.DEPLOYED ||
                       basket.find((i) => i.id === product.id)
                        }

                        onClick={
                            product.type === 'ANALYTICS' ?
                                () => addToBasket(product)
                                : onPurchase
                        }
                        waiting={isPurchasing}
                    >
                        {buttonTitle(product, isValidSubscription, isFiatPending, isWhitelisted)}
                    </Button>
                    {product.contact && (
                        <SocialIcons className={styles.socialIcons} contactDetails={product.contact} />
                    )}
                </div>
                <div className={cx(styles.separator, styles.purchaseSeparator)} />
                {(isValidSubscription && !isFiatPending) || (isValidSubscription && product.type === 'BATCH' && product.priceCurrency !== 'EUR') ? (
                    <Button
                        className={styles.button}
                        kind="primary"
                        size="big"
                        onClick={downloadDataset}
                    >
                        {I18n.t('productPage.productDetails.downloadDataset')}
                    </Button>
                ) : (null)
                }
                {/* {
                    !isFiatPending &&
                    <Button
                        className={styles.button}
                        kind="primary"
                        size="big"
                        onClick={downloadDataset}
                    >
                        {I18n.t('productPage.productDetails.downloadDataset')}
                    </Button>
                } */}
                {isValidSubscription && product.type !== 'ANALYTICS' ? (
                    <div className={cx(styles.separator, styles.purchaseSeparator)} />
                ) : (null)
                }
                <div className={styles.details}>
                    <div>
                        <span className={styles.subheading}>Sold by</span>
                   &nbsp;
                        {product.owner}
                    </div>
                    {product.contact && product.contact.url && (
                        <div>
                            <span className={styles.subheading}>Website</span>
                       &nbsp;
                            <a href={product.contact.url} rel="noopener noreferrer" target="_blank">{product.contact.url}</a>
                        </div>
                    )}
                    {product.contact && product.contact.email && (
                        <div>
                            <a href={`mailto:${product.contact.email}`}>Contact seller</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const Link = styled.button`
   border: none;
   background-color: transparent;
   color: #2648FF;
   padding: 0;
`

export default ProductDetails
