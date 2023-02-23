/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'
import Table from 'react-bootstrap/Table'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import { selectUserData } from '$shared/modules/user/selectors'
import { getToken } from '$shared/utils/sessionToken'
import { PaymentWithoutTimeUnit } from '$mp/components/PaymentRate'
import { getProductSubscriptionsFiat, getProductById } from '$mp/modules/product/services'
import { getUserInfo, WhitelistSubscription } from '$shared/modules/user/services'

const title = {
    width: '100%',
    lineHeight: '1.5',
    fontSize: '26px',
    color: 'black',
    display: 'block',
}

const Container = styled.section`
    margin: 0 60px
`

const ColTitle = styled.th`
width: 330px;
font-size: 12px;
font-weight: normal;
text-align: left;
color: #989898;
`

const ProvideAccessBtn = styled.button`
border:  none;
background-color: transparent;
color: #386f88;
font-size: 12px;
`

const RowItem = styled.th`
font-size: 12px;
line-height: 1.7;
font-weight: normal;
padding-right: 20px;
width: 240px;
`

const Tr = styled.tr`
border-top: 0.7px solid black !important
`

const Tbody = styled.tbody`
border-top: none;
`

const FiatPayments = () => {
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null && !!getToken()
    const [subscriptions, setSubscriptions] = useState([])
    const [users, setUsers] = useState([])
    const [update, setUpdate] = useState(false)

    useEffect(() => {

    }, [isLoggedIn])

    // const calcDueDate = (subscriptionFrom, periodNumber, period) => {
    //     const isSubscriptionMonth = period === 'month'
    //     const isSubscriptionDay = period === 'day'
    //     const isSubscriptionYear = period === 'year'

    //     console.log(subscriptionFrom)
    //     console.log(periodNumber)
    //     console.log(period)

    //     // calcDueDate(subscription.subscriptionFrom, subscription.period.periodNumber, subscription.period.period)
    // }

    // const getPricePerSecond = (id) => {
    //     try {
    //         getProductById(id)
    //             .then((res) => res.pricePerSecond)
    //     } catch (e) {
    //         console.log('ERROR ', e)
    //     }
    // }

    const handleWhitelist = (id) => {
        try {
            WhitelistSubscription(id)
                .then(() => setUpdate(true))
        } catch (e) {
            console.log('ERROR ', e)
        }
    }

    function toMonthName(monthNumber) {
        const date = new Date()
        date.setMonth(monthNumber - 1)

        return date.toLocaleString('en-US', {
            month: 'long',
        }).slice(0, 3)
    }

    useEffect(() => {
        try {
            getProductSubscriptionsFiat()
                .then((res) => setSubscriptions(res))
        } catch (e) {
            console.log('ERROR ', e)
        }
    }, [update])

    useEffect(() => {
        subscriptions.length && subscriptions.map((subscription) => {
            try {
                getUserInfo(subscription.userId)
                    .then((res) => setUsers([...users, res.registrationInfo]))
            } catch (e) {
                console.log('ERROR ', e)
            }
        })
    }, [subscriptions])

    useEffect(() => {

    }, [users])

    return (
        // <ProductController key={props.match.params.id} ignoreUnauthorized requirePublished>
        <Layout>
            <MarketplaceHelmet />
            <Container>
                <Translate
                    value="Invoices for fiat payments"
                    className="mb-2 w-100"
                    style={title}
                />
                <div
                    style={{
                        marginTop: 40,
                        marginBottom: 90,
                    }}
                >
                    <Table
                        responsive="sm"
                        className="mt-5"
                        style={{
                            borderTop: '2px solid transparent',
                            width: '90%',
                        }}
                    >
                        <Tbody>
                            <Tr>
                                <ColTitle>User</ColTitle>
                                <ColTitle>Company</ColTitle>
                                <ColTitle>Data product(s)</ColTitle>
                                <ColTitle>Invoice date</ColTitle>
                                <ColTitle>Total</ColTitle>
                                <ColTitle>Data product access</ColTitle>
                                <ColTitle>Subscription valid until</ColTitle>
                                <ColTitle> </ColTitle>
                            </Tr>
                            {
                                subscriptions.map((subscription, idx) => (
                                    <Tr key={`subscription-${idx}`}>
                                        <RowItem>{users.length && users[idx]?.firstName} {users.length && users[idx]?.givenName}</RowItem>
                                        <RowItem>{users.length && users[idx].institution}</RowItem>
                                        <RowItem>{subscription.product.name}</RowItem>
                                        <RowItem>{subscription.dateCreated.slice(8, 10)} {toMonthName(subscription.dateCreated.slice(5, 7))}, {subscription.dateCreated.slice(0, 4)}</RowItem>
                                        <RowItem>
                                            {/* getPricePerSecond(subscription?.product?.id) */}
                                            <PaymentWithoutTimeUnit
                                                amount={subscription.product.pricePerSecond / 1000000000}
                                                currency="EUR"
                                                amountTime={subscription.period.periodNumber}
                                                timeUnit={subscription.period.period}
                                            />
                                        </RowItem>
                                        <RowItem>{subscription?.subscriptionFrom ? `From ${subscription.dateCreated.slice(8, 10)} ${toMonthName(subscription.dateCreated.slice(5, 7))}, ${subscription.dateCreated.slice(0, 4)}` : 'Access not provided'}</RowItem>
                                        <RowItem>{subscription.pending ? '-' : `${subscription.endsAt.slice(8, 10)} ${toMonthName(subscription.endsAt.slice(5, 7))}, ${subscription.endsAt.slice(0, 4)}`}</RowItem>
                                        <RowItem>
                                            <ProvideAccessBtn onClick={() => handleWhitelist(subscription._id)}>{subscription.pending && 'Provide access'}</ProvideAccessBtn>
                                        </RowItem>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </div>
            </Container>
        </Layout>
    // </ProductController>
    )
}

export default () => (
    <FiatPayments />
)
