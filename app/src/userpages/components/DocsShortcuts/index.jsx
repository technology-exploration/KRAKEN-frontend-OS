// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import Link from '$shared/components/Link'
import Onboarding from '$shared/components/Onboarding'
import routes from '$routes'
import docsLinks from '$shared/../docsLinks'

const DocsShortcuts = () => (
    <Onboarding title="Docs">
        <Link to={docsLinks.gettingStarted} target="_blank" rel="noopener noreferrer">
            <Translate value="general.gettingStarted" />
        </Link>
        <Link to={docsLinks.streams} target="_blank" rel="noopener noreferrer">
            <Translate value="general.streams" />
        </Link>
        <Link to={docsLinks.canvases} target="_blank" rel="noopener noreferrer">
            <Translate value="general.canvases" />
        </Link>
        <Link to={docsLinks.dashboards} target="_blank" rel="noopener noreferrer">
            <Translate value="general.dashboards" />
        </Link>
        <Link to={docsLinks.products} target="_blank" rel="noopener noreferrer">
            <Translate value="general.products" />
        </Link>
        <Link to={docsLinks.dataUnions} target="_blank" rel="noopener noreferrer">
            <Translate value="general.dataUnions" />
        </Link>
        {null}
        <Link href={routes.community.discord()} target="_blank" rel="noopener noreferrer">
            Discord
        </Link>
        <Link href={routes.giveFeedback()} target="_blank" rel="noopener noreferrer">
            <Translate value="general.giveFeedback" />
        </Link>
    </Onboarding>
)

export default DocsShortcuts
