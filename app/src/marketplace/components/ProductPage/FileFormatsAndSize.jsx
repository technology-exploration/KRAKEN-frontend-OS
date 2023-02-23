// @flow

import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-redux-i18n'

import type { Product } from '$mp/flowtype/product-types'
import { MEDIUM } from '$shared/utils/styled'
import Segment from '$shared/components/Segment'

type Props = {
    className?: string,
    product: Product,
}

const FileFormatsAndSize = ({ product, ...props }: Props) => {
    if (product == null) {
        return null
    }

    return (
        <Segment {...props}>
            <Segment.Header>
                <Translate value="File format(s) and size" />
            </Segment.Header>
            <Segment.Body pad>
                The file package consists of 1 file with a file size of 2 MB<br />
                <br />
                demo_framingham:(2 MB),  CSV file, open using excel
            </Segment.Body>
        </Segment>
    )
}

const StyledFileFormatsAndSize = styled(FileFormatsAndSize)`
    font-size: 14px;
    line-height: 24px;

    strong {
        font-weight: ${MEDIUM};
    }
`

export default StyledFileFormatsAndSize
