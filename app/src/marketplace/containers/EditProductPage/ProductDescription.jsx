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

const ProductDescription = ({ disabled }: Props) => {
    const product = useEditableProduct()
    const { publishAttempted } = useContext(EditControllerContext)
    const { isValid, message } = useValidation('description')
    const { updateDescription } = useEditableProductActions()

    return (
        <section id="description" className={cx(styles.root, styles.ProductDescription)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.productDescription.title"
                />
                <Translate
                    tag="p"
                    value="editProductPage.productDescription.description"
                    docsLink={docsLinks.createProduct}
                    dangerousHTML
                />
                <MarkdownEditor
                    placeholder="Type something great about your product"
                    value={product.description || ''}
                    onChange={updateDescription}
                    className={styles.productDescription}
                    error={publishAttempted && !isValid ? message : undefined}
                    disabled={!!disabled}
                    style={{
                        height: '20vh',
                        width: '100%',
                    }}
                />
            </div>
        </section>
    )
}

export default ProductDescription
