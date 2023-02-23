/* eslint-disable max-len */
import React, { useState } from 'react'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import {
    Footer as LayoutFooter,
    FooterColumn,
    FooterColumns as UnstyledFooterColumns,
} from '@streamr/streamr-layout'
import PrivacyModal from '$auth/components/PrivacyModal'
import ProviderConsumerModal from '$auth/components/ProviderConsumerModal'
import LinkedinIcon from './linkedin.svg'
import TwitterIcon from './twitter.svg'
import EuFlag from './euFlag.svg'

const LayoutFooterStyled = styled(LayoutFooter)`
    width: 100vw;
    // margin-right: 5rem;
    // margin-left: 5rem;
    border-left: 1rem solid var(--blue);
`

const FooterColumnWidth = styled(FooterColumn)`
    width: 15rem;
    li:first-child {
        color: var(--blue);
        font-weight: 400;
    }
`

const EuImg = styled.img`
    width: 5rem;
`

const EuDisclaimer = styled.p`
    font-size: 12px;
    line-height: 1.5;
    margin-top: 1rem;
`

const FooterColumns = styled(UnstyledFooterColumns)`
    border-top: ${({ separate }) => (separate ? '1px' : '0')} solid #d8d8d8;
`

const Footer = ({ topBorder = false }) => {
    const [privacyModal, setPrivacyModal] = useState(false)
    const [agreementModal, setAgreementModal] = useState(false)

    const openPrivacyModal = (e) => {
        e.preventDefault()
        setPrivacyModal(true)
    }
    const openAgreementModal = (e) => {
        e.preventDefault()
        setAgreementModal(true)
    }

    return (
        <LayoutFooterStyled>
            <FooterColumns separate={topBorder}>
                <FooterColumnWidth title={I18n.t('general.kraken')}>
                    <span>Brokerage and market platform for personal data</span>
                    <br />
                </FooterColumnWidth>
                <FooterColumnWidth title={I18n.t('general.contact')}>
                    <div>
                        <a href="https://www.linkedin.com/company/atarca-eu/"><img src={LinkedinIcon} alt="" />&nbsp;&nbsp;&nbsp;</a>
                        <a href="https://twitter.com/ATARCA_EU"><img src={TwitterIcon} alt="" /></a>
                    </div>
                    <a href="https://krakenh2020.eu/">
                        https://krakenh2020.eu/
                    </a>
                    <br />
                </FooterColumnWidth>
                <FooterColumnWidth title={I18n.t('general.legal')}>
                    <a href="" onClick={(e) => openPrivacyModal(e)}>
                        <Translate value="general.privacy" />
                    </a>
                    <PrivacyModal show={privacyModal} handleClose={() => setPrivacyModal(false)} />
                    <a href="" onClick={(e) => openAgreementModal(e)}>
                        <Translate value="Provider/Consumer Agreement" />
                    </a>
                    <ProviderConsumerModal show={agreementModal} handleClose={() => setAgreementModal(false)} />
                </FooterColumnWidth>
                <FooterColumnWidth>
                    <div>
                        <EuImg src={EuFlag} alt="" />
                    </div>
                    <span>
                        <EuDisclaimer>
                            This project has received funding from the European Union`s Horizon 2020 Research and Innovation Programme under Grant Agreement N 871473. Any dissemination of resulst here presented reflects only the consortium view.
                        </EuDisclaimer>
                    </span>
                </FooterColumnWidth>
            </FooterColumns>
        </LayoutFooterStyled>
    )
}

export default Footer
