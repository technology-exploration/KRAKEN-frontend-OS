/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useEffect } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import * as yup from 'yup'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import Button from '$shared/components/Button'
import Text from '$ui/Text'
import SelectField from '$mp/components/SelectField'
import Checkbox from '$shared/components/Checkbox'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import routes from '$routes'
import InstitutionalAffiliationModal from './InstitutionalAffiliationModal'
import PrivacyModal from './PrivacyModal'
import ProviderConsumerModal from './ProviderConsumerModal'
// import RegistrationModal from './RegistrationModal'

const text = {
    fontSize: '14px',
    lineHeight: '1',
    width: '80%',
}

const label = {
    fontSize: '14px',
    lineHeight: '1.5',
}

const title = {
    width: '90%',
    lineHeight: '1.5',
    fontSize: '20px',
}

const justifyCenter = {
    justifyContent: 'center',
    marginTop: '2rem',
}

const Container = styled.section`
    padding: 1rem;
    margin-top:3.5rem;
    background-color: #f8f8f8;
    border-style: solid;
    border-color: #e3e3e3;
`
const consentStyle = {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#323232',
}

const displayInline = {
    display: 'inline-flex',
}

const SelectFieldNarrow = styled(SelectField)`
    width: 20rem;
`

const PanelRow = styled.div`
user-select: none;
display: flex;
flex-direction: row;
align-items: center;
margin-bottom: 15px;
margin-top: 15px;
justify-content: center;
`

const Header = styled.span`
    fontSize: 26px;
`

const padding = {
    padding: '0px 30px 0px 0px',
}

const StyledCheckbox = styled(Checkbox)`
    width: 24px !important;
    height: 24px !important;
`
const LinkSpan = styled.span`
font-weight: bolder;
&:hover{
text-decoration: underline;
cursor: pointer;
}
`

