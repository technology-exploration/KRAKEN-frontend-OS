/* eslint-disable flowtype/no-types-missing-file-annotation */
/* eslint-disable max-len */

import React, { useMemo } from 'react'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'
import Checkbox from '$shared/components/Checkbox'
import useProduct from '$mp/containers/ProductController/useProduct'
import Text from '$ui/Text'
import SelectField from '$mp/components/SelectField'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import PaymentRate from '$mp/components/PaymentRate'
import { timeUnits } from '$shared/utils/constants'

const SelectFieldNarrow = styled(SelectField)`
    width: 13rem;
`

const CheckboxLabel = styled.label`
    display: flex;
    margin: 0;
`
const CountriesLabel = styled.label`
    display: flex;
    margin: 0;
    width: 500px;
`

type Props = {
    sector: string,
    purposes: any,
    countries: any,
    categories: any,
    setPurposes: any,
    setCountries: any,
    setCategories: any,
}

const DetailsContainer = styled.div`
    display: block;
`

const PurposeContainer = styled.div`
    margin-top: 3.5rem;
`

const Row = styled.div`
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(3, 1fr);
`

const StyledCheckbox = styled(Checkbox)`
    width: 24px !important;
    height: 24px !important;
`
const PurposeCheckbox = ({
    id, disabled, onChange, purposes, value,
}: { id: string, disabled: boolean, onChange: Function, purposes: any, value: string }) => (
    <CheckboxLabel htmlFor={id}>
        <StyledCheckbox
            id={id}
            name={id}
            value={purposes[id]}
            onChange={onChange}
            disabled={disabled}
        />&nbsp;
        <Translate
            value={value || `editProductPage.policies.${id}`}
            dangerousHTML
        />
    </CheckboxLabel>
)

const AutomatedCheckbox = ({
    id, disabled, onChange, automatedDecision, value,
}: { id: string, disabled: boolean, onChange: Function, value: string, automatedDecision: any }) => (
    <CheckboxLabel htmlFor={id}>
        <StyledCheckbox
            id={id}
            name={id}
            value={automatedDecision && automatedDecision[id]}
            onChange={onChange}
            disabled={disabled}
        />&nbsp;
        <Translate
            value={value || `editProductPage.policies.${id}`}
            dangerousHTML
        />
    </CheckboxLabel>
)

const CategoriesCheckbox = ({
    id, disabled, onChange, categories, value,
}: { id: string, disabled: boolean, onChange: Function, categories: any, value: string }) => (
    <CheckboxLabel htmlFor={id}>
        <StyledCheckbox
            id={id}
            name={id}
            value={categories[id]}
            onChange={onChange}
            disabled={disabled}
        />&nbsp;
        <Translate
            value={value}
            dangerousHTML
        />
    </CheckboxLabel>
)

const CountriesCheckbox = ({
    id, disabled, onChange, countries, value, hint,
}: { id: string, disabled: boolean, onChange: Function, countries: any, value: string, hint: string, }) => (
    <CountriesLabel htmlFor={id}>
        <StyledCheckbox
            id={id}
            name={id}
            value={countries[id]}
            onChange={onChange}
            disabled={disabled}
        />&nbsp;
        <Translate
            value={value}
            dangerousHTML
        />
        {
            hint &&
            <Translate
                value={hint}
                dangerousHTML
                style={{
                    color: 'gray',
                }}
            />
        }
    </CountriesLabel>
)

const Item = styled(PurposeCheckbox)`
    padding: 10px;
    background-color: #ccc;
`

const ItemAutomated = styled(AutomatedCheckbox)`
    padding: 10px;
    background-color: #ccc;
`

const CountriesItem = styled(CountriesCheckbox)`
    padding: 10px;
    background-color: #ccc;
`

const CategoryItem = styled(CategoriesCheckbox)`
    padding: 10px;
    background-color: #ccc;
`

const TextArea = styled(Text)`
    width: 900px !important;
    height: 250px !important
    `

