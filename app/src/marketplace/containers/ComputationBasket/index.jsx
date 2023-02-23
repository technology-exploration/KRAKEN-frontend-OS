// @flow

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'
import Table from 'react-bootstrap/Table'
import Button from '$shared/components/Button'
import { useBasketContext } from '$mp/Context/ComputationBasketContext'
import Layout from '$shared/components/Layout'
// import { postAnalyticsComputation } from '$mp/modules/product/services'

import { MarketplaceHelmet } from '$shared/components/Helmet'
// import type { ProductId } from '$mp/flowtype/product-types'
// import * as RouterContext from '$shared/contexts/Router'
// import usePending from '$shared/hooks/usePending'

// import { getProductSubscription } from '$mp/modules/product/actions'
// import PrestyledLoadingIndicator from '$shared/components/LoadingIndicator'

// import useProduct from '$mp/containers/ProductController/useProduct'
import { selectUserData } from '$shared/modules/user/selectors'
import { getToken } from '$shared/utils/sessionToken'
// import { product } from 'platform'
// import ProductController, { useController } from '../ProductController'

// const LoadingIndicator = styled(PrestyledLoadingIndicator)`
//     top: 2px;
// `

const title = {
    width: '100%',
    lineHeight: '1.5',
    fontSize: '26px',
    color: 'black',
    display: 'block',
}

const titleSummary = {
    width: '100%',
    lineHeight: '1.5',
    fontSize: '22px',
    color: '#386f88',
    display: 'block',
}

const subtitle = {
    width: '100%',
    lineHeight: '1.5',
    fontSize: '14px',
    color: 'black',
    display: 'block',
}

const noProducts = {
    width: 'fit-content',
    lineHeight: '1.5',
    fontSize: '14px',
    color: 'red',
    display: 'block',
    padding: '10px',
    border: '1px solid red',
}

const Container = styled.section`
    margin: 0 50px
`

const ColTitle = styled.th`
width: 330px;
font-size: 12px;
font-weight: normal;
text-align: left;
`

const ColDelete = styled.th`
width: 100px;
font-size: 12px;
font-weight: normal;
text-align: left;
`

const DeleteBtn = styled.button`
border:  none;
background-color: transparent;
color: #386f88;
font-size: 13px;
`

const RowItem = styled.th`
font-size: 11px;
line-height: 1.7;
font-weight: normal;
padding-right: 20px;
width: 200px;
`
const RowItemLink = styled(Link)`
font-size: 11px;
text-decoration: none;
color: black !important;
line-height: 1.7;
font-weight: normal;
padding-right: 20px;
`

const RowVariables = styled.th`
font-size: 11px;
line-height: 1.7;
font-weight: normal;
padding-right: 20px !important;
`

const Tr = styled.tr`
border-top: 0.7px solid black !important
`

const Tbody = styled.tbody`
border-top: none;
`

