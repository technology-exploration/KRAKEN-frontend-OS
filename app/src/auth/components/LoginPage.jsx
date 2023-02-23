import React, { useEffect, useState } from 'react'
import { I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import { get } from '$shared/utils/api'

import { userIsNotAuthenticated } from '$auth/utils/userAuthenticated'
import { SM } from '$shared/utils/styled'
import routes from '$routes'

import SessionProvider from './SessionProvider'
import AuthLayout from './AuthLayout'

const Panel = styled.div`
    background: #FFFFFF;
    border-radius: 4px;
`

const PanelRow = styled.div`
    height: 80px;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
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
    font-size: 18px;
`

const AuthPanel = styled.div`
    margin: 0 auto;
    max-width: 432px;
    width: 100%;

    ${Panel} {
        position: relative;
    }

    ${PanelRow} + ${PanelRow} {
        border-top: 1px solid #F2F1F1;
    }

    @media (max-width: ${SM}px) {
        max-width: 328px;
    }
`

const LoginPage = () => {
    const [didConnectionDetails, setdidConnectionDetails] = useState()
    const [didConnectionState, setdidConnectionState] = useState('not-requested')
    useEffect(() => {
        const requestDidConnection = async () => {
            const res = await get({
                url: routes.auth.external.didConnection(),
            })
            console.log(JSON.stringify(res))
            setdidConnectionDetails(JSON.stringify(res))
            setdidConnectionState('requested')
            const ws = new WebSocket(routes.auth.external.ssiWebsocket())
            ws.onopen = () => {
                ws.onmessage = (mes) => {
                    console.log(mes.data)
                    const message = JSON.parse(mes.data)
                    if (message.topic === 'did-connection' && message.content.status === 'completed') {
                        setdidConnectionState('completed')
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
        }
        requestDidConnection()
    }, [])
    return (
        <AuthLayout>
            <AuthPanel>
                <Panel>
                    <PanelRow>
                        <Header>{I18n.t('auth.didConnectionHeader')}</Header>
                    </PanelRow>
                    {!!(didConnectionState === 'requested') &&
                        <QRRow>
                            <QRCode
                                value={didConnectionDetails}
                                style={{
                                    width: 180, height: 180,
                                }}
                            />
                        </QRRow>
                    }
                    {!!(didConnectionState === 'completed') &&
                        <PanelRow>
                            <span>DID CONNECTION SUCCESSFUL</span>
                        </PanelRow>
                    }
                </Panel>
            </AuthPanel>
        </AuthLayout>
    )
}

export { LoginPage }

export default userIsNotAuthenticated((props) => (
    <SessionProvider>
        <LoginPage {...props} />
    </SessionProvider>
))
