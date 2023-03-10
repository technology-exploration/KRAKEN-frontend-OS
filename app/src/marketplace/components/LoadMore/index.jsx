// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import Button from '$shared/components/Button'

export type Props = {
    onClick: () => void | Promise<void>,
    hasMoreSearchResults: boolean,
    preserveSpace?: boolean,
    className?: string,
}

const StyledContainer = styled.div`
    height: 40px;
    display: flex;
    justify-content: center;
    margin-top: 5em;
`

const LoadMore = ({ onClick, hasMoreSearchResults, preserveSpace, className }: Props) => {
    if (!hasMoreSearchResults) {
        return preserveSpace ? <StyledContainer className={className} /> : null
    }

    return (
        <StyledContainer className={className}>
            <Button kind="primary" onClick={onClick}>
                <Translate value="productList.seeMore" />
            </Button>
        </StyledContainer>
    )
}
export default LoadMore
