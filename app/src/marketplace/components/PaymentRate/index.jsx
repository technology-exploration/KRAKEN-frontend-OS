/* eslint-disable flowtype/no-types-missing-file-annotation */
import React from 'react'
import BN from 'bignumber.js'
import type { ContractCurrency as Currency, TimeUnit } from '$shared/flowtype/common-types'
import { formatPrice, formatPriceNoTimeUnit } from '$mp/utils/price'

type Props = {
    amount: BN,
    currency: Currency,
    timeUnit: TimeUnit,
    className?: string,
}

const PaymentRate = (props: Props) => {
    const {
        amount,
        currency,
        timeUnit,
        amountTime,
        className,
    } = props

    return (
        <div className={className}>{formatPrice(amount, currency, timeUnit, amountTime || null)}</div>
    )
}

export const PaymentWithoutTimeUnit = (props: Props) => {
    const {
        amount,
        currency,
        amountTime,
        timeUnit,
        className,
    } = props

    return (
        <div className={className}>{formatPriceNoTimeUnit(amount, currency, timeUnit, amountTime || null)}</div>
    )
}

export default PaymentRate
