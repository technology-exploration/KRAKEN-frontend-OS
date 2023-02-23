/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState, useMemo, useContext } from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { replace } from 'connected-react-router'
import QRCode from 'qrcode.react'
import { get, post } from '$shared/utils/api'
import { getUserData } from '$shared/modules/user/actions'

import { MarketplaceTheme } from '$ui/Errors'
import SelectField from '$mp/components/SelectField'
import Spinner from '$shared/components/Spinner'
import Text from '$ui/Text'
import Segment from '$shared/components/Segment'
import { SM, MD, XL } from '$shared/utils/styled'
import Button from '$shared/components/Button'
import Layout from '$shared/components/Layout'
import Checkbox from '$shared/components/Checkbox'
import routes from '$routes'

import SessionContext from '../contexts/Session'
import SessionProvider from './SessionProvider'

const theme = {
    navShadow: true,
}

const SelectFieldNarrow = styled(SelectField)`
    width: 13rem;
`

const Panel = styled.div`
    background: #FFFFFF;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    padding: 3rem;
    width: 100%;
`

const displayInline = {
    display: 'inline-flex',
}

const StyledCheckbox = styled(Checkbox)`
    width: 24px !important;
    height: 24px !important;
`

const padding = {
    padding: '30px',
}

const margin = {
    'margin-top': '2rem',
    'margin-bottom': '5rem',
}

const Container = styled.section`
    padding: 1rem;
    margin-top:3.5rem;
    background-color: #f8f8f8;
    border-style: solid;
    border-color: #e3e3e3;
`

const PanelRow = styled.div`
    height: 80px;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
`

const justifyCenter = {
    'justify-content': 'center',
}

const Title = styled.div`
    height: 80px;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: start;
    margin-top: 2rem;
`

const StyledText = styled(Text)`
    width: 100%;
`

const QRRow = styled.div`
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 10px;
`

const Header = styled.span`
    font-size: 20px;
    font-weight: 600;
`

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    padding: 10px;
    grid-column-gap: 70px;
`

const ProductPage = styled.div`
    color: #323232;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 60%;

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
const RadioButton = ({ name2, id1, setregistrationInfo, registrationInfo }) => (
    <div id={id1} style={displayInline}>
        <div style={padding}>
            <label>
                <input
                    id="yes"
                    type="radio"
                    name={name2}
                    value="Yes"
                    onChange={(e) => setregistrationInfo({
                        ...registrationInfo,
                        [name2]: e.target.value,
                    })
                    }
                    defaultChecked
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
                        setregistrationInfo({
                            ...registrationInfo,
                            [name2]: !e.target.value,
                        })
                    }}
                    value="No"
                />
                No
            </label>
        </div>
    </div>
)