const Purpose = ({
    setPurposes, setCountries, setCategories, countries, categories, purposes, setPeriod, period, safeGuards, setSafeGuards, sector, clicked,
    automatedDecision, setAutomatedDecision,
}: Props) => {
    const product = useProduct()
    const { priceCurrency } = product
    const countriesOpt = [
        {
            label: 'Andorra', value: 0,
        },
        {
            label: 'Argentina', value: 1,
        },
        {
            label: 'Canada', value: 2,
        },
        {
            label: 'Faroe Islands', value: 3,
        },
        {
            label: 'Guernsey', value: 4,
        },
        {
            label: 'Israel', value: 5,
        },
        {
            label: 'Isle of Man', value: 6,
        },
        {
            label: 'Japan', value: 7,
        },
        {
            label: 'Jersey', value: 8,
        },
        {
            label: 'New Zealand', value: 9,
        },
        {
            label: 'Republic of Korea', value: 10,
        },
        {
            label: 'Uruguay', value: 11,
        },
        {
            label: 'UK', value: 12,
        },
    ]
    const countriesOptions = useMemo(() => (countriesOpt || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [countriesOpt])

    const periodOpt = [{
        label: 'Hours', value: timeUnits.hour,
    },
    {
        label: 'Days', value: timeUnits.day,
    },
    {
        label: 'Weeks', value: timeUnits.week,
    },
    {
        label: 'Months', value: timeUnits.month,
    },
    {
        label: 'Years', value: timeUnits.year,
    }]

    const periodOptions = useMemo(() => (periodOpt || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [periodOpt])

    return (
        <PurposeContainer>
            <Translate
                tag="h3"
                value="Use of the data product"
            />
            <div className="mb-3">
                <Translate
                    value="Please select for which purpose(s) you will process the data"
                />
                {
                    clicked && ((sector === 'Health and wellness' && !purposes.marketing && !purposes.publicly_funded_research && !purposes.private_research && !purposes.managment && !purposes.automated)
                    || (sector !== 'Health and wellness' && !purposes.study_recommendations && !purposes.job_offers && !purposes.statistical_research)
                    ) &&
                    <Errors
                        theme={MarketplaceTheme}
                        style={{
                            marginBottom: 15,
                        }}
                    >
                        Please select at least one purpose
                    </Errors>
                }
            </div>
            <DetailsContainer>
                {(sector === 'Health and wellness' &&
                    <Row>
                        <Item
                            id="marketing"
                            product={product}
                            purposes={purposes}
                            onChange={(e) => {
                                setPurposes({
                                    ...purposes, marketing: e.target.checked,
                                })
                            }}
                        />
                        <Item
                            id="publicly_funded_research"
                            product={product}
                            purposes={purposes}
                            onChange={(e) => {
                                setPurposes({
                                    ...purposes, publicly_funded_research: e.target.checked,
                                })
                            }}
                        />
                        <Item
                            id="private_research"
                            product={product}
                            purposes={purposes}
                            onChange={(e) => {
                                setPurposes({
                                    ...purposes, private_research: e.target.checked,
                                })
                            }}
                        />
                        <Item
                            id="managment"
                            product={product}
                            purposes={purposes}
                            onChange={(e) => {
                                setPurposes({
                                    ...purposes, managment: e.target.checked,
                                })
                            }}
                        />
                        <Item
                            id="automated"
                            product={product}
                            purposes={purposes}
                            onChange={(e) => {
                                setPurposes({
                                    ...purposes, automated: e.target.checked,
                                })
                            }}
                        />
                    </Row>
                )
                    ||
                    <Row>
                        <Item
                            id="study_recommendations"
                            product={product}
                            purposes={purposes}
                            onChange={(e) => {
                                setPurposes({
                                    ...purposes, study_recommendations: e.target.checked,
                                })
                            }}
                        />
                        <Item
                            id="job_offers"
                            product={product}
                            purposes={purposes}
                            onChange={(e) => {
                                setPurposes({
                                    ...purposes, job_offers: e.target.checked,
                                })
                            }}
                        />
                        <Item
                            id="statistical_research"
                            product={product}
                            purposes={purposes}
                            onChange={(e) => {
                                setPurposes({
                                    ...purposes, statistical_research: e.target.checked,
                                })
                            }}
                        />
                        <Item
                            id="automated"
                            product={product}
                            purposes={purposes}
                            onChange={(e) => {
                                setPurposes({
                                    ...purposes, automated: e.target.checked,
                                })
                            }}
                        />
                    </Row>
                }
            </DetailsContainer>
            <div className="mt-5 mb-2 pr-5">
                {
                    purposes && purposes.automated &&
                    <Translate
                        value="Please select which workings and potential significance and envisaged consequences for the data subject will apply to the automated decision making"
                    />
                }
                {/* {
                    clicked && purposes.automated && (!automatedDecision.clinical_risks_assessment && !automatedDecision.diagnostic_or_treatment && !automatedDecision.hiring_assessments && !automatedDecision.automated_placing) &&
                    <Errors
                        theme={MarketplaceTheme}
                        style={{
                            marginBottom: 15,
                        }}
                    >
                        Please select at least one option
                    </Errors>
                } */}
            </div>
            {
                purposes && purposes.automated &&
                <div>
                    <Row>
                        <ItemAutomated
                            id="clinical_risks_assessment"
                            product={product}
                            automatedDecision={automatedDecision}
                            onChange={(e) => {
                                setAutomatedDecision({
                                    ...automatedDecision, clinical_risks_assessment: e.target.checked,
                                })
                            }}
                            value="Clinical risks assessment"
                        />
                        <ItemAutomated
                            id="diagnostic_or_treatment"
                            product={product}
                            automatedDecision={automatedDecision}
                            onChange={(e) => {
                                setAutomatedDecision({
                                    ...automatedDecision, diagnostic_or_treatment: e.target.checked,
                                })
                            }}
                            value="Diagnostic or treatment suggestions"
                        />
                        <ItemAutomated
                            id="hiring_assessments"
                            product={product}
                            automatedDecision={automatedDecision}
                            onChange={(e) => {
                                setAutomatedDecision({
                                    ...automatedDecision, hiring_assessments: e.target.checked,
                                })
                            }}
                            value="Hiring assessments"
                        />
                        <ItemAutomated
                            id="automated_placing"
                            product={product}
                            automatedDecision={automatedDecision}
                            onChange={(e) => {
                                setAutomatedDecision({
                                    ...automatedDecision, automated_placing: e.target.checked,
                                })
                            }}
                            value="Automated placing of services and product offerings"
                        />
                    </Row>
                </div>
            }
            <div className="mt-5 mb-3 pr-5">
                <Translate
                    value="Categories of personal data that you will use"
                />
                {
                    clicked && ((sector === 'Health and wellness' && !categories.patients_medical_records && !categories.genetic_data && !categories.imaging_data && !categories.mobile_data)
                    || (sector === 'Education' && !categories.grades && !categories.diplomas && !categories.matriculation)
                    ) &&
                    <Errors
                        theme={MarketplaceTheme}
                        style={{
                            marginBottom: 15,
                        }}
                    >
                        Please select at least one category
                    </Errors>
                }
            </div>
            {
                sector === 'Health and wellness' &&
                <Row>
                    <CategoryItem
                        id="patients_medical_records"
                        product={product}
                        categories={categories}
                        onChange={(e) => {
                            setCategories({
                                ...categories, patients_medical_records: e.target.checked,
                            })
                        }}
                        value="Patients medical records"
                    />
                    <CategoryItem
                        id="genetic_data"
                        product={product}
                        categories={categories}
                        onChange={(e) => {
                            setCategories({
                                ...categories, genetic_data: e.target.checked,
                            })
                        }}
                        value="Genetic data"
                    />
                    <CategoryItem
                        id="imaging_data"
                        product={product}
                        categories={categories}
                        onChange={(e) => {
                            setCategories({
                                ...categories, imaging_data: e.target.checked,
                            })
                        }}
                        value="Imaging data (ex radiology or pathology images)"
                    />
                    <CategoryItem
                        id="mobile_data"
                        product={product}
                        categories={categories}
                        onChange={(e) => {
                            setCategories({
                                ...categories, mobile_data: e.target.checked,
                            })
                        }}
                        value="Mobile data (ex geolocation or from wearable devices)"
                    />
                </Row>
            }

            {
                sector === 'Education' &&
                    <Row>
                        <CategoryItem
                            id="grades"
                            product={product}
                            categories={categories}
                            onChange={(e) => {
                                setCategories({
                                    ...categories, grades: e.target.checked,
                                })
                            }}
                            value="Grades"
                        />
                        <CategoryItem
                            id="diplomas"
                            product={product}
                            categories={categories}
                            onChange={(e) => {
                                setCategories({
                                    ...categories, diplomas: e.target.checked,
                                })
                            }}
                            value="Diplomas"
                        />
                        <CategoryItem
                            id="matriculation"
                            product={product}
                            categories={categories}
                            onChange={(e) => {
                                setCategories({
                                    ...categories, matriculation: e.target.checked,
                                })
                            }}
                            value="Matriculation status"
                        />
                    </Row>
            }

            <div className="mt-5 mb-3 pe-5">
                <Translate
                    value="To which country and region is the data transferred?"
                />
                {
                    clicked &&
                    (!countries.EUCountry && !countries.nonEU && !countries.noAdeqDecision) &&
                    <Errors
                        theme={MarketplaceTheme}
                        style={{
                            marginBottom: 15,
                        }}
                    >
                        Please select at least one option
                    </Errors>
                }
            </div>
            <Row>
                <CountriesItem
                    id="EUCountry"
                    product={product}
                    countries={countries}
                    onChange={(e) => {
                        setCountries({
                            ...countries, EUCountry: e.target.checked,
                        })
                    }}
                    value="EU/EEA countries"
                />
            </Row>
            <Row className="mt-3">
                <CountriesItem
                    id="nonEU"
                    product={product}
                    countries={countries}
                    onChange={(e) => {
                        setCountries({
                            ...countries, nonEU: e.target.checked,
                        })
                    }}
                    value="To a non-EU/EEA country with an adequacy decision"
                />
                <SelectField
                    name="countries"
                    options={countriesOptions}
                    // value={selectedCountry}
                    onChange={(option) => setCountries({
                        ...countries,
                        nonEUCountry: option.label,
                    })
                    }
                    isSearchable={false}
                    disabled={!countries.nonEU}
                    errorsTheme={MarketplaceTheme}
                />
            </Row>
            {
                clicked &&
                    (countries.nonEU && !countries.nonEUCountry) &&
                    <Errors
                        theme={MarketplaceTheme}
                        style={{
                            marginBottom: 15,
                        }}
                    >
                        Please select at least one option
                    </Errors>
            }
            <Row className="mt-2">
                <CountriesItem
                    id="noAdeqDecision"
                    product={product}
                    countries={countries}
                    onChange={(e) => {
                        setCountries({
                            ...countries, noAdeqDecision: e.target.checked,
                        })
                    }}
                    value="To a non-EU/EEA country without an adequacy decision"
                />
                <Text
                    onChange={(e) =>
                        setCountries({
                            ...countries, noAdeqDecisionCountry: e.target.value,
                        })
                    }
                    disabled={!countries.noAdeqDecision}
                />
            </Row>
            {
                clicked &&
                        (countries.noAdeqDecision && (countries?.noAdeqDecisionCountry?.length === 0 || !countries.noAdeqDecisionCountry)) &&
                        <Errors
                            theme={MarketplaceTheme}
                            style={{
                                marginBottom: 15,
                            }}
                        >
                            Please list the country/countries
                        </Errors>
            }
            <div className="pe-5 mb-4 mt-5">
                {
                    countries.noAdeqDecision &&
                    <Translate
                        value="purchase.safeguards"
                    />
                }
                {
                    clicked && countries.noAdeqDecision &&
                    (safeGuards === '' || safeGuards.length === 0 || !safeGuards) &&
                    <Errors
                        theme={MarketplaceTheme}
                        style={{
                            marginBottom: 15,
                        }}
                    >
                        Please inform about the risks
                    </Errors>
                }
            </div>
            {
                countries.noAdeqDecision &&
                    <Row>
                        <TextArea
                            tag="textarea"
                            onChange={(e) => setSafeGuards(e.target.value)}
                        />
                    </Row>
            }
            {
                priceCurrency === 'EUR' &&
                <div>
                    <Translate
                        tag="h3"
                        value="Time preriod and price"
                        className="mt-5"
                    />
                    <div className="mt-2 mb-2 pr-5">
                        <Translate
                            value="purchase.price"
                        />
                        {
                            clicked && (!period.period || !period.periodNumber) &&
                            <Errors
                                theme={MarketplaceTheme}
                                style={{
                                    marginBottom: 15,
                                }}
                            >
                                Please select time and price
                            </Errors>
                        }
                    </div>
                    <div className="d-flex align-items-baseline">
                        <Text
                            type="number"
                            onChange={(e) => setPeriod({
                                ...period,
                                periodNumber: e.target.value,
                            })}
                            style={{
                                width: 60, marginRight: 10,
                            }}
                        />
                        <SelectFieldNarrow
                            name="time-period"
                            options={periodOptions}
                            // value={selectedCountry}
                            onChange={(option) => setPeriod({
                                ...period,
                                period: option.value,
                            })}
                            isSearchable={false}
                            // disabled={!!disabled}
                            errorsTheme={MarketplaceTheme}
                        />
                        <div className="d-flex">
                            <p className="ms-5 me-2">Total price</p>

                            <PaymentRate
                            // className={styles.price}
                                amountTime={period.periodNumber}
                                amount={product.pricePerSecond}
                                currency={priceCurrency}
                                timeUnit={period.period}
                            />
                        </div>
                    </div>
                </div>
            }
        </PurposeContainer>
    )
}

export default Purpose
