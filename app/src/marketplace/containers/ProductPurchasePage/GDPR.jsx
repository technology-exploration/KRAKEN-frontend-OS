// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'

const Container = styled.section`
    margin-top:2.5rem;
    background-color: #EFEFEF;
    padding: 2.5rem;
    border-radius: 7px;
    border-width: 2px;
    border-color: #DEDEDE;
    border-style: solid;
`

const Introduction = () => (
    <Container id="introductionEnquiry">
        <div>
            <Translate value="Obligations under GDPR" tag="h3" />
            Please be aware that by receiving and processing personal data you are considered a data controller under
            the General Data Protection Regulation and are consequently subject to its obligations. In particular, this
            include that data subjects have the right to request from you the exercise of the data subject rights provided
            by the General Data Protection Regulation, which includes: access to and rectification or erasure of their personal
            data, the restriction of or objection to the processing of their personal data, as well as the right to data portability.
            Data subjects also have the right to withdraw their consent at any time. For more information on the rights of data subjects
            please consult KRAKEN&apos;s Privacy Policy.
        </div>
    </Container>
)

export default Introduction
