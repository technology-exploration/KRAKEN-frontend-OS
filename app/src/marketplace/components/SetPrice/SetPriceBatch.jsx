/* eslint-disable flowtype/no-types-missing-file-annotation */
import React, { useState, useCallback, useMemo, useEffect } from 'react'
import cx from 'classnames'
import BN from 'bignumber.js'

import styled from 'styled-components'
import useEditableProduct from '$mp/containers/ProductController/useEditableProduct'
import { convert } from '$mp/utils/price'
import type { NumberString, TimeUnit, ContractCurrency as Currency } from '$shared/flowtype/common-types'
import { timeUnits, contractCurrencies as currencies, DEFAULT_CURRENCY } from '$shared/utils/constants'
import PriceField from '$mp/components/PriceField'
import SelectField from '$mp/components/SelectField'

import styles from './setPrice.pcss'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    
  .disabled {
    user-select: none;
  }
  
  .input {
    width: 220px !important;
  }
  `

type Props = {
    price: NumberString,
    onPriceChange: (NumberString) => void,
    timeUnit: TimeUnit,
    onTimeUnitChange: (TimeUnit) => void,
    currency: Currency,
    onCurrencyChange: (Currency) => void,
    disabled: boolean,
    className?: string,
    error?: string,
    newCurrency: string,
    isFiat: boolean,
    isCrypto: boolean,
}

const getQuoteCurrencyFor = (currency: Currency) => (
    currency === currencies.DATA ? currencies.DATA : currencies.EUR
)

const options = [timeUnits.day, timeUnits.month, timeUnits.year].map((unit: TimeUnit) => ({
    label: unit,
    value: unit,
}))

const SetPriceBatch = ({
    price,
    onPriceChange: onPriceChangeProp,
    timeUnit,
    onTimeUnitChange,
    currency,
    onCurrencyChange: onCurrencyChangeProp,
    disabled,
    className,
    error,
    newCurrency,
    isFiat,
    isCrypto,
}: Props) => {
    // eslint-disable-next-line no-unused-vars
    const [quotePrice, setQuotePrice] = useState(BN(0))
    const product = useEditableProduct()

    const onPriceChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        onPriceChangeProp(e.target.value)
    }, [onPriceChangeProp])

    onCurrencyChangeProp(getQuoteCurrencyFor(newCurrency))

    const onCurrencyChange = useCallback(() => {
        if (disabled) { return }
        onCurrencyChangeProp(getQuoteCurrencyFor(newCurrency))
    }, [onCurrencyChangeProp, newCurrency, disabled])

    useEffect(() => {
        onCurrencyChange()
    }, [isFiat, isCrypto, onCurrencyChange])

    useEffect(() => {
        const quoteAmount = convert(price || '0', newCurrency, getQuoteCurrencyFor(currency))
        setQuotePrice(quoteAmount)
    }, [price, currency, newCurrency])

    const selectedValue = useMemo(() => options.find(({ value: optionValue }) => optionValue === timeUnit), [timeUnit])
    return (
        <div className={cx(styles.root, className)}>
            <div
                className={cx({
                    [styles.disabled]: disabled,
                })}
            >
                <Container>
                    <PriceField
                        currency={newCurrency}
                        onChange={onPriceChange}
                        disabled={disabled}
                        placeholder="Price"
                        value={price.toString()}
                        error={error}
                        className="input"
                    />
                    <div>
                        <span className={`${styles.per} mx-4`}>per</span>
                    </div>
                    <SelectField
                        placeholder="Select"
                        options={options}
                        value={selectedValue}
                        onChange={({ value: nextValue }) => onTimeUnitChange(nextValue)}
                        disabled={disabled}
                        className={styles.select}
                        defaultValue={{
                            label: product.timeUnit, value: product.timeUnit,
                        }}
                    />
                </Container>

            </div>
        </div>
    )
}

SetPriceBatch.defaultProps = {
    price: BN(0),
    onPriceChange: () => {},
    timeUnit: timeUnits,
    onTimeUnitChange: () => {},
    currency: DEFAULT_CURRENCY,
    onCurrencyChange: () => {},
    disabled: false,
}

export default SetPriceBatch
