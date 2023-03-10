// @flow

import React, { useContext, useMemo } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import uniqBy from 'lodash/uniqBy'

import StreamSelectorComponent from '$mp/components/StreamSelector'
import {
    selectStreams as selectAllStreams,
    selectFetchingStreams,
} from '$mp/modules/streams/selectors'
import {
    selectStreams as selectProductStreams,
    selectFetchingStreams as selectFetchingProductStreams,
} from '$mp/modules/product/selectors'
import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { Context as EditControllerContext } from './EditControllerProvider'
import styles from './productStreams.pcss'
import docsLinks from '$shared/../docsLinks'

type Props = {
    disabled?: boolean,
}

const ProductStreams = ({ disabled }: Props) => {
    const product = useEditableProduct()
    const { isValid, message } = useValidation('streams')
    const { updateStreams } = useEditableProductActions()
    const { publishAttempted } = useContext(EditControllerContext)
    const allStreams = useSelector(selectAllStreams)
    const fetchingAllStreams = useSelector(selectFetchingStreams)
    const productStreams = useSelector(selectProductStreams)
    const fetchingProductStreams = useSelector(selectFetchingProductStreams)

    // Filter product streams based on actual selection
    const streamIds = product.streams
    const streamIdSet = useMemo(() => new Set(streamIds), [streamIds])
    const selectedStreams = useMemo(() => productStreams.filter(({ id }) => streamIdSet.has(id)), [streamIdSet, productStreams])

    const availableStreams = useMemo(() => uniqBy([...allStreams, ...selectedStreams], 'id'), [allStreams, selectedStreams])

    return (
        <section id="streams" className={cx(styles.root, styles.StreamSelector)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.streams.title"
                />
                <Translate
                    tag="p"
                    value="editProductPage.streams.description"
                    docsLink={docsLinks.createProduct}
                    dangerousHTML
                />
                <StreamSelectorComponent
                    availableStreams={availableStreams}
                    fetchingStreams={fetchingProductStreams || fetchingAllStreams}
                    onEdit={updateStreams}
                    streams={streamIds}
                    className={styles.streams}
                    error={publishAttempted && !isValid ? message : undefined}
                    disabled={!!disabled}
                />
            </div>
        </section>
    )
}

export default ProductStreams
