/* eslint-disable max-len */
// @flow

import React, { useMemo } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import BN from 'bignumber.js'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import type { TimeUnit, PaymentCurrency } from '$shared/flowtype/common-types'
import { contractCurrencies } from '$shared/utils/constants'
import { formatDecimals } from '$mp/utils/price'

import styles from './purchaseSummaryDialog.pcss'

export type Props = {
    name: string,
    time: string,
    timeUnit: TimeUnit,
    paymentCurrency: PaymentCurrency,
    price: BN,
    approxEur: BN,
    waiting?: boolean,
    onBack: () => void,
    onCancel: () => void,
    onPay: () => void | Promise<void>,
}

export const PurchaseSummaryDialog = ({
    name,
    time,
    timeUnit,
    price: priceProp,
    paymentCurrency,
    approxEur: approxEurProp,
    waiting,
    onCancel,
    onBack,
    onPay,
}: Props) => {
    const price = useMemo(() => formatDecimals(priceProp, paymentCurrency), [priceProp, paymentCurrency])

    const approxEur = useMemo(() => formatDecimals(approxEurProp, contractCurrencies.EUR), [approxEurProp])

    return (
        <ModalPortal>
            <Dialog
                onClose={onCancel}
                title={I18n.t('modal.purchaseSummary.title')}
                actions={{
                    back: {
                        title: I18n.t('modal.purchaseSummary.back'),
                        kind: 'link',
                        onClick: () => onBack(),
                        disabled: !!waiting,
                    },
                    next: {
                        title: I18n.t('modal.purchaseSummary.payNow'),
                        kind: 'primary',
                        onClick: () => onPay(),
                        spinner: !!waiting,
                        disabled: !!waiting,
                    },
                }}
                contentClassName={styles.purchaseSummaryContent}
                disclaimer="Please be aware that once the selected access period expires you must stop processing and delete the data from any storage device or server"
            >
                <p className={styles.purchaseInfo}>
                    <strong>{name}</strong>
                    <Translate
                        value="modal.purchaseSummary.time"
                        time={time}
                        timeUnit={I18n.t(`common.timeUnit.${timeUnit}`)}
                        className={styles.time}
                    />
                </p>
                <div>
                    <span className={styles.priceValue}>
                        {price}
                        <span className={styles.priceCurrency}>
                            {paymentCurrency}
                        </span>
                    </span>
                    <p className={styles.EurEquiv}>
                        {I18n.t('modal.chooseAccessPeriod.approx')} {approxEur} {contractCurrencies.EUR}
                    </p>
                </div>
            </Dialog>
        </ModalPortal>
    )
}

PurchaseSummaryDialog.defaultProps = {
    waiting: false,
}

export default PurchaseSummaryDialog
