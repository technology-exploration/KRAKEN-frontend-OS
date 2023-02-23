// @flow

import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import useProduct from '$mp/containers/ProductController/useProduct'
import Policies from '$mp/components/ProductPage/Policies'
import ProductPage from '$shared/components/ProductPage'
import { selectStreams, selectFetchingStreams } from '$mp/modules/streams/selectors'
import Segment from '$shared/components/Segment'
import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import StreamListing from '$mp/components/ProductPage/StreamListing'
import useDataUnion from '$mp/containers/ProductController/useDataUnion'
import ProductPageDataUnionStats from '$mp/containers/ProductPage/DataUnionStats'
import useDataUnionStats from '$mp/containers/ProductPage/useDataUnionStats'
import useDataUnionServerStats from './useDataUnionServerStats'

import Hero from './Hero'
import Description from './Description'

const DataUnionStats = ({ product }) => {
    // const product = useEditableProduct()
    const contractProduct = useContractProduct()

    const { subscriberCount } = contractProduct || {}
    const { created, adminFee, dataUnionDeployed, beneficiaryAddress } = product

    const isDuDeployed = !!dataUnionDeployed

    const { startPolling, stopPolling, totalEarnings, memberCount } = useDataUnionServerStats()
    const stats = useDataUnionStats({
        beneficiaryAddress,
        created,
        adminFee,
        subscriberCount,
        totalEarnings,
        memberCount,
    })
    const dataUnion = useDataUnion()
    const { joinPartStreamId } = dataUnion || {}

    useEffect(() => {
        if (beneficiaryAddress) {
            startPolling(beneficiaryAddress)

            return () => stopPolling()
        }

        return () => {}
    }, [startPolling, stopPolling, beneficiaryAddress])

    const statsProps = useMemo(() => {
        if (isDuDeployed) {
            return {
                stats,
                memberCount,
                joinPartStreamId,
            }
        }

        return {
            stats: [{
                id: 'revenue',
                unit: 'DATA',
                value: '0',
            }, {
                id: 'members',
                value: '0',
            }, {
                id: 'averageRevenue',
                unit: 'DATA',
                value: '0',
            }, {
                id: 'subscribers',
                value: '0',
            }, {
                id: 'revenueShare',
                unit: '%',
                value: adminFee ? ((1 - adminFee) * 100).toFixed(0) : '0',
            }, {
                id: 'created',
                value: created ? new Date(created).toLocaleDateString() : '-',
            }],
            memberCount: {
                total: 0,
                active: 0,
                inactive: 0,
            },
        }
    }, [isDuDeployed, stats, memberCount, joinPartStreamId, created, adminFee])

    return (
        <ProductPageDataUnionStats {...statsProps} />
    )
}

const Streams = ({ product }) => {
    // const product = useEditableProduct()
    const streamIds = product.streams
    const streamIdSet = useMemo(() => new Set(streamIds), [streamIds])
    const streams = useSelector(selectStreams)
    const selectedStreams = useMemo(() => streams.filter(({ id }) => streamIdSet.has(id)), [streamIdSet, streams])
    const isProductFree = !!(product && !isPaidProduct(product))
    const fetchingAllStreams = useSelector(selectFetchingStreams)

    console.log('streams ', streams)
    console.log('selectedStreams ', selectedStreams)

    return (
        <Segment>
            <Segment.Body>
                <StreamListing
                    product={product}
                    streams={streamIds}
                    fetchingStreams={fetchingAllStreams}
                    showStreamActions={false}
                    isLoggedIn={false}
                    isProductSubscriptionValid={false}
                    isProductFree={isProductFree}
                />
            </Segment.Body>
        </Segment>
    )
}

const ProductDetailsPage = () => {
    const product = useProduct()
    console.log('PRODUCT ', product)
    const isDataUnion = !!(product && isDataUnionProduct(product))
    const isProductFree = !!(product && !isPaidProduct(product))

    // const { startPolling, stopPolling } = useDataUnionServerStats()

    // useEffect(() => {
    //     if (isDataUnion) {
    //         startPolling(beneficiaryAddress)
    //         return () => stopPolling()
    //     }

    //     return () => {}
    // }, [startPolling, stopPolling, isDataUnion, beneficiaryAddress])

    return (
        <ProductPage>
            <ProductPage.Hero>
                <ProductPage.Container>
                    <ProductPage.Container>
                        <Hero />
                        <ProductPage.Separator />
                        <Description isProductFree={isProductFree} />
                    </ProductPage.Container>
                </ProductPage.Container>
            </ProductPage.Hero>
            <ProductPage.Container>
                <Policies product={product} />
                <ProductPage.Container>
                    {isDataUnion && product && (
                        <div>
                            <DataUnionStats product={product} />
                            <Streams product={product} />
                        </div>
                    )}
                </ProductPage.Container>
                <Segment />
            </ProductPage.Container>
        </ProductPage>
    )
}

export default ProductDetailsPage
