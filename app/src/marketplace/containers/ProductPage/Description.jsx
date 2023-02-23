/* eslint-disable max-len */

import React, { useMemo } from 'react'

import useProduct from '$mp/containers/ProductController/useProduct'

import DescriptionComponent from '$mp/components/ProductPage/Description'

const Description = () => {
    const product = useProduct()
    const sidebar = useMemo(() => ({
        sector: {
            title: 'Market Sector',
            loading: false,
            value: product.sector,
        },
        type: {
            title: 'Data Product type',
            loading: false,
            // eslint-disable-next-line no-nested-ternary
            value: product.type === 'ANALYTICS' ? 'Analytics' : product.type === 'BATCH' ? 'Batch' : 'Data stream',
        },
        tags: {
            title: 'Category tags',
            loading: false,
            value: (product.type === 'ANALYTICS' && product.sector === 'Health and wellness' && product.columnVariables && product.columnVariables.map((el) => el).join(', '))
            || (product.type !== 'ANALYTICS' && product.sector === 'Health and wellness' && product && product.tags && product.tags.map((item) => item.text).join(', '))
            || (product.sector === 'Education' && `${product.category}, ${product.university}, ${product.studyProgram}, ${product.course}`),
        },
        records: {
            title: product.type === 'ANALYTICS' && 'Number of records',
            loading: product.type === 'ANALYTICS' && false,
            value: product.type === 'ANALYTICS' && product.numberOfRecords,
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [product.sector, product.category, product.university, product.studyProgram, product.course, product.tags, product.columnVariables, product.numberOfRecords])

    return (
        <DescriptionComponent
            description={product.description}
            sidebar={sidebar}
            product={product}
        />
    )
}

export default Description
