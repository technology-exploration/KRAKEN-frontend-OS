/* eslint-disable no-console */
/* eslint-disable max-len */

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'
import Table from 'react-bootstrap/Table'
import html2pdf from 'html2pdf.js'
import ProductPage from '$shared/components/ProductPage'
import Layout from '$shared/components/Layout'
import Button from '$shared/components/Button'
import { getProductSeller } from '$shared/modules/user/services'
import { getProductById, getUserSubscription } from '$mp/modules/product/services'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import { selectUserData } from '$shared/modules/user/selectors'
import { getToken } from '$shared/utils/sessionToken'
import { PaymentWithoutTimeUnit } from '$mp/components/PaymentRate'
import { timeUnits } from '$shared/utils/constants'

const title = {
    width: '100%',
    lineHeight: '1.5',
    fontSize: '26px',
    color: 'black',
    display: 'block',
}

const Container = styled.section`
    margin: 0 90px;
    width: 75%;
`

const ColTitle = styled.th`
width: 330px;
font-size: 18px;
font-weight: normal;
text-align: left;
border: 0px solid transparent;
border-color: transparent;
height: 40px !important;
`

const TotalRow = styled.th`
width: 330px;
font-size: 14px;
font-weight: bold;
text-align: left;
border-bottom: 1px solid transparent;
padding-top: 27px !important;
`

const RowItem = styled.th`
font-size: 14px;
line-height: 1.7;
font-weight: normal;
padding-right: 20px;
width: 240px;
`
const NewDiv = styled.div`
font-size: 14px;
line-height: 1.7;
font-weight: normal !important;
padding-right: 20px;
margin-top: 9px;
width: 240px;
`
const Tr = styled.tr`
border-top: 0.7px solid black !important
`

const Tbody = styled.tbody`
border-top: none;
`

