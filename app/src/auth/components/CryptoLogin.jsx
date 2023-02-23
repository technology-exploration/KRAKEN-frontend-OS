import React from 'react'
import { I18n, Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import UnstyledLoadingIndicator from '$shared/components/LoadingIndicator'
import Button from '$shared/components/Button'
import { SM } from '$shared/utils/styled'

import SignInMethod from './SignInMethod'

const Panel = styled.div`
    background: #FFFFFF;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.05);
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

const Header = styled.span`
    font-size: 18px;
`

const LoadingIndicator = styled(UnstyledLoadingIndicator)`
    position: absolute;
    top: 81px;
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

const Footer = styled.div`
    font-size: 14px;
    flex-grow: 1;
    margin-left: 32px;
    margin-right: 16px;

    button {
        float: right;
    }
`

const CryptoLogin = ({
    connect, cancel, method, connecting, error, methods,
}) => {
    const allDisabled = !!(connecting)

    return (
        <AuthPanel>
            <Panel>
                <LoadingIndicator loading={connecting} />
                <PanelRow>
                    <Header>{I18n.t('auth.connectWallet')}</Header>
                </PanelRow>
                {methods.map(({ id, image, image2x, enabled }) => {
                    const title = I18n.t(`auth.loginMethod.${id}`)

                    return (
                        <PanelRow key={id}>
                            <SignInMethod
                                disabled={allDisabled || !enabled}
                                onClick={() => connect(id)}
                                data-active-method={method === id && !!connecting}
                                theme={!!error && !connecting && method === id && SignInMethod.themes.Error}
                            >
                                <SignInMethod.Title>
                                    {method === id && !!connecting && I18n.t('auth.connecting')}
                                    {!!error && method === id && !connecting && I18n.t('auth.couldNotConnect', {
                                        method: title,
                                    })}
                                    {(method !== id || (!connecting && !error)) && title}
                                </SignInMethod.Title>
                                <SignInMethod.Icon>
                                    <img
                                        src={image}
                                        srcSet={`${image2x} 2x`}
                                        alt={title}
                                    />
                                </SignInMethod.Icon>
                            </SignInMethod>
                        </PanelRow>
                    )
                })}
                <PanelRow>
                    <Footer>
                        {!error && !connecting && (
                            <Translate
                                value="auth.help.wallet"
                                dangerousHTML
                            />
                        )}
                        {!!connecting && (
                            <Button
                                kind="link"
                                size="mini"
                                onClick={() => cancel()}
                            >
                                {I18n.t('auth.cancel')}
                            </Button>
                        )}
                        {!!error && !connecting && (
                            <Button
                                kind="secondary"
                                size="mini"
                                onClick={() => connect(method)}
                                disabled={allDisabled}
                                waiting={connecting}
                            >
                                {I18n.t('auth.tryAgain')}
                            </Button>
                        )}
                    </Footer>
                </PanelRow>
            </Panel>
        </AuthPanel>
    )
}

export default CryptoLogin
