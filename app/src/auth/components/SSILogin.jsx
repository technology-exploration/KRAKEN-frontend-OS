/* eslint-disable max-len */
import React from 'react'
import { I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import Spinner from '$shared/components/Spinner'
import SSIRegistration from './SSIRegistration'

const Panel = styled.div`
    background: #FFFFFF;
    border-radius: 4px;
    padding: 10px;
    `

const QRRow = styled.div`
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`
const Container = styled.div`
    padding: 40px 40px 33px 40px;
    border: 1px solid #efefef;
    border-radius: 15px;
    box-shadow: 2px 2px 20px #efefef;
`
const PanelRow = styled.div`
    height: 80px;
    user-select: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
`

const Header = styled.span`
    font-size: 18px;
`

const SSILogin = ({
    didConnectionState,
    didConnectionDetails,
    issueCredentialState,
    registrationInfo,
    setRegistrationInfo,
    register,
    requestProof,
    showApproval,
    modalContent,
    setModalContent,
    showMsgModal,
    setShowMsgModal,
}) => (
    <Panel>
        {!!(didConnectionState === 'requested') &&
            <div>
                <PanelRow>
                    <Header>{I18n.t('auth.didConnectionHeader')}</Header>
                </PanelRow>
                <QRRow>
                    <Container>
                        <QRCode
                            value={didConnectionDetails}
                            style={{
                                width: 180, height: 180,
                            }}
                        />
                    </Container>
                </QRRow>
            </div>
        }
        {!!(didConnectionState === 'completed' && issueCredentialState === 'not-requested') &&
            <SSIRegistration
                registrationInfo={registrationInfo}
                setRegistrationInfo={setRegistrationInfo}
                register={register}
                didConnectionDetails={didConnectionDetails}
                requestProof={requestProof}
                showApproval={showApproval}
                modalContent={modalContent}
                setModalContent={setModalContent}
                showMsgModal={showMsgModal}
                setShowMsgModal={setShowMsgModal}
            />
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
)

export default SSILogin
