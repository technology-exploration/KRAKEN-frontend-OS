import styled from 'styled-components'
import Segment from '$shared/components/Segment'
import { SM, MD, LG, XL } from '$shared/utils/styled'

const Container = styled.div`
    margin: 0 auto;

    & & {
        padding: 0 24px;
    }

    @media (min-width: ${MD}px) {
        max-width: 816px;
        padding: 0 24px;

        & & {
            padding: 0;
        }
    }

    @media (min-width: ${LG}px) {
        padding: 0 32px;
    }

    @media (min-width: ${XL}px) {
        max-width: 1104px;
    }
`

const Hero = styled.div`
    background-color: #f8f8f8;
    padding: 24px 0;

    @media (min-width: ${SM}px) {
        padding: 32px 0;
    }

    @media (min-width: ${MD}px) {
        padding: 48px 0;
    }

    @media (min-width: ${XL}px) {
        padding: 64px 0;
    }
`

const Separator = styled.div`
    background-color: #e7e7e7;
    height: 1px;
    margin: 2em 0;

    @media (min-width: ${LG}px) {
        margin: 3em 0;
    }
`

const ProductPage = styled.div`
    color: #323232;

    ${Segment} {
        margin-top: 24px;
    }

    @media (min-width: ${SM}px) {
        ${Segment} {
            margin-top: 32px;
        }
    }

    @media (min-width: ${MD}px) {
        ${Segment} {
            margin-top: 48px;
        }
    }

    @media (min-width: ${XL}px) {
        ${Segment} {
            margin-top: 64px;
        }
    }
`

Object.assign(ProductPage, {
    Container,
    Hero,
    Separator,
})

export default ProductPage