const ComputationBasket = () => {
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null && !!getToken()

    let suitablePackage

    useEffect(() => {

    }, [isLoggedIn, suitablePackage])

    const {
        basket, totalEntries, removeItem, clearAll, totalVariables, ids, purchaseAnalyticsComputation, waiting,
    } = useBasketContext()

    const packages = [
        {
            name: 'Standard package', amountOfPackages: 3, price: 1,
        },
        {
            name: 'Medium package', amountOfPackages: 6, price: 2,
        },
        {
            name: 'Premium package', amountOfPackages: 10, price: 3,
        },
    ]

    const firstPackage = packages[0].amountOfPackages
    const secondPackage = packages[1].amountOfPackages
    const thirdPackage = packages[2].amountOfPackages

    if (basket.length <= firstPackage) {
        // eslint-disable-next-line prefer-destructuring
        suitablePackage = packages[0]
    } else if (basket.length > firstPackage && basket.length <= secondPackage) {
        // eslint-disable-next-line prefer-destructuring
        suitablePackage = packages[1]
    } else if (basket.length > secondPackage && basket.length <= thirdPackage) {
        // eslint-disable-next-line prefer-destructuring
        suitablePackage = packages[2]
    }

    return (
        // <ProductController key={props.match.params.id} ignoreUnauthorized requirePublished>
        <Layout>
            <MarketplaceHelmet />
            <Container>
                <Translate
                    value="Computation basket for privacy preserving analytics"
                    className="mb-2 w-100"
                    style={title}
                />
                <Translate
                    value="You have the following data analytics products waiting for computation"
                    // className="mb-2"
                    style={subtitle}
                />
                {
                    (basket.length === 0) &&
                        <Translate
                            value="Oops, there are no products in your basket!"
                            className="my-4"
                            style={noProducts}
                        />
                }
                {
                    (basket.length > 0) &&
                    <div
                        style={{
                            width: '65%',
                            marginTop: 20,
                        }}
                    >
                        <div>
                            <Table responsive="sm">
                                <thead>
                                    <tr>
                                        <ColTitle>Name</ColTitle>
                                        <ColTitle>Market sector</ColTitle>
                                        <ColTitle>Variables</ColTitle>
                                        <ColTitle>Number of records</ColTitle>
                                        <ColDelete />

                                    </tr>
                                </thead>
                                <Tbody>
                                    {basket.map((item) =>
                                        (
                                            <tr key={item.name}>
                                                <RowItem>
                                                    <RowItemLink to={`/marketplace/products/${item.id}`}>
                                                        {item.name}
                                                    </RowItemLink>
                                                </RowItem>
                                                <RowItem>{item.sector}</RowItem>
                                                <RowVariables>{item.columnVariables ? item.columnVariables.join(', ') : null}</RowVariables>
                                                <RowItem>{item.numberOfRecords}</RowItem>
                                                <RowItem>
                                                    <DeleteBtn
                                                        onClick={() => removeItem(item)}
                                                    >
                                                        Delete
                                                    </DeleteBtn>
                                                </RowItem>
                                            </tr>
                                        ))
                                    }

                                </Tbody>
                            </Table>
                            <div className="d-flex justify-content-end mt-4 mx-2">
                                <Button
                                    kind="primary"
                                    size="mini"
                                    className="text-center"
                                    onClick={clearAll}
                                >
                                    Clear all
                                </Button>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: 90,
                                marginBottom: 90,
                            }}
                        >
                            <Translate
                                value="Summary of analytics computation"
                                className="mb-2 w-100"
                                style={titleSummary}
                            />
                            <Translate
                                value="Privacy preserving, remote analysis will be computed based on the following specifications:"
                                className="my-2"
                                style={subtitle}
                            />
                            <Table
                                responsive="sm"
                                className="mt-5"
                                style={{
                                    borderTop: '2px solid transparent',
                                }}
                            >
                                <Tbody>
                                    <Tr>
                                        <ColTitle>Number of datasets selected</ColTitle>
                                        <ColTitle>{basket.length}</ColTitle>
                                    </Tr>
                                    <Tr>
                                        <RowItem>Records in total</RowItem>
                                        <RowItem>{totalEntries}</RowItem>
                                    </Tr>
                                    <Tr>
                                        <RowItem>Common variables in datasets</RowItem>
                                        <RowItem>{totalVariables}</RowItem>
                                    </Tr>
                                    <Tr>
                                        <RowItem>Analytics functions to be computed</RowItem>
                                        <RowItem>Average, Standard deviation, Min and Max</RowItem>
                                    </Tr>
                                    <Tr>
                                        <RowItem>Required analytics package</RowItem>
                                        <RowItem>
                                            {suitablePackage && suitablePackage.name}
                                        </RowItem>
                                    </Tr>
                                    <Tr>
                                        <RowItem>Price</RowItem>
                                        <RowItem>{suitablePackage && suitablePackage.price} $DATA</RowItem>
                                    </Tr>
                                </Tbody>
                            </Table>
                            <div className="d-flex justify-content-center mt-5">
                                <Button
                                    kind="primary"
                                    size="big"
                                    className="text-center"
                                    onClick={() => purchaseAnalyticsComputation(ids, (suitablePackage && suitablePackage.price))}
                                    waiting={waiting}
                                >
                                    Buy analytics package
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            </Container>
        </Layout>
    // </ProductController>
    )
}

export default () => (
    <ComputationBasket />
)
