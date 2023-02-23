/* eslint-disable flowtype/no-types-missing-file-annotation */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable max-len */

import React, { useCallback, useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'
import SetPriceBatch from '$mp/components/SetPrice/SetPriceBatch'

import { isDataUnionProduct } from '$mp/utils/product'
import { usePending } from '$shared/hooks/usePending'
import { contractCurrencies as currencies } from '$shared/utils/constants'
import { selectDataPerEur } from '$mp/modules/global/selectors'
import SetPrice from '$mp/components/SetPrice'
import { selectUserData } from '$shared/modules/user/selectors'
import { selectContractProduct } from '$mp/modules/contractProduct/selectors'

import { convert } from '$mp/utils/price'
import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { isPublished } from './state'
import { Context as EditControllerContext } from './EditControllerProvider'

import BeneficiaryAddress from './BeneficiaryAddress'

import styles from './PriceSelector.pcss'
import docsLinks from '$shared/../docsLinks'

// import * as TestRunner from 'node_modules/jest-runner/build/index'

type Props = {
    disabled?: boolean,
}

const displayInline = {
    display: 'inline-flex',
}

const padding = {
    padding: '10px',
    marginRight: '10px',
}

// eslint-disable-next-line max-len
const PaidRadioButton = ({
    name1, id, updateIsFree, isFreeProduct, isPriceTypeDisabled, isAnalytics,
}: { name1: string, id: string, updateIsFree: any, isFreeProduct: any, isPriceTypeDisabled: any, isAnalytics: any }) => (
    <div id={id} style={displayInline}>
        <div style={padding}>
            <input
                id="PaidYes"
                type="radio"
                name={name1}
                value="Paid"
                disabled={isPriceTypeDisabled}
                onChange={(e) => {
                    updateIsFree(!e.target.checked)
                }}
                {...isFreeProduct ? '' : 'checked'}
            />
            <label htmlFor="PaidYes">Paid</label>
        </div>
        {
            !isAnalytics &&
            <div style={padding}>
                <input
                    id="PaidNo"
                    type="radio"
                    name={name1}
                    disabled={isPriceTypeDisabled}
                    onChange={(e) => {
                        updateIsFree(e.target.checked)
                    }}
                    value="Free"
                    {...isFreeProduct ? 'checked' : ''}
                    defaultChecked
                />
                <label htmlFor="PaidNo">Free</label>
            </div>
        }
    </div>
)

const PaidRadioButtonBatch = ({
    name1, id, updateIsFree, isFreeProduct, isPriceTypeDisabled, setIsCrypto, setIsFiat, product,
}: { name1: string, id: string, updateIsFree: any, isFreeProduct: any, isPriceTypeDisabled: any, setIsCrypto: any, setIsFiat: any, product: any, }) => (
    <div id={id} style={displayInline}>
        <div style={padding}>
            <input
                id="PaidCrypto"
                type="radio"
                name={name1}
                value="PaidCrypto"
                disabled={isPriceTypeDisabled}
                onChange={(e) => {
                    updateIsFree(!e.target.checked)
                    setIsCrypto(true)
                    setIsFiat(false)
                }}
                {...product === 'D A T A' ? 'checked' : ''}
            />
            <label htmlFor="PaidCrypto">Paid access in crypto ($DATA)</label>
        </div>
        <div style={padding}>
            <input
                id="PaidFiat"
                type="radio"
                name={name1}
                value="PaidFiat"
                disabled={isPriceTypeDisabled}
                onChange={(e) => {
                    updateIsFree(!e.target.checked)
                    setIsCrypto(false)
                    setIsFiat(true)
                }}
                {...product === 'E U R' ? 'checked' : ''}
                defaultChecked={product === 'EUR' || null}
            />
            <label htmlFor="PaidFiat">Paid access in fiat (EUR)</label>
        </div>
        <div style={padding}>
            <input
                id="PaidNo"
                type="radio"
                name={name1}
                disabled={isPriceTypeDisabled}
                onChange={(e) => {
                    updateIsFree(e.target.checked)
                    setIsCrypto(false)
                    setIsFiat(true)
                }}
                value="Free"
                checked={isFreeProduct || null}
                {...isFreeProduct ? 'checked' : ''}
                defaultChecked={isFreeProduct || null}
            />
            <label htmlFor="PaidNo">Free access</label>
        </div>
    </div>
)

const PriceSelector = ({ disabled }: Props) => {
    const product = useEditableProduct()
    const { type } = product
    const { publishAttempted, preferredCurrency: currency, setPreferredCurrency: setCurrency } = useContext(EditControllerContext)
    const { updateIsFree, updatePrice, updateBeneficiaryAddress, updateCurrency } = useEditableProductActions()
    const dataPerUsd = useSelector(selectDataPerEur)
    const { isPending: contractProductLoadPending } = usePending('contractProduct.LOAD')
    const isPublic = isPublished(product)
    const contractProduct = useSelector(selectContractProduct)
    const isDisabled = !!(disabled || contractProductLoadPending)
    const isPriceTypeDisabled = !!(isDisabled || isPublic || !!contractProduct)
    const [isFiat, setIsFiat] = useState(false)
    const [isCrypto, setIsCrypto] = useState(false)
    const currentUser = useSelector(selectUserData)

    // eslint-disable-next-line no-nested-ternary
    const changecurrency = (isFiat && currencies.EUR) || (isCrypto && currencies.DATA) || (product.priceCurrency === 'EUR' && currencies.EUR) || (product.priceCurrency === 'DATA' && currencies.DATA)
    useEffect(() => {
        setCurrency(changecurrency)
        updateCurrency(changecurrency)
    }, [isFiat, isCrypto, setCurrency, changecurrency, updateCurrency, product.priceCurrency, product.timeUnit])

    const onPriceChange = useCallback((p) => {
        const price = convert(p, dataPerUsd, currency, product.priceCurrency)
        updatePrice(price, product.priceCurrency, product.timeUnit)
    }, [dataPerUsd, currency, product.priceCurrency, product.timeUnit, updatePrice])

    const onTimeUnitChange = useCallback((t) => {
        updatePrice(product.price, product.priceCurrency, t)
    }, [updatePrice, product.price, product.priceCurrency])

    // const fixInFiat = product.priceCurrency === currencies.EUR

    // const onFixPriceChange = useCallback((checked) => {
    //     const newCurrency = checked ? currencies.EUR : currencies.DATA
    //     const newPrice = convert(product.price, dataPerUsd, product.priceCurrency, newCurrency)
    //     updatePrice(newPrice, newCurrency, product.timeUnit)
    // }, [updatePrice, product.price, product.priceCurrency, product.timeUnit, dataPerUsd])

    const isFreeProduct = !!product.isFree
    const isDataUnion = isDataUnionProduct(product)

    const { isValid, message } = useValidation('pricePerSecond')
    const name1 = 'paidRadioButton'
    const paidId = 'paidId'

    if (type === 'ANALYTICS') {
        () => updateIsFree(false)
    }

    useEffect(() => {

    }, [])

    return (
        <section id="price" className={cx(styles.root, styles.PriceSelector)}>
            <div>
                {
                    type === 'ANALYTICS' &&
                        <div>
                            <Translate
                                tag="h1"
                                value="editProductPage.setAddress.title"
                            />
                            <BeneficiaryAddress
                                address={product.beneficiaryAddress}
                                onChange={updateBeneficiaryAddress}
                                disabled={false}
                            />
                        </div>
                }
                {
                    type !== 'ANALYTICS' && (
                        type === 'BATCH' && currentUser.institutionalAffiliation === 'Yes' ?
                            <div>
                                <Translate
                                    tag="h1"
                                    value="editProductPage.setPrice.title"
                                />
                                <Translate
                                    tag="p"
                                    value="Define if the access to the data is provided for a fee in either crypto or fiat currency, of if it is free of charge. In case of paid data access, define also the price to be paid"
                                    docsLink={docsLinks.createProduct}
                                    dangerousHTML
                                />
                            </div>
                            :
                            <div>
                                <Translate
                                    tag="h1"
                                    value="editProductPage.setPrice.title"
                                />
                                <Translate
                                    tag="p"
                                    value="editProductPage.setPrice.description"
                                    docsLink={docsLinks.createProduct}
                                    dangerousHTML
                                />
                            </div>
                    )
                }

                {
                    type !== 'ANALYTICS' && (
                        type === 'BATCH' && currentUser.institutionalAffiliation === 'Yes' ?
                            <PaidRadioButtonBatch
                                name1={name1}
                                id={paidId}
                                updateIsFree={updateIsFree}
                                isFreeProduct={isFreeProduct}
                                isPriceTypeDisabled={isPriceTypeDisabled}
                                setIsCrypto={setIsCrypto}
                                setIsFiat={setIsFiat}
                                product={product.priceCurrency}
                            />
                            :
                            <PaidRadioButton
                                name1={name1}
                                id={paidId}
                                updateIsFree={updateIsFree}
                                isFreeProduct={isFreeProduct}
                                isPriceTypeDisabled={isPriceTypeDisabled}
                                isAnalytics={type === 'ANALYTICS'}
                            />
                    )
                }

                <div className={cx(styles.inner, {
                    [styles.disabled]: isFreeProduct || isDisabled,
                })}
                >
                    {
                        type !== 'ANALYTICS' && (type === 'STREAMS' || (type === 'BATCH' && currentUser.institutionalAffiliation === 'No')) &&
                            <SetPrice
                                className={styles.priceSelector}
                                disabled={isFreeProduct || isDisabled}
                                price={convert(product.price, dataPerUsd, product.priceCurrency, currency)}
                                onPriceChange={onPriceChange}
                                currency={currency}
                                onCurrencyChange={setCurrency}
                                timeUnit={product.timeUnit}
                                onTimeUnitChange={onTimeUnitChange}
                                dataPerUsd={dataPerUsd}
                                error={publishAttempted && !isValid ? message : undefined}
                                isFiat={isFiat}
                            />
                    }

                    {
                        type === 'BATCH' && currentUser.institutionalAffiliation === 'Yes' &&
                            <SetPriceBatch
                                className={styles.priceSelector}
                                disabled={isFreeProduct || isDisabled}
                                price={convert(product.price, dataPerUsd, product.priceCurrency, currency)}
                                onPriceChange={onPriceChange}
                                currency={currency}
                                onCurrencyChange={setCurrency}
                                timeUnit={product.timeUnit}
                                onTimeUnitChange={onTimeUnitChange}
                                dataPerUsd={dataPerUsd}
                                error={publishAttempted && !isValid ? message : undefined}
                                newCurrency={changecurrency}
                                isFiat={isFiat}
                                isCrypto={isCrypto}
                            />
                    }

                </div>
                <div
                    className={cx({
                        [styles.priceOptions]: !!isDataUnion,
                        [styles.priceOptionsWithAddress]: !isDataUnion,
                    })}
                >
                    {
                        type !== 'ANALYTICS' &&
                            <BeneficiaryAddress
                                address={product.beneficiaryAddress}
                                onChange={updateBeneficiaryAddress}
                                disabled={false}
                            />
                    }
                </div>
            </div>
        </section>
    )
}

export default PriceSelector