const Invoice = () => {
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null && !!getToken()
    const { id } = useParams()
    const [sellerCredential, setSellerCredential] = useState([])
    const [subscriptionPeriodInfo, setSubscriptionPeriodInfo] = useState([])
    const [product, setProduct] = useState([])
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const isSubscriptionHour = subscriptionPeriodInfo.period === 'hour'
    const isSubscriptionMonth = subscriptionPeriodInfo.period === 'month'
    const isSubscriptionDay = subscriptionPeriodInfo.period === 'day'
    const isSubscriptionYear = subscriptionPeriodInfo.period === 'year'

    const today = new Date()
    const month = months[today.getMonth()]
    const monthDue = months[today.getMonth() + subscriptionPeriodInfo.periodNumber]
    const date = `${today.getDate()} ${month}, ${today.getFullYear()}`
    const dueDate = `${today.getDate()} ${months[today.getMonth() + 1]}, ${today.getFullYear()}`
    const dueDateDay = (today.getDate() + subscriptionPeriodInfo.periodNumber) > 30 ? `${isSubscriptionDay && ((today.getDate() + subscriptionPeriodInfo.periodNumber) - 30)} ${months[today.getMonth() + 1]}, ${today.getFullYear()}` : `${isSubscriptionDay && (today.getDate() + subscriptionPeriodInfo.periodNumber)} ${month}, ${today.getFullYear()}`
    const dueDateMonth = `${today.getDate()} ${isSubscriptionMonth ? monthDue : month}, ${today.getFullYear()}`
    const dueDateYear = `${today.getDate()} ${month}, ${isSubscriptionYear && (today.getFullYear() + subscriptionPeriodInfo.periodNumber)}`

    console.log(product.pricePerSecond)
    const savePdf = () => {
        const element = document.querySelector('#invoice')

        const opt = {
            filename: 'kraken-invoice.pdf',
            margin: [20, 25, 20, 0],
            image: {
                type: 'jpeg', quality: 0.9,
            },
            html2canvas: {
                allowTaint: true,
                scale: 2,
                useCORS: true,
            },
            jsPDF: {
                format: 'letter', orientation: 'landscape',
            },
        }
        html2pdf(element, opt)
    }

    useEffect(() => {
        try {
            getProductById(id || '')
                .then((res) => setProduct(res))
        } catch (e) {
            console.log('ERROR', e)
        }
    }, [id])

    useEffect(() => {
        if (product.ownerId) {
            try {
                getProductSeller(product.ownerId)
                    .then((res) => setSellerCredential(res))
            } catch (e) {
                console.log('ERROR', e)
            }
        }
    }, [product])

    useEffect(() => {
        try {
            getUserSubscription(id)
                .then((res) => setSubscriptionPeriodInfo(res.period))
        } catch (e) {
            console.log('ERROR', e)
        }
    }, [id])

    useEffect(() => {
    }, [isLoggedIn, userData, sellerCredential, subscriptionPeriodInfo])

    return (
        <Layout>
            <MarketplaceHelmet />
            <ProductPage>
                <Container>
                    <Translate
                        value="Invoice"
                        className="mb-5 w-100"
                        style={title}
                    />
                    <div id="invoice">
                        <div
                            style={{
                                marginTop: 20,
                                marginBottom: 90,
                                color: 'black',
                                lineHeight: 0.5,
                            }}
                        >

                            <div className="row mb-5">
                                <div
                                    className=""
                                    style={{
                                        width: 440,
                                    }}
                                >
                                    <p>{sellerCredential && sellerCredential.institution}</p>
                                    <p>{sellerCredential && sellerCredential.invoicingName}</p>
                                    <p>{sellerCredential && sellerCredential.invoicingAddress}</p>
                                    <p>{sellerCredential && sellerCredential.invoicingZipCode}, {sellerCredential && sellerCredential.invoicingCountry} </p>
                                </div>
                                <div
                                    className=""
                                    style={{
                                        width: 330,
                                    }}
                                >
                                    <p>Invoice to:</p>
                                    <p>{userData && userData.invoicingName}</p>
                                    <p>{userData && userData.name}</p>
                                </div>
                                <div
                                    className=""
                                    style={{
                                        width: 330,
                                    }}
                                />
                            </div>
                            <div className="row pt-3">
                                <div className="col-3">
                                    <p>Invoice date: {date}
                                    </p>
                                    <p>Terms: Due on receipt</p>
                                    {/* <p>Due date: {(isSubscriptionHour && date) || (isSubscriptionDay && dueDateDay) || (isSubscriptionMonth && dueDateMonth) || (isSubscriptionYear && dueDateYear)}</p> */}
                                    <p>Due date: {dueDate}</p>
                                    <p>Invoice number: 0001</p>
                                </div>
                                <div className="col-3" />
                            </div>
                            <Table
                                responsive="sm"
                                className=""
                                style={{
                                    borderTop: '2px solid transparent',
                                    width: '90%',
                                    marginTop: 60,
                                }}
                            >
                                <Tbody>
                                    <Tr>
                                        <ColTitle>Data product</ColTitle>
                                        <ColTitle>Period</ColTitle>
                                        <ColTitle>Amount</ColTitle>
                                    </Tr>
                                    <Tr>
                                        <RowItem>{product && product.name}</RowItem>
                                        <RowItem>{subscriptionPeriodInfo && subscriptionPeriodInfo.periodNumber} {subscriptionPeriodInfo && subscriptionPeriodInfo.period} </RowItem>
                                        <RowItem>
                                            <PaymentWithoutTimeUnit
                                                amount={product.pricePerSecond}
                                                currency="EUR"
                                                amountTime={subscriptionPeriodInfo.periodNumber}
                                                timeUnit={subscriptionPeriodInfo.period}
                                            />
                                        </RowItem>
                                        {/* <RowItem>{product && product.price} {product && product.priceCurrency} / {product && product.timeUnit}</RowItem> */}
                                    </Tr>
                                    <Tr>
                                        <TotalRow>TOTAL</TotalRow>
                                        <TotalRow> </TotalRow>
                                        <TotalRow>
                                            {/* {product && product.price} {product && product.priceCurrency} */}
                                            <PaymentWithoutTimeUnit
                                                amount={product.pricePerSecond}
                                                currency="EUR"
                                                amountTime={subscriptionPeriodInfo.periodNumber}
                                                timeUnit={subscriptionPeriodInfo.period}
                                            />
                                            {
                                                console.log(product.pricePerSecond)
                                            }
                                            {
                                                console.log(subscriptionPeriodInfo.periodNumber)
                                            }
                                            {
                                                console.log(subscriptionPeriodInfo.period)
                                            }
                                        </TotalRow>
                                    </Tr>
                                </Tbody>
                            </Table>
                            <div className="row mt-5">
                                <div className="col-6">
                                    <p className="mb-4">Payment instructions:</p>
                                    <p>{sellerCredential && sellerCredential.paymentInstructions}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="d-flex justify-content-center"
                        style={{
                            marginTop: 50,
                        }}
                    >
                        <Button onClick={savePdf}>Download invoice</Button>
                    </div>
                </Container>
            </ProductPage>
        </Layout>
    )
}

export default () => (
    <Invoice />
)
