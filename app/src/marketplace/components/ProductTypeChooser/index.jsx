// @flow

import React from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useModal from '$shared/hooks/useModal'

import Nav from '$shared/components/Layout/Nav'
import krakenLogo from '$mp/assets/kraken_logo.png'
import Toolbar from '$shared/components/Toolbar'
import BackButton from '$shared/components/BackButton'
import CoreLayout from '$shared/components/Layout/Core'
import Button from '$shared/components/Button'
import dataUnionImage1 from '$mp/assets/data-unions.jpg'
import dataForDownloadImage from '$mp/assets/data-for-download.jpg'
import privacyPreservingImage from '$mp/assets/privacy-preserving.jpg'
import { productTypes } from '$mp/utils/constants'
import routes from '$routes'
import styles from './index.pcss'
import docsLinks from '$shared/../docsLinks'

const PageTitle = styled.div`
    font-family: var(--sans);
    font-size: 26px;
    letter-spacing: 0;
    line-height: 20px;
    width: 100%;
    margin: 2.25em auto 1.25em auto;
`

const PageDescription = styled.div`
    width: 100%;
    margin: 0 auto;
`

const ProductChoices = styled.div`
    margin-top: 5rem;
    display: grid;
    grid-template-columns: 355px 355px 355px;
    // grid-template-columns: 230px 230px 230px 230px;
    grid-column-gap: 27px;
    width: 100%;
    margin: 0 auto;

`

const Product = styled.div`
    display: grid;
    grid-row-gap: 3px;
    padding: 0px;
    background: #F3F3F3;

    > *:first-child {
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    > *:last-child {
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        height: 20rem;
        margin-top: 38px
    }

    > * {
        background: #F3F3F3;
    }
`

const ProductTitle = styled(Translate)`
    height: 60px;
    line-height: 25px;
    font-size: 20px;
    letter-spacing: 0;
    font-family: var(--sans);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 56px
`

const ProductImage = styled.div`
    height: 150px;
    position: relative;

    > img {
        position: absolute;
        top: 80%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: auto;
        width: 100%;
        object-fit: contain;
    }
`

const ProductText = styled.div`
    padding: 0.1rem 22px 2.5rem 22px;
    line-height: 20px;
    letter-spacing: 0;
    font-size: 12px;
    text-align: center;

    > a {
        margin-top: 2rem;
    }
`

const ProductTypeChooser = () => {
    const { api: createProductModal } = useModal('marketplace.createProduct')
    const toolbarMiddle = <Link onClick={() => createProductModal.close()}><img src={krakenLogo} alt="krakenLogo" /></Link>
    const back = () => createProductModal.close()

    return (
        <CoreLayout
            className={styles.layout}
            style={{
                backgroundColor: 'white',
            }}
            nav={(
                <Nav noWide />
            )}
            navComponent={(
                <Toolbar
                    left={<BackButton onBack={back} />}
                    middle={toolbarMiddle}
                    altMobileLayout
                />
            )}
        >
            <PageTitle>
                <Translate value="productTypeChooser.title" />
            </PageTitle>
            <PageDescription>
                <Translate
                    tag="p"
                    value="productPage.productType.description"
                />
            </PageDescription>
            <ProductChoices>
                <Product>
                    <ProductImage>
                        <img
                            src={dataForDownloadImage}
                            srcSet={`${dataForDownloadImage} 2x`}
                            alt={I18n.t('productTypeChooser.standard.title')}
                        />
                    </ProductImage>
                    <ProductText>
                        <ProductTitle tag="div" value="Data for download" />
                        <Translate
                            value="productTypeChooser.batch.description"
                            docsLink={docsLinks.streams}
                            dangerousHTML
                        />
                        <br />
                        <Button
                            kind="primary"
                            outline
                            tag={Link}
                            to={routes.products.new({
                                type: productTypes.BATCH,
                            })}
                            className="my-3"
                        >
                            <Translate value="Publish data" />
                        </Button>
                    </ProductText>
                </Product>
                <Product>
                    <ProductImage>
                        <img
                            src={privacyPreservingImage}
                            srcSet={`${privacyPreservingImage} 2x`}
                            alt={I18n.t('productTypeChooser.dataUnion.title')}
                        />
                    </ProductImage>
                    <ProductText>
                        <ProductTitle tag="div" value="Privacy-preserving remote analysis" />
                        <Translate value="productTypeChooser.privacy.description" />
                        <br />
                        <Button
                            kind="primary"
                            outline
                            tag={Link}
                            to={routes.products.new({
                                type: productTypes.ANALYTICS,
                            })}
                            className="my-3"
                        >
                            <Translate value="Publish analytics" />
                        </Button>
                    </ProductText>
                </Product>
                <Product>
                    <ProductImage>
                        <img
                            src={dataUnionImage1}
                            srcSet={`${dataUnionImage1} 2x`}
                            alt={I18n.t('productTypeChooser.dataUnion.title')}
                        />
                    </ProductImage>
                    <ProductText>
                        <ProductTitle tag="div" value="Data Union" />
                        <Translate value="productTypeChooser.dataunion.description" />
                        <br />
                        <Button
                            kind="primary"
                            outline
                            tag={Link}
                            to={routes.products.new({
                                type: productTypes.STREAMS,
                            })}
                            className="my-3"
                        >
                            <Translate value="Publish data unions" />
                        </Button>
                    </ProductText>
                </Product>
            </ProductChoices>
        </CoreLayout>
    )
}

export default ProductTypeChooser
