/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable flowtype/no-types-missing-file-annotation */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */

import React, { useContext, useEffect, useState } from 'react'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
import { get } from '$shared/utils/api'
import { selectUserData } from '$shared/modules/user/selectors'
import Text from '$ui/Text'
import Button from '$shared/components/Button'

// import { WithContext as ReactTags } from 'react-tag-input'
import SelectField from '$mp/components/SelectField'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import Checkbox from '$shared/components/Checkbox'
import routes from '$routes'
import useEditableProduct from '../ProductController/useEditableProduct'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import useValidation from '../ProductController/useValidation'
import { Context as EditControllerContext } from './EditControllerProvider'

type Props = {
    className?: string,
    disabled?: boolean,
}

const Section = styled.section`
    background: none;
`

const CheckboxContainer = styled.div`
    display: block;
    // margin-top: 40px;
`

const displayInline = {
    display: 'inline-flex',
    marginBottom: 38,
}

const padding = {
    padding: '10px',
}

const CheckboxLabel = styled.label`
    display: flex;
    margin: 0;
`

const DetailsContainer = styled.div`
    display: block;
`

const StyledCheckbox = styled(Checkbox)`
    width: 24px !important;
    height: 24px !important;
`

const Row = styled.div`
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
`

// const DivItem = styled.div`
//     flex: 0 32%;
//     // margin-bottom: 2%;
// `

// const PolicyCheckbox = ({ id, product, updatePolicies, disabled }: { id: string, product: any, updatePolicies: any, disabled: boolean }) => (
//     <div>
//         <CheckboxLabel htmlFor={id}>
//             <StyledCheckbox
//                 id={id}
//                 name={id}
//                 value={product.policies && product.policies[id]}
//                 onChange={(e) => {
//                     updatePolicies({
//                         ...product.policies,
//                         [id]: e.target.checked,
//                     })
//                 }}
//                 disabled={disabled}
//             />&nbsp;
//             <Translate
//                 value={`editProductPage.policies.${id}`}
//                 dangerousHTML
//             />
//         </CheckboxLabel>
//     </div>
// )

const PolicyRecipientCheckbox = ({
    id, product, updatePolicies, disabled, recipient, setRecipient,
}: { id: string, product: any, updatePolicies: any, disabled: boolean, recipient: any, setRecipient: any }) => (
    <div>
        <CheckboxLabel htmlFor={id}>
            <StyledCheckbox
                id={id}
                name={id}
                value={recipient.find((item) => item === id)}
                onChange={(e) => {
                    e.target.checked ? setRecipient([...recipient, id]) : setRecipient(recipient.filter((item) => item !== id))
                }}
                disabled={disabled}
            />&nbsp;
            <Translate
                value={`editProductPage.policies.${id}`}
                dangerousHTML
            />
        </CheckboxLabel>
    </div>
)

const PurposesCheckbox = ({ id, product, updatePurposes, disabled }: { id: string, product: any, updatePurposes: any, disabled: boolean }) => (
    <div>
        <CheckboxLabel htmlFor={id}>
            <StyledCheckbox
                id={id}
                name={id}
                value={product.purposes && product.purposes[id]}
                onChange={(e) => {
                    updatePurposes({
                        ...product.purposes,
                        [id]: e.target.checked,
                    })
                }}
                disabled={disabled}
            />&nbsp;
            <Translate
                value={`editProductPage.policies.${id}`}
                dangerousHTML
            />
        </CheckboxLabel>
    </div>
)

const AutomatedCheckbox = ({ id, product, updateAutomatedConsequences, disabled }: { id: string, product: any, updateAutomatedConsequences: any, disabled: boolean }) => (
    <div>
        <CheckboxLabel htmlFor={id}>
            <StyledCheckbox
                id={id}
                name={id}
                value={product.automatedConsequences && product.automatedConsequences[id]}
                onChange={(e) => {
                    updateAutomatedConsequences({
                        ...product.automatedConsequences,
                        [id]: e.target.checked,
                    })
                }}
                disabled={disabled}
            />&nbsp;
            <Translate
                value={`editProductPage.policies.${id}`}
                dangerousHTML
            />
        </CheckboxLabel>
    </div>
)

