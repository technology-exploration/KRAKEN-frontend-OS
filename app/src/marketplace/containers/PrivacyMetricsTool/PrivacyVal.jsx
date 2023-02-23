/* eslint-disable max-len */
// @flow

import React, { useEffect } from 'react'
import { Paper, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import ProgressBar from './ProgressBar'
import calculatePrivacyMetric from './UserPrivacyService'

const Container = styled.section`
margin: 0 50px
`

/**
 * Display bar with privacy score
 */
const PrivacyVal = () => {
    const paperStyle = {
        padding: '50px 20px', width: 600, margin: '20px auto',
    }
    const history = useHistory()

    const input = history.location.state
    // console.log('input', input)
    const privacy = calculatePrivacyMetric(input)

    const handleClickAdversary = (e) => {
        e.preventDefault()
        history.push('/setup')
    }

    useEffect(() => {

    }, [privacy])

    return (
        <Layout>
            <MarketplaceHelmet />
            <Container>
                <Paper elevation={3} style={paperStyle}>
                    <div>
                        <h1 className="text-center">Current Privacy Value</h1>
                        <ProgressBar key={privacy && privacy.id} bgcolor={privacy && privacy.bgcolor} completed={privacy && privacy.completed} text={privacy && privacy.text} />
                    </div>

                    <br />
                    <Button variant="contained" color="secondary" onClick={handleClickAdversary}>
                        Back
                    </Button>
                </Paper>
            </Container>
        </Layout>
    )
}

export default () => (
    <PrivacyVal />
)
