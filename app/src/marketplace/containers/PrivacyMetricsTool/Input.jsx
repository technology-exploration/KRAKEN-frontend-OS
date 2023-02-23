// @flow

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

import styled from 'styled-components'
import Layout from '$shared/components/Layout'
import { MarketplaceHelmet } from '$shared/components/Helmet'
import CheckBox from './Checkbox'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),

        },
        button: {
            display: 'block',
            marginTop: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
    },
}))

const Container = styled.section`
    margin: 0 50px
`
const Input = () => {
    const classes = useStyles()
    const paperStyle = {
        padding: '50px 20px', width: 600, margin: '20px auto',
    }
    const history = useHistory()

    // this is the input from AdversaryStrength.js
    // eslint-disable-next-line prefer-destructuring
    const state = history.location.state

    return (
        // <ProductController key={props.match.params.id} ignoreUnauthorized requirePublished>
        <Layout>
            <MarketplaceHelmet />
            <Container>
                <Paper elevation={3} style={paperStyle}>
                    <h1 style={{
                        color: 'blue',
                    }}
                    ><u>Calculate privacy metric</u>
                    </h1>

                    <form classmin={classes.root} noValidate autoComplete="off">
                        Does this file have similar information or does it have relating data to previously uploaded files?
                        Please select all items that are contained in the file:
                        <CheckBox adversaryState={state} />
                    </form>
                </Paper>
            </Container>
        </Layout>
    // </ProductController>
    )
}

export default () => (
    <Input />
)
