// @flow

import React from 'react'
import cx from 'classnames'

import { useSelector } from 'react-redux'
import { selectUserData } from '$shared/modules/user/selectors'
import DetailsContainer from '$shared/components/Container/Details'
import { isDataUnionProduct } from '$mp/utils/product'
import useEditableProduct from '../ProductController/useEditableProduct'

import EditorNav from './EditorNav'
import ProductName from './ProductName'
import CoverImage from './CoverImage'
import ProductDescription from './ProductDescription'
import PriceSelector from './PriceSelector'
import Policies from './Policies'
import ProductDataset from './ProductDataset'
import ProductStreams from './ProductStreams'

import styles from './editor.pcss'
import MarketSector from './MarketSector'
import PrivacyMetricsSection from './PrivacyMetricsSection'

type Props = {
    disabled?: boolean
}

const Editor = ({ disabled }: Props) => {
    const product = useEditableProduct()
    const isDataUnion = isDataUnionProduct(product)
    const currentUser = useSelector(selectUserData)

    return (
        <div className={cx(styles.root, styles.Editor)}>
            <DetailsContainer className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.info}>
                        <ProductName disabled={disabled} />
                        <CoverImage disabled={disabled} />
                        <ProductDescription disabled={disabled} />
                        <MarketSector disabled={disabled} />
                        <Policies disabled={disabled} />
                        {!!isDataUnion && (
                            <ProductStreams disabled={disabled} />
                        )}
                        {!isDataUnion && (
                            <ProductDataset disabled={disabled} />
                        )}
                        <PriceSelector disabled={disabled} />

                        {product.type === 'BATCH' && currentUser.institutionalAffiliation === 'No' && (
                            <PrivacyMetricsSection disabled={disabled} />
                        )}
                    </div>
                    <div className={styles.nav}>
                        <EditorNav />
                    </div>
                </div>
            </DetailsContainer>
        </div>
    )
}

export default Editor
