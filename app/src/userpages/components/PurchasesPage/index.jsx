/* eslint-disable no-unused-vars */
// @flow

import React, { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import { CoreHelmet } from '$shared/components/Helmet'
import { getMyPurchases, updateFilter, applyFilter } from '$mp/modules/myPurchaseList/actions'
import { selectMyPurchaseList, selectSubscriptions, selectFetchingMyPurchaseList } from '$mp/modules/myPurchaseList/selectors'
import Popover from '$shared/components/Popover'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import { isDataUnionProduct } from '$mp/utils/product'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useAllDataUnionStats from '$mp/modules/dataUnion/hooks/useAllDataUnionStats'
import { PurchaseTile } from '$shared/components/Tile'
import Grid from '$shared/components/Tile/Grid'
import Search from '../Header/Search'
import { getFilters } from '../../utils/constants'
import Layout from '../Layout'
import NoPurchasesView from './NoPurchases'

import styles from './purchases.pcss'

const PurchasesPage = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters('product')
        return [
            filters.RECENT_DESC,
            filters.NAME_ASC,
            filters.NAME_DESC,
            filters.ACTIVE,
            filters.EXPIRED,
        ]
    }, [])

    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(sortOptions)

    const purchases = useSelector(selectMyPurchaseList)

    const subscriptions = useSelector(selectSubscriptions)

    const productspurchasedFalse = subscriptions.filter((sub) => sub.pending === false)
    const myproducts = productspurchasedFalse.map((prod) => prod.product)

    const fetching = useSelector(selectFetchingMyPurchaseList)

    const dispatch = useDispatch()

    const { load: loadDataUnionStats, members, fetching: fetchingDataUnionStats } = useAllDataUnionStats()

    useEffect(() => {
        dispatch(updateFilter(filter))
        dispatch(getMyPurchases())
            .then(() => {
                dispatch(applyFilter())
            })
    }, [dispatch, filter])

    useEffect(() => {
        loadDataUnionStats()
    }, [loadDataUnionStats])

    const subEndAts = useMemo(() => (
        subscriptions.reduce((memo, sub) => ({
            ...memo,
            [sub.product.id]: new Date(sub.endsAt),
        }), {})
    ), [subscriptions])

    return (
        <Layout
            headerSearchComponent={
                <Search.Active
                    placeholder={I18n.t('userpages.subscriptions.filterSubscriptions')}
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                    debounceTime={0}
                />
            }
            headerFilterComponent={
                <Popover
                    title={I18n.t('userpages.filter.sortBy')}
                    onChange={setSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
                    type="uppercase"
                    caret="svg"
                    activeTitle
                    menuProps={{
                        right: true,
                    }}
                >
                    {sortOptions.map((s) => (
                        <Popover.Item key={s.filter.id} value={s.filter.id}>
                            {s.displayName}
                        </Popover.Item>
                    ))}
                </Popover>
            }
            loading={fetching}
        >
            <CoreHelmet title={I18n.t('userpages.title.subscriptions')} />
            <ListContainer className={styles.corepageContentContainer} >
                {!fetching && myproducts && !myproducts.length && (
                    <NoPurchasesView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                {myproducts.length > 0 && (
                    <Grid>
                        {myproducts.map((product) => {
                            const isDataUnion = isDataUnionProduct(product)
                            const beneficiaryAddress = (product.beneficiaryAddress || '').toLowerCase()
                            const memberCount = isDataUnion ? members[beneficiaryAddress] : undefined

                            return (
                                <PurchaseTile
                                    expiresAt={subEndAts[product.id]}
                                    key={product.id}
                                    numMembers={memberCount}
                                    product={product}
                                    showDataUnionBadge={product.type === 'STREAMS'}
                                    showAnalyticsBadge={product.type === 'ANALYTICS'}
                                    showBatchBadge={product.type === 'BATCH'}
                                />
                            )
                        })}
                    </Grid>
                )}
            </ListContainer>
            <DocsShortcuts />
        </Layout>
    )
}

export default PurchasesPage
