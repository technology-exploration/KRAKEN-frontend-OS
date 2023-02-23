// @flow

import React from 'react'
// import { useSelector } from 'react-redux'
import { Translate } from 'react-redux-i18n'
// import { titleize } from '@streamr/streamr-layout'
import styled from 'styled-components'

// import useProduct from '$mp/containers/ProductController/useProduct'
// import useContractProduct from '$mp/containers/ProductController/useContractProduct'
// import usePending from '$shared/hooks/usePending'
// import { selectCategory } from '$mp/modules/product/selectors'
// import { ago } from '$shared/utils/time'

// import DescriptionComponent from '$mp/components/ProductPage/Description'

type Props = {
    disabled: boolean,
}

const IntroductionDiv = styled.div`
    margin-top:2.5rem
`

// eslint-disable-next-line no-unused-vars
const Introduction = ({ disabled }: Props) =>
    // const products = useProduct()
    (
        <section id="introductionEnquiry">
            <IntroductionDiv>
                <Translate value="productPage.introduction.text" />
            </IntroductionDiv>
        </section>
    )

export default Introduction
