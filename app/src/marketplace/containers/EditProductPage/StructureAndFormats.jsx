// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

// import useEditableProduct from '../ProductController/useEditableProduct'
import useEditableProductActions from '../ProductController/useEditableProductActions'

import styles from './productDetails.pcss'

import DynamicTable from './DynamicTable'
import docsLinks from '$shared/../docsLinks'

// type Props = {
//     disabled?: boolean
// }

const StructureAndFormats = () => {
    // const product = useEditableProduct()
    const { updateFormats } = useEditableProductActions()

    return (
        <section id="structureAndFormats" className={cx(styles.root, styles.ProductDetails)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.formats.title"
                />
                <Translate
                    tag="p"
                    value="editProductPage.formats.description"
                    docsLink={docsLinks.createProduct}
                    dangerousHTML
                />
                <DynamicTable updateFormats={updateFormats} />
            </div>
        </section>
    )
}

export default StructureAndFormats