const PolicyCountries = ({
    id, product, disabled, updateSharingCountries, hint,
}: { id: string, product: any, updateSharingCountries: any, disabled: boolean, hint: string }) => (
    <div>
        <CheckboxLabel htmlFor={id}>
            <StyledCheckbox
                id={id}
                name={id}
                value={product.dataShareCountries && product.dataShareCountries[id]}
                onChange={(e) => {
                    updateSharingCountries({
                        ...product.dataShareCountries,
                        [id]: e.target.checked,
                    })
                }}
                disabled={disabled}
            />&nbsp;
            <div>
                <Translate
                    value={`editProductPage.policies.${id}`}
                    dangerousHTML
                />
                <br />
                {
                    hint &&
                    <Translate
                        value={hint}
                        dangerousHTML
                        style={{
                            color: 'gray',
                            fontSize: 13,
                            lineHeight: 1,
                        }}
                    />
                }
            </div>
        </CheckboxLabel>
    </div>
)

const ItemPurposes = styled(PurposesCheckbox)`
    padding: 10px;
    background-color: #ccc;
`
const ItemAutomated = styled(AutomatedCheckbox)`
    padding: 10px;
    background-color: #ccc;
`

const ItemRecipient = styled(PolicyRecipientCheckbox)`
padding: 10px;
background-color: #ccc;
`

const ItemCountries = styled(PolicyCountries)`
    padding: 10px;
    background-color: #ccc;
`

const PolicyRadioButton = ({ name1, id, product, updatePolicies }: { name1: string, id: string, product: any, updatePolicies: any }) => (
    <div>
        <div id={id} style={displayInline}>
            <div style={padding}>
                <label>
                    <input
                        type="radio"
                        name={name1}
                        value="Yes"
                        onChange={(e) => {
                            updatePolicies({
                                ...product.policies,
                                [name1]: e.target.checked,
                            })
                        }}
                    />
                    <span className="mx-1">Yes</span>
                </label>
            </div>
            <div style={padding}>
                <label>
                    <input
                        type="radio"
                        name={name1}
                        onChange={(e) => {
                            updatePolicies({
                                ...product.policies,
                                [name1]: !e.target.checked,
                            })
                        }}
                        value="No"
                    />
                    <span className="mx-1">No</span>
                </label>
            </div>
        </div>
    </div>
)

const SelectFieldNarrow = styled(SelectField)`
    width: 16rem;
`

