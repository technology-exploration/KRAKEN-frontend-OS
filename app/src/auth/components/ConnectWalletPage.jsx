/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useCallback, useReducer, useContext, useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { get, post } from '$shared/utils/api'
import Segment from '$shared/components/Segment'
import { SM, MD, XL } from '$shared/utils/styled'

import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import { getUserData } from '$shared/modules/user/actions'
import useIsMounted from '$shared/hooks/useIsMounted'
import Layout from '$shared/components/Layout'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

import routes from '$routes'

import useMetamask from '../hooks/useMetamask'
import useWalletConnect from '../hooks/useWalletConnect'
import SessionContext from '../contexts/Session'
import metamaskLogo from '../assets/Metamask.png'
import metamaskLogo2x from '../assets/Metamask@2x.png'
import walletConnectLogo from '../assets/WalletConnect.png'
import walletConnectLogo2x from '../assets/WalletConnect@2x.png'

import SessionProvider from './SessionProvider'
import CryptoLogin from './CryptoLogin'
import SSILogin from './SSILogin'

const METAMASK = 'metamask'
const WALLET_CONNECT = 'walletConnect'

const theme = {
    navShadow: true,
}

const ProductPage = styled.div`
    color: #323232;
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 75%;

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

const handlers = {
    start: (state, { method }) => ({
        ...state,
        method,
        connecting: true,
        error: undefined,
    }),

    success: (state) => ({
        ...state,
        connecting: false,
    }),

    error: (state, { error }) => ({
        ...state,
        connecting: false,
        error,
    }),
}

const methods = [{
    id: METAMASK,
    image: metamaskLogo,
    image2x: metamaskLogo2x,
    enabled: true,
}, {
    id: WALLET_CONNECT,
    image: walletConnectLogo,
    image2x: walletConnectLogo2x,
    enabled: true,
}]

const LoginPage = () => {
    const dispatch = useDispatch()
    const [{ method, connecting, error }, setState] = useReducer((state, action) => (
        (typeof handlers[action.type] === 'function') ? handlers[action.type](state, action) : state
    ), {
        method: undefined,
        connecting: false,
        error: undefined,
    })
    const isMounted = useIsMounted()

    const connectMethods = {
        [METAMASK]: useMetamask(),
        [WALLET_CONNECT]: useWalletConnect(),
    }

    const { setSessionToken } = useContext(SessionContext)
    const cancelPromiseRef = useRef(undefined)

    const cancel = useCallback(() => {
        if (cancelPromiseRef.current) {
            cancelPromiseRef.current.reject(new Error('User cancelled action'))
        }
    }, [])

    const connect = useCallback(async (nextMethod) => {
        setState({
            type: 'start',
            method: nextMethod,
        })

        try {
            const cancelPromise = new Promise((resolve, reject) => {
                cancelPromiseRef.current = {
                    resolve,
                    reject,
                }
            })

            const fallbackGetter = async () => {
                throw new Error('Unknow method')
            }

            const token = await Promise.race([
                (connectMethods[nextMethod] || fallbackGetter)(),
                cancelPromise,
            ])

            if (!isMounted()) { return }

            cancelPromiseRef.current = undefined

            if (token) {
                setSessionToken({
                    token,
                    method: nextMethod,
                })

                // This will redirect the user from the login page if successful
                const user = await dispatch(getUserData())

                if (!user && isMounted()) {
                    throw new Error('No user data')
                }
            } else {
                throw new Error('No token')
            }
        } catch (e) {
            console.warn(e)

            if (!isMounted()) { return }

            setState({
                type: 'error',
                error: e && e.message,
            })
        }
    }, [
        connectMethods,
        setSessionToken,
        dispatch,
        isMounted,
    ])

    const [registrationInfo, setRegistrationInfo] = useState({
        firstName: undefined,
        givenName: undefined,
        email: undefined,
        countryOfResidence: undefined,
        over18: false,
        institutionalAffiliation: false,
        privatelyContacted: false,
        institution: undefined,
        typeOfInstitution: undefined,
        legalSurname: undefined,
        legalName: undefined,
        officerEmail: undefined,
        fiatPayment: false,
        invoicingName: undefined,
        invoicingAddress: undefined,
        invoicingZipCode: undefined,
        invoicingCountry: undefined,
        paymentInstructions: undefined,
        privacyConsent: undefined,
        providerConsumerConsent: undefined,
    })
    const [didConnectionDetails, setDidConnectionDetails] = useState()
    const [didConnectionState, setDidConnectionState] = useState('not-requested')
    const [issueCredentialState, setIssueCredentialState] = useState('not-requested')
    const [showApproval, setshowApproval] = useState(false)
    const [modalContent, setModalContent] = useState('')
    const [showMsgModal, setShowMsgModal] = useState(false)

    useEffect(() => {
        const requestDidConnection = async () => {
            const res = await get({
                url: routes.auth.external.didConnection(),
            })
            console.log(JSON.stringify(res))
            setDidConnectionDetails(JSON.stringify(res))
            setDidConnectionState('requested')

            const ws = new WebSocket(routes.auth.external.ssiWebsocket())
            ws.onopen = () => {
                ws.onmessage = (mes) => {
                    const message = JSON.parse(mes.data)
                    console.log('received ws message: ', message)
                    if (message.topic === 'did-connection') {
                        if (message.content.status === 'completed') {
                            setDidConnectionState('completed')
                        } else if (message.content.status === 'token-generated') {
                            console.log('token received: ', message.content.token)
                            setSessionToken({
                                krakenToken: message.content.token,
                            })
                            setDidConnectionState('logged-in')
                        }
                    } else if (message.topic === 'request-proof' && message.content.status === 'pending') {
                        const credentialInfo = JSON.parse(atob(message.content.data)).verifiableCredential[0].credentialSubject
                        setRegistrationInfo({
                            ...registrationInfo,
                            givenName: credentialInfo.employeeFamilyName,
                            firstName: credentialInfo.employeeName,
                            institution: credentialInfo.company,
                            institutionalAffiliation: 'Yes',
                            email: credentialInfo.employeeEmail,
                        })
                        setshowApproval(true)
                    } else if (message.topic === 'request-proof' && message.content.status === 'CompanyDidNotActive') {
                        // setShowMsgModal(true)
                        // setModalContent('Marketplace registration denied. The company is no longer an active participant in the marketplace')
                        Notification.push({
                            title: 'Marketplace registration denied. The company is no longer an active participant in the marketplace',
                            icon: NotificationIcon.ERROR,
                        })

                        setTimeout(() => { setIssueCredentialState('not-completed') }, 2000)
                        setTimeout(() => { window.location.href = routes.auth.login() }, 3000)
                    } else if (message.topic === 'request-proof' && message.content.status === 'CredentialIdNotActive') {
                        // setShowMsgModal(true)
                        // setModalContent('Marketplace registration denied. Your credential has been revoked.')
                        Notification.push({
                            title: 'Marketplace registration denied. Your credential has been revoked.',
                            icon: NotificationIcon.ERROR,
                        })

                        setTimeout(() => { setIssueCredentialState('not-completed') }, 2000)
                        setTimeout(() => { window.location.href = routes.auth.login() }, 3000)
                    }

                    if (message.topic === 'issue-credential' && message.content.status === 'completed') {
                        setIssueCredentialState('completed')
                        setTimeout(() => { window.location.href = routes.auth.login() }, 3000)
                    }
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
            ws.onclose = () => {
                console.log('closed in connectwalletpage')
            }
        }
        requestDidConnection()
    }, [setSessionToken])

    useEffect(() => {
        console.log('issue credential state ', issueCredentialState)
    }, [issueCredentialState])

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
        setIssueCredentialState('requested')
        console.log('register function')
    }

    const requestProof = () => {
        console.log(JSON.parse(didConnectionDetails))
        post({
            url: routes.auth.external.proof(),
            data: {
                invitationID: JSON.parse(didConnectionDetails).invitation['@id'],
            },
        })
    }

    return (
        <Layout theme={theme}>
            <ProductPage>
                {!(didConnectionState === 'logged-in') &&
                    <SSILogin
                        didConnectionState={didConnectionState}
                        didConnectionDetails={didConnectionDetails}
                        issueCredentialState={issueCredentialState}
                        registrationInfo={registrationInfo}
                        setRegistrationInfo={setRegistrationInfo}
                        register={register}
                        requestProof={requestProof}
                        showApproval={showApproval}
                        modalContent={modalContent}
                        setModalContent={setModalContent}
                        showMsgModal={showMsgModal}
                        setShowMsgModal={setShowMsgModal}
                    />
                }
                {!!(didConnectionState === 'logged-in') &&
                    <CryptoLogin connect={connect} cancel={cancel} method={method} connecting={connecting} error={error} methods={methods} />
                }
            </ProductPage>
        </Layout>
    )
}

export { LoginPage }

export default userIsNotAuthenticated((props) => (
    <SessionProvider>
        <LoginPage {...props} />
    </SessionProvider>
))
