// @flow

import React from 'react'
import { Route as RouterRoute } from 'react-router-dom'

import withErrorBoundary from '$shared/utils/withErrorBoundary'

import ErrorPage from '$shared/components/ErrorPage'

import ProductPage from '$mp/containers/ProductPage'
import StreamPreviewPage from '$mp/containers/StreamPreviewPage'
import Products from '$mp/containers/Products'
import NewProductPage from '$mp/components/NewProductPage'
import ProductPurchasePage from '$mp/containers/ProductPurchasePage'
import ComputationBasket from '$mp/containers/ComputationBasket'
import FiatPayments from '$mp/containers/FiatPayments'
import ManageSubscriptions from '$mp/containers/ManageSubscriptions'
import Invoice from '$mp/containers/Invoice'
import routes from '$routes'

const Route = withErrorBoundary(ErrorPage)(RouterRoute)

const MarketplaceRouter = () => ([
    <Route exact path={routes.marketplace.index()} component={Products} key="Products" />,
    <Route exact path={routes.marketplace.streamPreview()} component={StreamPreviewPage} key="StreamPreview" />,
    <Route exact path={routes.marketplace.product()} component={ProductPage} key="ProductPage2" />,
    <Route exact path={routes.products.new()} component={NewProductPage} key="NewProductPage" />,
    <Route exact path={routes.marketplace.purchase()} component={ProductPurchasePage} key="PurchaseProductPage" />,
    <Route exact path={routes.marketplace.computationBasket()} component={ComputationBasket} key="ComputationBasket" />,
    <Route exact path={routes.marketplace.fiatPayments()} component={FiatPayments} key="FiatPayments" />,
    <Route exact path={routes.marketplace.manageSubscriptions()} component={ManageSubscriptions} key="ManageSubscriptions" />,
    <Route exact path={routes.marketplace.invoice()} component={Invoice} key="Invoice" />,
])

export default MarketplaceRouter
