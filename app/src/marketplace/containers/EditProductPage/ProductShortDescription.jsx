// @flow

import React, { useContext } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import MarkdownEditor from '$mp/components/MarkdownEditor'
import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { Context as EditControllerContext } from './EditControllerProvider'
import styles from './productDescription.pcss'
import docsLinks from '$shared/../docsLinks'

type Props = {
    disabled?: boolean,
}

const ProductShortDescription = ({ disabled }: Props) => {
    const product = useEditableProduct()
    const { publishAttempted } = useContext(EditControllerContext)
    const { isValid, message } = useValidation('shortDescription')
    const { updateShortDescription } = useEditableProductActions()

    return (
        <section id="shortDescription" className={cx(styles.root, styles.ProductDescription)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.productShortDescription.title"
                />
                <Translate
                    tag="p"
                    value="editProductPage.productShortDescription.description"
                    docsLink={docsLinks.createProduct}
                    dangerousHTML
                />
                <MarkdownEditor
                    placeholder="Type short description of your product"
                    value={product.shortDescription || ''}
                    onChange={updateShortDescription}
                    className={styles.ProductShortDescription}
                    style={{
                        height: '20vh',
                        width: '100%',
                    }}
                    error={publishAttempted && !isValid ? message : undefined}
                    disabled={!!disabled}
                />
            </div>
        </section>
    )
}

export default ProductShortDescription
