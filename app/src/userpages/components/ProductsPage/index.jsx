// @flow

import React, { useEffect, useMemo, Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'

import { CoreHelmet } from '$shared/components/Helmet'
import { getMyProducts } from '$mp/modules/myProductList/actions'
import { selectMyProductList, selectFetching } from '$mp/modules/myProductList/selectors'
import { productStates } from '$shared/utils/constants'
import Popover from '$shared/components/Popover'
import DocsShortcuts from '$userpages/components/DocsShortcuts'
import ListContainer from '$shared/components/Container/List'
import { isDataUnionProduct } from '$mp/utils/product'
import useFilterSort from '$userpages/hooks/useFilterSort'
import useModal from '$shared/hooks/useModal'
import DeleteProductModal from '$mp/containers/DeleteProductModal'
import useAllDataUnionStats from '$mp/modules/dataUnion/hooks/useAllDataUnionStats'
import CreateProductModal from '$mp/containers/CreateProductModal'
import Button from '$shared/components/Button'
import Grid from '$shared/components/Tile/Grid'
import { ProductTile } from '$shared/components/Tile'
import Search from '../Header/Search'
import { getFilters } from '../../utils/constants'
import Layout from '../Layout'
import NoProductsView from './NoProducts'
import * as MenuItems from './MenuItems'

import styles from './products.pcss'

export const CreateProductButton = () => {
    const { api: createProductDialog } = useModal('marketplace.createProduct')

    return (
        <Button
            type="button"
            className={styles.createProductButton}
            onClick={() => createProductDialog.open()}
        >
            <Translate value="Publish Product" />
        </Button>
    )
}

const ProductsPage = () => {
    const sortOptions = useMemo(() => {
        const filters = getFilters('product')
        return [
            filters.RECENT_DESC,
            filters.NAME_ASC,
            filters.NAME_DESC,
            filters.PUBLISHED,
            filters.DRAFTS,
        ]
    }, [])
    const {
        defaultFilter,
        filter,
        setSearch,
        setSort,
        resetFilter,
    } = useFilterSort(sortOptions)
    const products = useSelector(selectMyProductList)
    const fetching = useSelector(selectFetching)
    const dispatch = useDispatch()
    // eslint-disable-next-line no-unused-vars
    const { load: loadDataUnionStats, members, fetching: fetchingDataUnionStats } = useAllDataUnionStats()

    const [show, setShow] = useState(false)
    const [selected, setSelected] = useState(false)

    const fetchProducts = () => dispatch(getMyProducts(products))

    const handleClose = () => {
        setShow(false)
        fetchProducts()
    }
    const onClick = (id) => {
        setSelected(id)
        setShow(true)
    }

    useEffect(() => {
    }, [products])

    useEffect(() => {
        dispatch(getMyProducts(filter))
    }, [dispatch, filter])

    useEffect(() => {
        loadDataUnionStats()
    }, [loadDataUnionStats])

    return (
        <Layout
            headerAdditionalComponent={<CreateProductButton />}
            headerSearchComponent={
                <Search.Active
                    placeholder={I18n.t('userpages.products.filterProducts')}
                    value={(filter && filter.search) || ''}
                    onChange={setSearch}
                />
            }
            headerFilterComponent={
                <Popover
                    title={I18n.t('userpages.filter.sortBy')}
                    type="uppercase"
                    caret="svg"
                    activeTitle
                    onChange={setSort}
                    selectedItem={(filter && filter.id) || (defaultFilter && defaultFilter.id)}
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
            <CoreHelmet title={I18n.t('userpages.title.products')} />
            <ListContainer className={styles.corepageContentContainer}>
                {!fetching && products && !products.length && (
                    <NoProductsView
                        hasFilter={!!filter && (!!filter.search || !!filter.key)}
                        filter={filter}
                        onResetFilter={resetFilter}
                    />
                )}
                <Grid>
                    {products.map((product) => {
                        const { id, beneficiaryAddress, state, type } = product
                        const isDataUnion = isDataUnionProduct(product.type)
                        const memberCount = isDataUnion ? members[(beneficiaryAddress || '').toLowerCase()] : undefined
                        const contractAddress = isDataUnion ? beneficiaryAddress : null
                        const published = state === productStates.DEPLOYED
                        const deployed = !!(isDataUnion && !!beneficiaryAddress)

                        return (
                            <ProductTile
                                key={id}
                                actions={
                                    <Fragment>
                                        <MenuItems.Edit id={id} />
                                        <MenuItems.View id={id} disabled={!published} />
                                        {
                                            published && type === 'BATCH' && <MenuItems.ManageSubscriptions id={id} disabled={!published} />
                                        }
                                        <MenuItems.Delete onClick={() => onClick(id)} />
                                        {/* <MenuItems.Delete id={id} disabled={!published} /> */}
                                        {deployed && (
                                            <MenuItems.ViewStats id={id} />
                                        )}
                                        {deployed && (
                                            <MenuItems.ViewDataUnion id={id} />
                                        )}
                                        {contractAddress && (
                                            <MenuItems.CopyContractAddress address={contractAddress} />
                                        )}
                                        <MenuItems.Copy id={id} disabled={!published} />
                                    </Fragment>
                                }
                                published={published}
                                deployed={deployed}
                                numMembers={memberCount}
                                product={product}
                                showDataUnionBadge={isDataUnion}
                                showAnalyticsBadge={type === 'ANALYTICS'}
                                showBatchBadge={type === 'BATCH'}
                                modal={
                                    <DeleteProductModal show={show} handleClose={handleClose} id={selected} fetchProducts={fetchProducts} />
                                }
                            />
                        )
                    })}
                </Grid>
            </ListContainer>
            <DocsShortcuts />
            <CreateProductModal />
        </Layout>
    )
}

export default ProductsPage
