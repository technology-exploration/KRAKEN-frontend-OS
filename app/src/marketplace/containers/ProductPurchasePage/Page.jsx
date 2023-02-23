/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable flowtype/no-types-missing-file-annotation */

import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { replace } from 'connected-react-router'
import { useParams } from 'react-router-dom'
import Notification from '$shared/utils/Notification'
import { selectUserData } from '$shared/modules/user/selectors'
import { isDataUnionProduct } from '$mp/utils/product'
import useProduct from '$mp/containers/ProductController/useProduct'
import useModal from '$shared/hooks/useModal'
import ProductPage from '$shared/components/ProductPage'
import DetailsContainer from '$shared/components/Container/Details'
import Button from '$shared/components/Button'
import { addFreeProductBatch, buyerEligibility } from '$mp/modules/product/services'
import { NotificationIcon } from '$shared/utils/constants'
import routes from '$routes'
import Introduction from './Introduction'
import useDataUnionServerStats from './useDataUnionServerStats'
import styles from './index.pcss'

import Hero from './Hero'
import Purpose from './Purpose'
import GDPR from './GDPR'

const ButtonRow = styled.div`
    display:flex;
    align-items: center;
    justify-content: center;
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
`

const PrimaryButton = styled(Button)`
    background-color: #0000BA;
    margin-left: 2.5rem;
    & a{
        color: white;
    }
`

const TableStyle = styled.div`
    background-color: #EFEFEF;
    padding: 1.5rem 2.5rem 1rem;
    border-radius: 7px;
`

const ProductDetailsPage = () => {
    const product = useProduct()
    const dispatch = useDispatch()
    const { sector, priceCurrency, timeUnit } = product

    const [purposes, setPurposes] = useState([])
    const [categories, setCategories] = useState([])
    const [countries, setCountries] = useState([])
    const [period, setPeriod] = useState([])
    const [safeGuards, setSafeGuards] = useState('')
    const [automatedDecision, setAutomatedDecision] = useState(null)
    const [clicked, setClicked] = useState(false)

    const { api: purchaseDialog } = useModal('purchase')

    const { beneficiaryAddress } = product
    const isDataUnion = !!(product && isDataUnionProduct(product))

    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null

    const { startPolling, stopPolling } = useDataUnionServerStats()
    useEffect(() => {
        if (isDataUnion) {
            startPolling(beneficiaryAddress)

            return () => stopPolling()
        }

        return () => {}
    }, [startPolling, stopPolling, isDataUnion, beneficiaryAddress])

    const { id } = useParams()

    const validate = async () => {
        setClicked(true)

        if (
            (sector === 'Health and wellness' && !categories.patients_medical_records && !categories.genetic_data && !categories.imaging_data && !categories.mobile_data)
            || (sector === 'Education' && !categories.grades && !categories.diplomas && !categories.matriculation)
            || (!countries.EUCountry && !countries.nonEU && !countries.noAdeqDecision)
            || (countries.nonEU && (countries.nonEUCountry.length === 0 || !countries.nonEUCountry))
            || (countries.noAdeqDecision && (countries.noAdeqDecisionCountry.length === 0 || !countries.noAdeqDecisionCountry))
            || (countries.noAdeqDecision && (!safeGuards.length === 0 || !safeGuards || safeGuards === ''))
            || (purposes.automated && !automatedDecision.clinical_risks_assessment && !automatedDecision.diagnostic_or_treatment && !automatedDecision.hiring_assessments && !automatedDecision.automated_placing)
            || (sector === 'Health and wellness' && !purposes.marketing && !purposes.publicly_funded_research && !purposes.private_research && !purposes.managment && !purposes.automated)
            || (sector === 'Education' && !purposes.study_recommendations && !purposes.job_offers && !purposes.statistical_research)
            || !period.period
            || !period.periodNumber
        ) {
            console.log('not validated')
        } else if (isLoggedIn) {
            const eligibility = await buyerEligibility(product.id, {
                purposes: Object.keys(purposes).filter((x) => purposes[x] !== false),
            })

            if (eligibility === 'eligible') {
                Notification.push({
                    title: I18n.t('notifications.eligibleBuyer'),
                    icon: NotificationIcon.CHECKMARK,
                })
            } else {
                Notification.push({
                    title: I18n.t('notifications.notEligibleBuyer'),
                    icon: NotificationIcon.ERROR,
                })
            }
            const endsAt = moment().add(period.periodNumber, period.period).unix() // Unix timestamp (seconds)
            await addFreeProductBatch(product.id || '', true, endsAt, purposes, automatedDecision, categories, countries, safeGuards, period)
            dispatch(replace(routes.marketplace.invoice({
                id: product.id,
            })))
        }
    }

    return (
        <ProductPage>
            <div className={cx(styles.root, styles.BuyersView)}>
                <DetailsContainer className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.info}>
                            <Translate
                                tag="h3"
                                value="Enquiry for the purchase of access data"
                            />
                            <Introduction disabled />
                        </div>
                        <TableStyle>
                            <table style={{
                                width: '100%',
                            }}
                            >
                                <tbody>
                                    <tr className={styles.separating_line}>
                                        <td><b>Data Product Name</b></td>
                                        <td>{product.name ? product.name : ''}</td>
                                    </tr>
                                    <tr className={styles.separating_line}>
                                        <td><b>Category tags</b></td>
                                        {
                                            product.sector === 'Health and wellness' && <td>{product.tags ? product.tags.map((el) => el.text).join(', ') : ''}</td>
                                        }
                                        {
                                            product.sector === 'Education' && <td>{`${product.category}, ${product.university}, ${product.studyProgram}, ${product.course}`}</td>
                                        }
                                    </tr>
                                    <tr className={styles.separating_line}>
                                        <td><b>Market sector</b></td>
                                        <td>{product.sector ? product.sector : ''}</td>
                                    </tr>
                                    <tr className={styles.separating_line}>
                                        <td><b>Provided by</b></td>
                                        <td>{product.owner ? product.owner : ''}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Price</b></td>
                                        <td>{product.price ? `${product.price} ${product.priceCurrency} / ${product.timeUnit}` : ''}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </TableStyle>
                        <Purpose
                            setPurposes={setPurposes}
                            setCountries={setCountries}
                            setCategories={setCategories}
                            countries={countries}
                            categories={categories}
                            purposes={purposes}
                            period={period}
                            setPeriod={setPeriod}
                            safeGuards={safeGuards}
                            setSafeGuards={setSafeGuards}
                            sector={product.sector}
                            clicked={clicked}
                            automatedDecision={automatedDecision}
                            setAutomatedDecision={setAutomatedDecision}
                        />
                        <GDPR />
                    </div>
                    {
                        product.priceCurrency === 'EUR' ?
                            <ButtonRow>
                                <PrimaryButton
                                    size="mini"
                                    // waiting={isPending}
                                    // disabled={{}}
                                    onClick={validate}
                                >
                                    Complete purchase
                                </PrimaryButton>
                            </ButtonRow>
                            :
                            <Hero
                                purposes={purposes}
                                countries={countries}
                                categories={categories}
                                period={period}
                                safeGuards={safeGuards}
                                setClicked={setClicked}
                                automatedDecision={automatedDecision}
                            />
                    }
                </DetailsContainer>
            </div>
        </ProductPage>
    )
}

export default ProductDetailsPage