const SignupPage = () => {
    const dispatch = useDispatch()

    const id = 'age'
    const name1 = 'ageRadioButton'
    const institutionalId = 'institutionalId'
    const institutionalName = 'institutionalAffiliation'
    const privatelyContacted = 'privatelyContacted'
    const contactId = 'contactId'
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
    ]
    const typeOfInstitutionOptions = useMemo(() => (institutions || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [institutions])
    // const selectedCountry = useMemo(() => (
    //     countriesOptions.find((o) => o.label === productSector)
    // ), [sectorOptions, productSector])
    const [registrationInfo, setregistrationInfo] = useState({
        firstName: undefined,
        secondName: undefined,
        email: undefined,
        countryOfResidence: undefined,
        over18: false,
        institutionalAffiliation: false,
        privatelyContacted: true,
        institution: undefined,
        typeOfInstitution: undefined,
        legalSurname: undefined,
        legalName: undefined,
        officerEmail: undefined,
        privacyConsent: undefined,
    })
    const [didConnectionDetails, setdidConnectionDetails] = useState()
    const [didConnectionState, setdidConnectionState] = useState('not-requested')
    const [issueCredentialState, setissueCredentialState] = useState('not-requested')
    const [showApproval, setshowApproval] = useState(false)
    const { setSessionToken } = useContext(SessionContext)

    if (issueCredentialState === 'completed') {
        setTimeout(() => {
            dispatch(replace(routes.auth.login()))
        }, 2000)
    }
    useEffect(() => {
        const requestDidConnection = async () => {
            const res = await get({
                url: routes.auth.external.didConnection(),
            })
            setdidConnectionDetails(JSON.stringify(res))
            setdidConnectionState('requested')
            const ws = new WebSocket(routes.auth.external.ssiWebsocket())
            ws.onopen = () => {
                ws.onmessage = (mes) => {
                    console.log(mes.data)
                    const message = JSON.parse(mes.data)
                    if (message.topic === 'did-connection') {
                        if (message.content.status === 'completed') {
                            setdidConnectionState('completed')
                        } else if (message.content.status === 'token-generated') {
                            console.log('token received: ', message.content.token)
                            setSessionToken({
                                krakenToken: message.content.token,
                            })
                            dispatch(getUserData())
                        }
                    } else if (message.topic === 'request-proof' && message.content.status === 'pending') {
                        console.log('request proofi signup pageshi movida')
                        console.log(atob(message.content.data).credentialSubject)
                        setregistrationInfo(atob(message.content.data).credentialSubject)
                        setshowApproval(true)
                    }
                    if (message.topic === 'issue-credential' && message.content.status === 'completed') {
                        setissueCredentialState('completed')
                    }
                }
            }
            ws.onclose = () => {
                console.log('closed in signuppage')
            }
            const message = JSON.stringify({
                topic: 'did-connection-subscription',
                content: {
                    id: res.invitation['@id'],
                },
            })
            console.log('ws connection performed, sending: ', message)
            ws.send(message)
        }
        requestDidConnection()
    }, [dispatch, setSessionToken])

    const register = () => {
        setshowApproval(false)
        console.log(JSON.parse(didConnectionDetails))
        post({
            url: routes.auth.external.signup(),
            data: {
                invitationID: JSON.parse(didConnectionDetails).invitation['@id'],
                registrationInfo,
            },
        })
        setissueCredentialState('requested')
    }

    return (
        <Layout theme={theme}>
            <ProductPage>
                <Panel>
                    {!!(didConnectionState === 'requested') &&
                        <div>
                            <PanelRow>
                                <Header>{I18n.t('auth.didConnectionHeader')}</Header>
                            </PanelRow>
                            <QRRow>
                                <QRCode
                                    value={didConnectionDetails}
                                    style={{
                                        width: 180, height: 180,
                                    }}
                                />
                            </QRRow>
                        </div>
                    }
                    {!!(showApproval) &&
                        <div>
                            <Button onClick={register} >
                                Accept
                            </Button>
                        </div>
                    }
                    {!!(didConnectionState === 'completed' && issueCredentialState === 'not-requested') &&
                    <div>
                        <PanelRow>
                            <Header>{I18n.t('auth.registrationHeader')}</Header>
                        </PanelRow>
                        <Grid>
                            <PanelRow>
                                <Translate
                                    value="auth.registration.name"
                                />
                            </PanelRow>
                            <PanelRow>
                                <StyledText
                                    defaultValue={registrationInfo.name}
                                    onChange={(e) => setregistrationInfo({
                                        ...registrationInfo,
                                        firstName: e.target.value,
                                    })}
                                    placeholder="Name"
                                    name="name"
                                />
                            </PanelRow>
                            <PanelRow>
                                <StyledText
                                    defaultValue={registrationInfo.surname}
                                    onChange={(e) => setregistrationInfo({
                                        ...registrationInfo,
                                        secondName: e.target.value,
                                    })}
                                    placeholder="Surname"
                                    name="surname"
                                />
                            </PanelRow>
                            <PanelRow>
                                <Translate
                                    value="auth.registration.age"
                                />
                            </PanelRow>
                            <PanelRow>
                                <RadioButton name2={name1} id1="age" setregistrationInfo={setregistrationInfo} registrationInfo={registrationInfo} />
                            </PanelRow>
                            <span />
                            <PanelRow>
                                <Translate
                                    value="auth.registration.country"
                                />
                            </PanelRow>
                            <PanelRow>
                                <SelectFieldNarrow
                                    name="countries"
                                    options={countriesOptions}
                                    // value={selectedCountry}
                                    onChange={(option) => setregistrationInfo({
                                        ...registrationInfo,
                                        countryOfResidence: option.label,
                                    })}
                                    isSearchable={false}
                                    // disabled={!!disabled}
                                    errorsTheme={MarketplaceTheme}
                                />
                            </PanelRow>
                            <span />
                            <PanelRow>
                                <Translate
                                    value="auth.registration.email"
                                />
                            </PanelRow>
                            <PanelRow>
                                <StyledText
                                    defaultValue={registrationInfo.email}
                                    onChange={(e) => setregistrationInfo({
                                        ...registrationInfo,
                                        email: e.target.value,
                                    })}
                                    placeholder="Email"
                                    name="email"
                                />
                            </PanelRow>
                            <span />
                            <PanelRow>
                                <Translate
                                    value="auth.registration.sharing"
                                />
                            </PanelRow>
                            <PanelRow>
                                <RadioButton
                                    name2={institutionalName}
                                    id1={institutionalId}
                                    setregistrationInfo={setregistrationInfo}
                                    registrationInfo={registrationInfo}
                                />
                            </PanelRow>
                            <span />
                            <PanelRow>
                                <Translate
                                    value="auth.registration.institution"
                                />
                            </PanelRow>
                            <PanelRow>
                                <StyledText
                                    defaultValue={registrationInfo.institution}
                                    onChange={(e) => setregistrationInfo({
                                        ...registrationInfo,
                                        institution: e.target.value,
                                    })}
                                    placeholder="Institution"
                                    name="institution"
                                />
                            </PanelRow>
                            <span />
                            <PanelRow>
                                <Translate
                                    value="auth.registration.typeOfInstitution"
                                />
                            </PanelRow>
                            <PanelRow>
                                <SelectFieldNarrow
                                    name="typeOfInstitution"
                                    options={typeOfInstitutionOptions}
                                    // value={selectedCountry}
                                    onChange={(option) => setregistrationInfo({
                                        ...registrationInfo,
                                        typeOfInstitution: option.value,
                                    })}
                                    isSearchable={false}
                                    // disabled={!!disabled}
                                    errorsTheme={MarketplaceTheme}
                                />
                            </PanelRow>
                            <span />
                            <PanelRow>
                                <Translate
                                    value="auth.registration.legal"
                                />
                            </PanelRow>
                            <PanelRow>
                                <StyledText
                                    defaultValue={registrationInfo.legalName}
                                    onChange={(e) => setregistrationInfo({
                                        ...registrationInfo,
                                        legalName: e.target.value,
                                    })}
                                    placeholder="Name"
                                    name="name"
                                />
                            </PanelRow>
                            <PanelRow>
                                <StyledText
                                    defaultValue={registrationInfo.surname}
                                    onChange={(e) => setregistrationInfo({
                                        ...registrationInfo,
                                        legalSurname: e.target.value,
                                    })}
                                    placeholder="Surname"
                                    name="surname"
                                />
                            </PanelRow>
                            <PanelRow>
                                <Translate
                                    value="auth.registration.officer"
                                />
                            </PanelRow>
                            <PanelRow>
                                <StyledText
                                    defaultValue={registrationInfo.officerEmail}
                                    onChange={(e) => setregistrationInfo({
                                        ...registrationInfo,
                                        officerEmail: e.target.value,
                                    })}
                                    placeholder="Email"
                                    name="email"
                                />
                            </PanelRow>
                            <span />
                            <PanelRow>
                                <Translate
                                    value="auth.registration.contact"
                                />
                            </PanelRow>
                            <PanelRow>
                                <RadioButton
                                    name2={privatelyContacted}
                                    id1={contactId}
                                    setregistrationInfo={setregistrationInfo}
                                    registrationInfo={registrationInfo}
                                />
                            </PanelRow>
                        </Grid>
                        <hr />
                        <Title>
                            <Translate
                                tag="h5"
                                value="auth.registration.disclaimerTitle"
                            />
                        </Title>
                        <PanelRow>
                            <Translate
                                value="auth.registration.disclaimer"
                            />
                        </PanelRow>
                        <br />
                        <Title>
                            <Translate
                                tag="h5"
                                value="auth.registration.disclaimerTitleRights"
                            />
                        </Title>
                        <PanelRow style={margin}>
                            <Translate
                                value="auth.registration.disclaimerRights"
                            />
                        </PanelRow>
                        <Container id="introductionEnquiry">
                            <div>
                                <StyledCheckbox
                                    id="consent"
                                    name="consentName"
                                    value={registrationInfo.consent}
                                    onChange={(e) => setregistrationInfo({
                                        ...registrationInfo,
                                        consent: e.target.checked,
                                    })}
                                    // disabled={disabled}
                                />
                                <Translate value="auth.registration.consent" />
                                <br />
                                <StyledCheckbox
                                    id="privacyConsent"
                                    name="privacyConsent"
                                    value={registrationInfo.privacyConsent}
                                    onChange={(e) => setregistrationInfo({
                                        ...registrationInfo,
                                        privacyConsent: e.target.checked,
                                    })}
                                    // disabled={disabled}
                                />
                                <Translate value="auth.registration.consentPrivacy" />
                            </div>
                        </Container>
                        <PanelRow style={justifyCenter}>
                            <Button onClick={register} disabled={!(registrationInfo.privacyConsent && registrationInfo.consent)}>
                                Next
                            </Button>
                        </PanelRow>
                    </div>
                    }
                    {!!(didConnectionState === 'completed' && issueCredentialState === 'requested') &&
                        <div>
                            <PanelRow>
                                <Header>{I18n.t('auth.registrationPending')}</Header>
                            </PanelRow>
                            <PanelRow>
                                <Spinner size="large" />
                            </PanelRow>
                        </div>
                    }
                    {!!(didConnectionState === 'completed' && issueCredentialState === 'completed') &&
                        <PanelRow>
                            <Header>{I18n.t('auth.registration.completed')}</Header>
                        </PanelRow>
                    }
                </Panel>
            </ProductPage>
        </Layout>
    )
}

export { SignupPage }

export default (props) => (
    <SessionProvider>
        <SignupPage {...props} />
    </SessionProvider>
)
