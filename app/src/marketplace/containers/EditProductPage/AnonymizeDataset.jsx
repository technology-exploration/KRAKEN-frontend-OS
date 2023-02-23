/* eslint-disable max-len */
// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import Button from '$shared/components/Button'
import useEditableProduct from '../ProductController/useEditableProduct'
import useEditableProductActions from '../ProductController/useEditableProductActions'

import styles from './productDetails.pcss'

const AnonymizeDiv = styled.div`
    margin-top:2.5rem
`

const displayInline = {
    display: 'inline-flex',
}

const padding = {
    padding: '10px',
}

// eslint-disable-next-line react/no-unused-prop-types
const AnonymizeRadioButton = ({ name1, id, updateAnonymizeDataset }: { name1: string, id: string, product: any, updateAnonymizeDataset: any }) => (
    <div id={id} style={displayInline}>
        <div style={padding}>
            <input
                id="anonymizeyes"
                type="radio"
                name={name1}
                value="Yes"
                onChange={(e) => {
                    updateAnonymizeDataset(e.target.checked)
                }}
            />
            <label htmlFor="anonymizeyes">Yes</label>
        </div>
        <div style={padding}>
            <input
                id="anonymizeno"
                type="radio"
                name={name1}
                onChange={(e) => {
                    updateAnonymizeDataset(!e.target.checked)
                }}
                value="No"
                defaultChecked
            />
            <label htmlFor="anonymizeno">No</label>
        </div>
    </div>
)

type Props = {
    disabled?: boolean,
}

// eslint-disable-next-line no-unused-vars
const AnonymizeDataset = ({ disabled }: Props) => {
    const product = useEditableProduct()
    const { updateAnonymizeDataset } = useEditableProductActions()
    const name1 = 'anonymizeDatasetRadioButton'
    const anonymizeDataId = 'anonymizeDataId'

    return (
        <section id="anonymizeDataset" className={cx(styles.root, styles.ProductDetails)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.anonymizeDataset.title"
                />
                <AnonymizeRadioButton name1={name1} id={anonymizeDataId} updateAnonymizeDataset={updateAnonymizeDataset} product={product} />
                <AnonymizeDiv>
                    {product.anonymizeDataset ? <Button> Anonymize Data </Button> : null}
                </AnonymizeDiv>
            </div>
        </section>
    )
}
export default AnonymizeDataset