const Policies = ({ className, disabled }: Props) => {
    const product = useEditableProduct()
    const { sector } = product
    const { type } = product
    const { updatePolicies, updateSharingCountries, updatePurposes, updateAutomatedConsequences } = useEditableProductActions()
    const { publishAttempted } = useContext(EditControllerContext)
    const [selectedCompanies, setSelectedCompanies] = useState([])
    const [whitelistedUsers, setWhitelistedUsers] = useState([])
    const [whitelistedEmails, setWhitelistedEmails] = useState([])
    const [recipient, setRecipient] = useState([])
    const [emailValid, setEmailValid] = useState(null)

    const currentUser = useSelector(selectUserData)

    const { isValid: isPersonalDataValid, message: personalDataMessage } = useValidation('policies.personalData')
    const { isValid: isConsentObtainedValid, message: consentObtainedMessage } = useValidation('policies.consentObtained')
    const { isValid: isAutomatedConsequencesValid, message: automatedConsequencesMessage } = useValidation('policies.automatedConsequences')
    const { isValid: isPurposesValid, message: purposesMessage } = useValidation('product.purposes')
    const { isValid: isAccessValid, message: accessMessage } = useValidation('policies.access')
    const { isValid: isSharedValid, message: sharedMessage } = useValidation('policies.sharedWith')
    const { isValid: isSensitiveDataValid, message: sensitiveDataMessage } = useValidation('policies.sensitiveData')
    const { isValid: isAllowedCompaniesValid, message: allowedCompaniesMessage } = useValidation('allowedCompanies')

    const personalData = 'personalData'
    const sensitiveData = 'sensitiveData'
    const personalDataId = 'personalDataId'
    const consentId = 'consentId'
    const consentObtained = 'personalDataOfOthers'

    const companies = [{
        label: 'The Demo Company', value: '1',
    }, {
        label: 'The Demo Company 2', value: '2',
    }, {
        label: 'The Demo Company 3', value: '3',
    }, {
        label: 'The Demo Company 4', value: '4',
    }, {
        label: 'The Demo Company 5', value: '5',
    }]

    const handleDelete = (i) => {
        setSelectedCompanies(selectedCompanies.filter((tag, index) => index !== i))
        // updateAllowedCompanies(selectedCompanies.filter((tag, index) => index !== i))
    }

    const handleAdd = (i) => {
        setSelectedCompanies([...selectedCompanies, i])
        // updateAllowedCompanies([...selectedCompanies, i])
    }

    const handleDeleteUsers = (i) => {
        setWhitelistedEmails(whitelistedEmails.filter((tag, index) => index !== i))
        setWhitelistedUsers(whitelistedUsers.filter((tag, index) => index !== i))
        setEmailValid(null)
    }

    const handleAddUsers = () => {
        const input = document.getElementById('whitelist-email')
        const innerText = input.value

        if (emailValid) {
            setWhitelistedEmails([...whitelistedEmails, innerText])
            document.getElementById('whitelist-email').value = ''
        }
    }

    const isValidEmail = async (email) => {
        const res = await get({
            url: routes.api.usersEmail({
                email,
            }),
        })
            .then((result) => {
                setEmailValid(!!result)
                if (!!result === true && whitelistedUsers.find((item) => item === result) === undefined) {
                    setWhitelistedUsers([...whitelistedUsers, result])
                }
            })
            // eslint-disable-next-line no-console
            .catch((e) => console.log('ERROR', e))
    }

    const validatingUser = (e) => {
        const input = document.getElementById('whitelist-email')
        const innerText = input.value
        if (e.key === 'Enter') {
            isValidEmail(e.target.value)
        }

        if (e.target.tagName === 'BUTTON') {
            isValidEmail(innerText)
        }
    }
    useEffect(() => {
        handleAddUsers()
    }, [emailValid])

    useEffect(() => {
        currentUser.institutionalAffiliation === 'No' && product.policies.personalData && updatePolicies({
            ...product.policies,
            personalDataOfOthers: true,
        })
    }, [product.policies.personalData])

    useEffect(() => {
        updatePolicies({
            ...product.policies,
            recipientType: recipient,
        })
    }, [recipient])

    useEffect(() => {
        updatePolicies({
            ...product.policies,
            approvedUsers: whitelistedUsers,
        })
    }, [whitelistedUsers])

    useEffect(() => {
        updatePolicies({
            ...product.policies,
            approvedOrgs: selectedCompanies,
        })
    }, [selectedCompanies])

    useEffect(() => {
    }, [product.policies, whitelistedEmails])

    const CompanyTag = styled.div`
    padding: 10px;
    background-color: #EFEFEF;
    color: black;
    border-radius: 5px;
    margin: 10px 10px 10px 0;
    width: fit-content;
`

    return (
        <Section
            id="policies"
            className={className}
        >
            <Translate tag="h1" value="editProductPage.policies.title" />
            <Translate
                value="editProductPage.policies.description"
                tag="p"
                dangerousHTML
            />
            <CheckboxContainer>
                <Translate tag="p" value="editProductPage.policies.controllerType" />
                <div>
                    {
                        publishAttempted && !isPersonalDataValid && (
                            <Errors
                                theme={MarketplaceTheme}
                                style={{
                                    marginTop: -10,
                                    marginBottom: 15,
                                }}
                            >
                                {personalDataMessage}
                            </Errors>
                        )}
                </div>
                <PolicyRadioButton
                    name1={personalData}
                    id={personalDataId}
                    updatePolicies={updatePolicies}
                    product={product}
                    error={publishAttempted && !isPersonalDataValid ? personalDataMessage : false}
                />
            </CheckboxContainer>
            {
                (product.policies.personalData && sector === 'Health and wellness') &&
                <CheckboxContainer>
                    <Translate tag="p" value="editProductPage.policies.sensitiveData" />
                    <div>
                        {
                            publishAttempted && !isSensitiveDataValid && type !== 'ANALYTICS' && (
                                <Errors
                                    theme={MarketplaceTheme}
                                    style={{
                                        marginTop: -10,
                                        marginBottom: 15,
                                    }}
                                >
                                    {sensitiveDataMessage}
                                </Errors>
                            )
                        }
                    </div>

                    <PolicyRadioButton
                        name1={sensitiveData}
                        id={consentId}
                        updatePolicies={updatePolicies}
                        product={product}
                        style={{
                            marginBottom: 40,
                        }}
                    />
                </CheckboxContainer>
            }

            {
                (currentUser.institutionalAffiliation === 'Yes' && product.policies.personalData) &&
                <CheckboxContainer>
                    <Translate tag="p" value="editProductPage.policies.hasconsent" />
                    <Translate
                        tag="p"
                        style={{
                            color: 'gray',
                        }}
                        value="editProductPage.policies.hasconsentText"
                    />
                    <div>
                        {
                            publishAttempted && !isConsentObtainedValid && (
                                <Errors
                                    theme={MarketplaceTheme}
                                    style={{
                                        marginTop: -10,
                                        marginBottom: 15,
                                    }}
                                >
                                    {consentObtainedMessage}
                                </Errors>
                            )
                        }
                    </div>

                    <PolicyRadioButton
                        name1={consentObtained}
                        id={consentId}
                        updatePolicies={updatePolicies}
                        product={product}
                        style={{
                            marginBottom: 40,
                        }}
                    />
                </CheckboxContainer>
            }

            <DetailsContainer>
                {
                    type !== 'ANALYTICS' && currentUser.institutionalAffiliation === 'Yes' && product.policies.personalData &&
                    <Translate tag="p" value="editProductPage.policies.purposes.org" />
                }
                {
                    type !== 'ANALYTICS' && currentUser.institutionalAffiliation === 'Yes' && (!product.policies.personalData || product.policies.personalData === undefined) &&
                    <Translate tag="p" value="editProductPage.policies.purposes.title" />
                }
                {
                    type !== 'ANALYTICS' && currentUser.institutionalAffiliation === 'No' &&
                    <Translate tag="p" value="editProductPage.policies.purposes.title" />
                }
                <div>
                    {
                        publishAttempted && !isPurposesValid && (
                            <Errors
                                theme={MarketplaceTheme}
                                style={{
                                    marginTop: -10,
                                    marginBottom: 15,
                                }}
                            >
                                {purposesMessage}
                            </Errors>
                        )
                    }
                </div>
                {((sector === 'Health and wellness' && type !== 'ANALYTICS') || type === 'STREAMS') &&
                <Row className="mb-5">
                    <ItemPurposes id="marketing" product={product} updatePurposes={updatePurposes} disabled={!!disabled} />
                    <ItemPurposes id="publicly_funded_research" product={product} updatePurposes={updatePurposes} disabled={!!disabled} />
                    <ItemPurposes id="private_research" product={product} updatePurposes={updatePurposes} disabled={!!disabled} />
                    <ItemPurposes id="managment" product={product} updatePurposes={updatePurposes} disabled={!!disabled} />
                    <ItemPurposes id="automated" product={product} updatePurposes={updatePurposes} disabled={!!disabled} />
                </Row>
                }
                {(sector === 'Education' && type !== 'ANALYTICS') &&
                <Row className="mb-5">
                    <ItemPurposes id="study_recommendations" product={product} updatePurposes={updatePurposes} disabled={!!disabled} />
                    <ItemPurposes id="job_offers" product={product} updatePurposes={updatePurposes} disabled={!!disabled} />
                    <ItemPurposes id="statistical_research" product={product} updatePurposes={updatePurposes} disabled={!!disabled} />
                    <ItemPurposes id="automated" product={product} updatePurposes={updatePurposes} disabled={!!disabled} />
                </Row>
                }
                {
                    product.purposes && product.purposes.automated && (
                        (currentUser.institutionalAffiliation === 'Yes' || type === 'STREAMS') ?
                            <div className="mt-3">
                                <Translate tag="p" value="editProductPage.policies.potentialSignificanceOrg" />
                            </div>
                            :
                            <div className="mt-3">
                                <Translate tag="p" value="editProductPage.policies.potentialSignificance" />
                            </div>
                    )
                }
                {
                    <div>
                        {
                            publishAttempted && !isAutomatedConsequencesValid && (
                                <Errors
                                    theme={MarketplaceTheme}
                                    style={{
                                        marginTop: -10,
                                        marginBottom: 15,
                                    }}
                                >
                                    {automatedConsequencesMessage}
                                </Errors>
                            )
                        }
                    </div>
                }
                {
                    product.purposes && product.purposes.automated && (
                        (currentUser.institutionalAffiliation === 'Yes' || type === 'STREAMS') ?
                            <div className="mt-3">
                                <Row className="mb-5">
                                    <ItemAutomated id="automated_placing" product={product} updateAutomatedConsequences={updateAutomatedConsequences} disabled={!!disabled} />
                                    <ItemAutomated id="hiring_assessments" product={product} updateAutomatedConsequences={updateAutomatedConsequences} disabled={!!disabled} />
                                    <ItemAutomated id="clinical_risks_assessment" product={product} updateAutomatedConsequences={updateAutomatedConsequences} disabled={!!disabled} />
                                    <ItemAutomated id="diagnostic_or_treatment" product={product} updateAutomatedConsequences={updateAutomatedConsequences} disabled={!!disabled} />
                                </Row>
                            </div>
                            :
                            <div className="mt-3">
                                <Row className="mb-5">
                                    <ItemAutomated id="automated_placing" product={product} updateAutomatedConsequences={updateAutomatedConsequences} disabled={!!disabled} />
                                    <ItemAutomated id="hiring_assessments" product={product} updateAutomatedConsequences={updateAutomatedConsequences} disabled={!!disabled} />
                                    <ItemAutomated id="clinical_risks_assessment" product={product} updateAutomatedConsequences={updateAutomatedConsequences} disabled={!!disabled} />
                                    <ItemAutomated id="diagnostic_or_treatment" product={product} updateAutomatedConsequences={updateAutomatedConsequences} disabled={!!disabled} />
                                </Row>
                            </div>
                    )
                }

                {
                    (type !== 'ANALYTICS' && sector === 'Health and wellness') ?
                        <Translate
                            tag="p"
                            value="Which companies or institutions that are currently registered on KRAKEN marketplace will be able to access and use this data?"
                            className="mt-3"
                        />
                        :
                        <Translate tag="p" value="editProductPage.policies.access" className="mt-3" />
                }
                <div>
                    {
                        publishAttempted && !isAccessValid && (
                            <Errors
                                theme={MarketplaceTheme}
                                style={{
                                    marginTop: -10,
                                    marginBottom: 15,
                                }}
                            >
                                {accessMessage}
                            </Errors>
                        )
                    }
                    {
                        publishAttempted && !isAllowedCompaniesValid && (
                            <Errors
                                theme={MarketplaceTheme}
                                style={{
                                    marginTop: -10,
                                    marginBottom: 15,
                                }}
                            >
                                {allowedCompaniesMessage}
                            </Errors>
                        )}
                </div>
                {
                    type !== 'ANALYTICS' && sector === 'Health and wellness' &&
                        <div>
                            <SelectFieldNarrow
                                name="allowedCompanies"
                                options={companies}
                                onChange={(option) => handleAdd(option.label)}
                                // isSearchable={false}
                                disabled={!!disabled}
                            />
                            <div className="mt-3 d-flex flex-wrap">
                                {
                                    selectedCompanies.map((comp, index) => <CompanyTag key={comp}> {comp} <span role="button" onClick={() => handleDelete(index)} >X</span> </CompanyTag>)
                                }
                            </div>
                        </div>
                }
                {
                    type === 'ANALYTICS' && sector === 'Health and wellness' &&
                    <Row>
                        <ItemRecipient id="categories" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="public_hospitals" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="private_hospitals" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="private_research_centers" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="public_research_institutions" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="other" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="governments" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="private_companies" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                    </Row>
                }

                {
                    sector === 'Education' &&
                    <Row>
                        <ItemRecipient id="categories" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="educational_institutions" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="private_companies" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="public_institutions" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="public_research_centers" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="public_research_institutions" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                        <ItemRecipient id="hr_agencies" product={product} updatePolicies={updatePolicies} disabled={!!disabled} recipient={recipient} setRecipient={setRecipient} />
                    </Row>
                }
                <div>
                    <Translate tag="p" value="editProductPage.policies.countries" className="mt-5" />
                    <div>
                        {
                            publishAttempted && !isSharedValid && (
                                <Errors
                                    theme={MarketplaceTheme}
                                    style={{
                                        marginTop: -10,
                                        marginBottom: 15,
                                    }}
                                >
                                    {sharedMessage}
                                </Errors>
                            )}
                    </div>
                    <Row>
                        <ItemCountries
                            id="euCountries"
                            product={product}
                            updateSharingCountries={updateSharingCountries}
                            disabled={!!disabled}
                        />
                        <ItemCountries
                            id="thirdCountries"
                            product={product}
                            updateSharingCountries={updateSharingCountries}
                            disabled={!!disabled}
                        />
                        <ItemCountries
                            id="allOther"
                            product={product}
                            updateSharingCountries={updateSharingCountries}
                            disabled={!!disabled}
                            // hint="editProductPage.policies.allOther.hint"
                            hint="Warning! Please be aware that in this case the European Union data protection safeguards do not apply, and the withdrawal of consent cannot be enforced"
                        />
                    </Row>
                </div>
                <div>
                    <Translate tag="p" value="In addition to the above preferences, if you would like to whitelist a specific user(s) to access your data please enter their email address below:" className="mt-5" />
                    <div>
                        {
                            emailValid === false && (
                                <Errors
                                    theme={MarketplaceTheme}
                                    style={{
                                        marginTop: -10,
                                        marginBottom: 15,
                                    }}
                                >
                                    Please write a valid email address
                                </Errors>
                            )}
                    </div>
                    <div className="d-flex align-items-center">
                        <Text
                            placeholder="type email"
                            name=""
                            onKeyDown={(e) => validatingUser(e)}
                            id="whitelist-email"
                        />
                        <Button variant="secondary" size="mini" type="submit" onClick={(e) => validatingUser(e)} className="ms-3">
                            Add
                        </Button>
                    </div>
                </div>
                <div className="d-flex flex-wrap">
                    {
                        whitelistedEmails && whitelistedEmails.map((user, index) => <CompanyTag key={user}> {user} <span role="button" onClick={() => handleDeleteUsers(index)} >X</span> </CompanyTag>)
                    }
                </div>
            </DetailsContainer>
        </Section>
    )
}

export default Policies