const SSIRegistration = ({
    registrationInfo, setRegistrationInfo, register, requestProof, modalContent, setModalContent, showMsgModal, setShowMsgModal,
}) => {
    const [yes, setYes] = useState(false)
    const [fiat, setFiat] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [validated, setValidated] = useState(false)
    const emailValidator = yup.string().trim().email()
    const [showModal, setShowModal] = useState(false)
    const [showPrivacyModal, setShowPrivacyModal] = useState(false)
    const [showProviderConsumerModal, setShowProviderConsumerModal] = useState(false)

    const handleCloseMsgModal = () => {
        setShowMsgModal(false)
        setModalContent('')
        window.location.href = routes.auth.login()
    }

    useEffect(() => {
        console.log(showMsgModal)
        console.log(handleCloseMsgModal)
        console.log(modalContent)
    }, [])

    const validate = () => {
        setClicked(true)

        if (!registrationInfo.givenName
            || !registrationInfo.firstName
            || !registrationInfo.institutionalAffiliation
            || !registrationInfo.over18
            || registrationInfo.over18 === 'No'
            || !registrationInfo.countryOfResidence
            || !validated
            || (yes && !registrationInfo.institution)
            || (yes && !registrationInfo.typeOfInstitution)
            || (yes && (!registrationInfo.legalName || !registrationInfo.legalSurname))
            || (yes && !registrationInfo.officerEmail)
            || (yes && registrationInfo.fiatPayment === false)
            || (yes && fiat && !registrationInfo.invoicingName)
            || (yes && fiat && !registrationInfo.invoicingAddress)
            || (yes && fiat && (!registrationInfo.invoicingZipCode || !registrationInfo.invoicingCountry))
            || registrationInfo.privatelyContacted === true
            || !registrationInfo.privacyConsent
            || !registrationInfo.providerConsumerConsent
        ) {
            Notification.push({
                title: 'Oops, there seems to be some errors above',
                icon: NotificationIcon.ERROR,
            })
        } else {
            register()
        }
    }

    useEffect(() => {
        if (registrationInfo.email) {
            const result = emailValidator.isValidSync(registrationInfo.email)
            if (!result) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                setValidated(false)
            } else {
                setValidated(true)
            }
        } else if (clicked && registrationInfo.email === '') {
            setValidated(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registrationInfo.email])

    useEffect(() => {
    }, [validated])

    useEffect(() => {
        if (registrationInfo.institutionalAffiliation !== 'Yes') {
            setYes(false)
        } else {
            requestProof()
            setYes(true)
            setShowModal(true)
        }
    }, [registrationInfo.institutionalAffiliation])

    useEffect(() => {
        if (registrationInfo.fiatPayment !== 'Yes') {
            setFiat(false)
        } else {
            setFiat(true)
        }
    }, [registrationInfo.fiatPayment])

    const RadioButton = ({
        // eslint-disable-next-line no-shadow
        name2, id1, setRegistrationInfo, registrationInfo, className,
    }) => (
        <div id={id1} style={displayInline} className={className}>
            <div style={padding} className="ml-3">
                <label>
                    <input
                        id="yes"
                        type="radio"
                        name={name2}
                        value="Yes"
                        onChange={(e) => setRegistrationInfo({
                            ...registrationInfo,
                            [name2]: e.target.value,
                        })
                        }
                        checked={registrationInfo[name2] === 'Yes'}
                        style={{
                            marginRight: 7,
                        }}
                    />
                    Yes
                </label>
            </div>
            <div style={padding}>
                <label>
                    <input
                        id="no"
                        type="radio"
                        name={name2}
                        onChange={(e) => {
                            setRegistrationInfo({
                                ...registrationInfo,
                                [name2]: e.target.value,
                            })
                        }}
                        value="No"
                        checked={registrationInfo[name2] === 'No'}
                        style={{
                            marginRight: 7,
                        }}
                    />
                    No
                </label>
            </div>
        </div>
    )

    const countries = [
        {
            label: 'Austria', value: 0,
        },
        {
            label: 'Belgium', value: 1,
        },
        {
            label: 'Denmark', value: 2,
        },
        {
            label: 'Estonia', value: 3,
        },
        {
            label: 'Finland', value: 4,
        },
        {
            label: 'France', value: 5,
        },
        {
            label: 'Germany', value: 6,
        },
        {
            label: 'Italy', value: 7,
        },
        {
            label: 'Netherlands', value: 8,
        },
        {
            label: 'Portugal', value: 9,
        },
        {
            label: 'Spain', value: 10,
        },
        {
            label: 'Sweden', value: 11,
        },
        {
            label: 'UK', value: 12,
        },
    ]
    const countriesOptions = useMemo(() => (countries || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [countries])
    const institutions = [
        {
            label: 'Educational institutions', value: 'educational_institutions',
        },
        {
            label: 'Private companies', value: 'private_companies',
        },
        {
            label: 'Public instutitions', value: 'public_institutions',
        },
        {
            label: 'Public research centers', value: 'public_research_centers',
        },
        {
            label: 'Public research institutions', value: 'public_research_institutions',
        },
        {
            label: 'HR agencies/headhunters', value: 'hr_agencies',
        },
        {
            label: 'Public hospitals', value: 'public_hospitals',
        },
        {
            label: 'Private hospitals', value: 'private_hospitals',
        },
        {
            label: 'Private research centers', value: 'private_research_centers',
        },
        {
            label: 'Governments', value: 'governments',
        },
        {
            label: 'Other non-profits', value: 'other',
        },
    ]

    const typeOfInstitutionOptions = useMemo(() => (institutions || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [institutions])

    return (
        <div>
            <div className="container mb-5 mt-4 text-center">
                <Header>{I18n.t('auth.registrationHeader')}</Header>
            </div>
            <div>
                <div className="row align-items-center my-4">
                    <Translate
                        value="auth.registration.sharing"
                        className="col-3 text-right"
                        style={label}
                    />
                    <RadioButton
                        name2="institutionalAffiliation"
                        id1="institutionalId"
                        setRegistrationInfo={setRegistrationInfo}
                        registrationInfo={registrationInfo}
                        className="col-4 mx-3"
                    />
                    {
                        clicked && registrationInfo.institutionalAffiliation === false &&
                        <Errors
                            theme={MarketplaceTheme}
                            style={{
                                marginBottom: 15,
                            }}
                        >
                            Select an option
                        </Errors>
                    }
                </div>

                <div className="row align-items-baseline my-4">
                    <Translate
                        value="auth.registration.name"
                        className="col-3 text-right"
                        style={label}
                    />
                    <div className="col-4 mx-3">
                        <Text
                            defaultValue={registrationInfo.firstName}
                            onChange={(e) => setRegistrationInfo({
                                ...registrationInfo,
                                firstName: e.target.value,
                            })}
                            placeholder="Name"
                            name="name"
                            disabled={yes}
                        />
                    </div>
                    <div className="col-4">
                        <Text
                            defaultValue={registrationInfo.givenName}
                            onChange={(e) => setRegistrationInfo({
                                ...registrationInfo,
                                givenName: e.target.value,
                            })}
                            placeholder="Surname"
                            name="surname"
                            disabled={yes}
                        />
                    </div>
                    {
                        clicked && (!registrationInfo.givenName || !registrationInfo.firstName) &&
                        <Errors
                            theme={MarketplaceTheme}
                            style={{
                                marginBottom: 15,
                            }}
                        >
                            Insert you name and surname
                        </Errors>
                    }
                </div>

                <div className="row align-items-baseline my-4">
                    <div className="col-3">
                        <Translate
                            value="auth.registration.age"
                            className="text-right"
                            style={label}
                        />
                    </div>
                    <RadioButton
                        name2="over18"
                        id1="age"
                        setRegistrationInfo={setRegistrationInfo}
                        registrationInfo={registrationInfo}
                        className="mx-3 col-3"
                    />
                    {
                        clicked && registrationInfo.over18 === false &&
                        <Errors
                            theme={MarketplaceTheme}
                            style={{
                                marginBottom: 15,
                            }}
                        >
                            Select an option
                        </Errors>
                    }
                    {
                        clicked && registrationInfo.over18 === 'No' &&
                        <Errors
                            theme={MarketplaceTheme}
                            style={{
                                marginBottom: 15,
                            }}
                        >
                            You should be +18 to register
                        </Errors>
                    }
                </div>

                <div className="row align-items-center my-4">
                    <Translate
                        value="auth.registration.country"
                        className="col-3 text-right"
                        style={label}
                    />
                    <SelectFieldNarrow
                        name="countries"
                        options={countriesOptions}
                        // value={selectedCountry}
                        onChange={(option) => setRegistrationInfo({
                            ...registrationInfo,
                            countryOfResidence: option.label,
                        })}
                        isSearchable={false}
                        errorsTheme={MarketplaceTheme}
                        className="mx-3 col-4"
                    />
                    {
                        clicked && !registrationInfo.countryOfResidence &&
                        <Errors
                            theme={MarketplaceTheme}
                            style={{
                                marginBottom: 15,
                            }}
                        >
                            Select a country
                        </Errors>
                    }
                </div>

                <div className="row align-items-center my-4">
                    <Translate
                        value="auth.registration.email"
                        className="col-3 text-right"
                        style={label}
                    />
                    <div className="col-7 mx-3">
                        <Text
                            defaultValue={registrationInfo.email}
                            onChange={(e) => setRegistrationInfo({
                                ...registrationInfo,
                                email: e.target.value,
                            })}
                            placeholder="Email"
                            name="email"
                            disabled={yes}
                        />
                    </div>
                    {
                        clicked && !registrationInfo.email && registrationInfo.email !== undefined &&
                        // !registrationInfo.email && registrationInfo.email !== undefined &&
                        <Errors
                            theme={MarketplaceTheme}
                            style={{
                                marginTop: 0,
                                marginBottom: 15,
                            }}
                        >
                            Insert a valid email
                        </Errors>
                    }
                </div>

                <InstitutionalAffiliationModal show={showModal} handleClose={() => setShowModal(false)} />
                {/* <RegistrationModal show={showMsgModal} handleClose={handleCloseMsgModal} modalContent={modalContent} /> */}
                {
                    yes &&
                    <div>
                        <div className="row align-items-center my-4">
                            <Translate
                                value="auth.registration.institution"
                                className="col-3 text-right"
                                style={label}
                            />
                            <div className="col-7 mx-3">
                                <Text
                                    defaultValue={registrationInfo.institution}
                                    onChange={(e) => setRegistrationInfo({
                                        ...registrationInfo,
                                        institution: e.target.value,
                                    })}
                                    placeholder="Institution"
                                    name="institution"
                                    disabled={yes}
                                />
                            </div>
                            {
                                clicked && yes && !registrationInfo.institution &&
                                <Errors
                                    theme={MarketplaceTheme}
                                    style={{
                                        marginBottom: 15,
                                    }}
                                >
                                    Insert the institution name
                                </Errors>
                            }
                        </div>

                        <div className="row align-items-center my-4">
                            <Translate
                                value="auth.registration.typeOfInstitution"
                                className="col-3 text-right"
                                style={label}
                            />
                            <SelectFieldNarrow
                                name="typeOfInstitution"
                                options={typeOfInstitutionOptions}
                                // value={selectedCountry}
                                onChange={(option) => setRegistrationInfo({
                                    ...registrationInfo,
                                    typeOfInstitution: option.value,
                                })}
                                isSearchable={false}
                                errorsTheme={MarketplaceTheme}
                                className="mx-3"
                            />
                            {
                                clicked && yes && !registrationInfo.typeOfInstitution &&
                                <Errors
                                    theme={MarketplaceTheme}
                                    style={{
                                        marginBottom: 15,
                                    }}
                                >
                                    Select an option
                                </Errors>
                            }
                        </div>

                        <div className="row align-items-center my-4">
                            <Translate
                                value="auth.registration.legal"
                                className="col-3 text-right"
                                style={label}

                            />
                            <div className="col-4 mx-3">
                                <Text
                                    defaultValue={registrationInfo.legalName}
                                    onChange={(e) => setRegistrationInfo({
                                        ...registrationInfo,
                                        legalName: e.target.value,
                                    })}
                                    placeholder="Name"
                                    name="name"
                                />
                            </div>
                            <div className="col-4">
                                <Text
                                    defaultValue={registrationInfo.legalSurname}
                                    onChange={(e) => setRegistrationInfo({
                                        ...registrationInfo,
                                        legalSurname: e.target.value,
                                    })}
                                    placeholder="Surname"
                                    name="surname"
                                />
                            </div>
                            {
                                clicked && yes && (!registrationInfo.legalName || !registrationInfo.legalSurname) &&
                                <Errors
                                    theme={MarketplaceTheme}
                                    style={{
                                        marginBottom: 15,
                                    }}
                                >
                                    Insert name and surname
                                </Errors>
                            }
                        </div>
                        <div className="row align-items-center my-4">
                            <Translate
                                value="auth.registration.officer"
                                className="col-3 text-right"
                                style={label}
                            />
                            <div className="col-7 mx-3">
                                <Text
                                    defaultValue={registrationInfo.officerEmail}
                                    onChange={(e) => setRegistrationInfo({
                                        ...registrationInfo,
                                        officerEmail: e.target.value,
                                    })}
                                    placeholder="Email"
                                    name="email"
                                />
                            </div>
                            {
                                clicked && yes && !registrationInfo.officerEmail &&
                                <Errors
                                    theme={MarketplaceTheme}
                                    style={{
                                        marginBottom: 15,
                                    }}
                                >
                                    Insert an email
                                </Errors>
                            }
                        </div>

                        {/* FIAT PAYMENT BUTTON */}
                        <div className="row align-items-center my-4">
                            <Translate
                                value="Do you wish to receive payments for access to the data you share using fiat currencies?"
                                className="col-3 text-right"
                                style={label}
                            />
                            <RadioButton
                                name2="fiatPayment"
                                id1="fiatPayment"
                                setRegistrationInfo={setRegistrationInfo}
                                registrationInfo={registrationInfo}
                                className="col-4 mx-3"
                            />
                            {
                                clicked && yes && registrationInfo.fiatPayment === false &&
                                <Errors
                                    theme={MarketplaceTheme}
                                    style={{
                                        marginBottom: 15,
                                    }}
                                >
                                    Select an option
                                </Errors>
                            }
                        </div>

                        {
                            yes && fiat &&
                            (
                                <div>
                                    <div className="row align-items-center my-4">
                                        <Translate
                                            value="Name of organisation"
                                            className="col-3 text-right"
                                            style={label}
                                        />
                                        <div className="col-7 mx-3">
                                            <Text
                                                defaultValue={registrationInfo.invoicingName}
                                                onChange={(e) => setRegistrationInfo({
                                                    ...registrationInfo,
                                                    invoicingName: e.target.value,
                                                })}
                                                placeholder="Enter name"
                                                name="name"
                                            />
                                        </div>
                                        {
                                            clicked && yes && fiat && !registrationInfo.invoicingName &&
                                            <Errors
                                                theme={MarketplaceTheme}
                                                style={{
                                                    marginBottom: 15,
                                                }}
                                            >
                                                Insert a name
                                            </Errors>
                                        }
                                    </div>

                                    <div className="row align-items-center my-4">
                                        <Translate
                                            value="Street address"
                                            className="col-3 text-right"
                                            style={label}
                                        />
                                        <div className="col-7 mx-3">
                                            <Text
                                                defaultValue={registrationInfo.invoicingAddress}
                                                onChange={(e) => setRegistrationInfo({
                                                    ...registrationInfo,
                                                    invoicingAddress: e.target.value,
                                                })}
                                                placeholder="Enter address"
                                                name="name"
                                            />
                                        </div>
                                        {
                                            clicked && yes && fiat && !registrationInfo.invoicingAddress &&
                                            <Errors
                                                theme={MarketplaceTheme}
                                                style={{
                                                    marginBottom: 15,
                                                }}
                                            >
                                                Insert an address
                                            </Errors>
                                        }
                                    </div>

                                    <div className="row align-items-center my-4">
                                        <Translate
                                            value=""
                                            className="col-3 text-right"
                                            style={label}

                                        />
                                        <div className="col-4 mx-3">
                                            <Text
                                                defaultValue={registrationInfo.invoicingZipCode}
                                                onChange={(e) => setRegistrationInfo({
                                                    ...registrationInfo,
                                                    invoicingZipCode: e.target.value,
                                                })}
                                                placeholder="ZIP code"
                                                name="zipcode"
                                            />
                                        </div>
                                        <div className="col-4">
                                            <Text
                                                defaultValue={registrationInfo.invoicingCountry}
                                                onChange={(e) => setRegistrationInfo({
                                                    ...registrationInfo,
                                                    invoicingCountry: e.target.value,
                                                })}
                                                placeholder="Country"
                                                name="country"
                                            />
                                        </div>
                                        {
                                            clicked && yes && fiat && (!registrationInfo.invoicingZipCode || !registrationInfo.invoicingCountry) &&
                                            <Errors
                                                theme={MarketplaceTheme}
                                                style={{
                                                    marginBottom: 15,
                                                }}
                                            >
                                                Insert ZIP code and country
                                            </Errors>
                                        }
                                    </div>
                                    <div className="row align-items-center my-4">
                                        <Translate
                                            value="Payment instructions"
                                            className="col-3 text-right"
                                            style={label}

                                        />
                                        <div className="col-7 mx-3">
                                            <Text
                                                defaultValue={registrationInfo.paymentInstructions}
                                                onChange={(e) => setRegistrationInfo({
                                                    ...registrationInfo,
                                                    paymentInstructions: e.target.value,
                                                })}
                                                placeholder=""
                                                name="paymentinstructions"
                                                tag="textarea"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                }

                <div className="row align-items-center my-4">
                    <Translate
                        value="auth.registration.contact"
                        className="col-3 text-right"
                        style={label}
                    />
                    <RadioButton
                        name2="privatelyContacted"
                        id1="contactId"
                        setRegistrationInfo={setRegistrationInfo}
                        registrationInfo={registrationInfo}
                        className="col-5 mx-3"
                    />
                    {
                        clicked && registrationInfo.privatelyContacted === true &&
                        <Errors
                            theme={MarketplaceTheme}
                            style={{
                                marginBottom: 15,
                            }}
                        >
                            Select an option
                        </Errors>
                    }
                </div>
            </div>
            <hr className="my-5" />

            <div>
                <Translate
                    tag="h5"
                    value="auth.registration.disclaimerTitle"
                    className="mb-2"
                    style={title}
                />
                <Translate
                    value="auth.registration.disclaimer"
                    style={text}
                />
            </div>
            <br />

            <Container id="introductionEnquiry">
                <div>
                    <div className="d-flex align-intems-center">
                        <StyledCheckbox
                            id="privacyConsent"
                            name="privacyConsent"
                            value={registrationInfo.privacyConsent}
                            onChange={(e) => setRegistrationInfo({
                                ...registrationInfo,
                                privacyConsent: e.target.checked,
                            })}
                        />
                        <p style={consentStyle}>
                            I confirm that I have read and consent to KRAKEN's <LinkSpan onClick={() => setShowPrivacyModal(true)}>Privacy Policy</LinkSpan>
                        </p>
                    </div>
                    <PrivacyModal show={showPrivacyModal} handleClose={() => setShowPrivacyModal(false)} />
                    {
                        clicked && !registrationInfo.privacyConsent &&
                        <Errors
                            theme={MarketplaceTheme}
                            style={{
                                marginTop: 0,
                                marginBottom: 15,
                            }}
                        >
                            Please give your consent
                        </Errors>
                    }

                    <div className="d-flex align-intems-baseline">
                        <StyledCheckbox
                            id="privacyConsent"
                            name="privacyConsent"
                            value={registrationInfo.providerConsumerConsent}
                            onChange={(e) => setRegistrationInfo({
                                ...registrationInfo,
                                providerConsumerConsent: e.target.checked,
                            })}
                        />
                        <p style={consentStyle}>
                            I confirm that I have read and consent to KRAKEN's <LinkSpan onClick={() => setShowProviderConsumerModal(true)}>Data Provider and Data Consumer's agreement</LinkSpan>
                        </p>
                    </div>
                    <ProviderConsumerModal show={showProviderConsumerModal} handleClose={() => setShowProviderConsumerModal(false)} />
                    {
                        clicked && !registrationInfo.providerConsumerConsent &&
                        <Errors
                            theme={MarketplaceTheme}
                            style={{
                                marginTop: 0,
                                marginBottom: 15,
                            }}
                        >
                            Please give your consent
                        </Errors>
                    }

                </div>
            </Container>
            <PanelRow style={justifyCenter}>
                <Button onClick={validate}>
                    Next
                </Button>
            </PanelRow>
        </div>
    )
}

export default SSIRegistration
