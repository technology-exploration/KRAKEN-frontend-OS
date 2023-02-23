/* eslint-disable max-len */
import React from 'react'
import { Translate } from 'react-redux-i18n'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Button from '$shared/components/Button'

const Section = styled.section`
margin-top: 100px;
background-color: transparent;
`

const PrivacyMetricsSection = ({ disabled }) => (
    <Section id="privacyMetricsTool">
        <Translate
            tag="h1"
            value="Privacy metrics tool"
        />
        <Translate
            tag="p"
            value="If you're concerned about your privacy exposure when publishing your personal data you can use our assessment tool to understand your level of privacy by clicking the button below:"
            dangerousHTML
        />
        <Button
            kind="primary"
            size="mini"
            outline
            disabled={disabled || null}
        >
            <Link to="/setup" target="_blank"> Check my privacy rating </Link>
        </Button>
    </Section>
)

export default PrivacyMetricsSection
