/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'
import Table from 'react-bootstrap/Table'
import Layout from '$shared/components/Layout'
import dropdownArrow from '$shared/assets/images/icon-arrow-down.png'
// import { postAnalyticsComputation } from '$mp/modules/product/services'

import { MarketplaceHelmet } from '$shared/components/Helmet'
import { getProductSeller } from '$shared/modules/user/services'
import { getProductSubscriptions, getProductById } from '$mp/modules/product/services'
import { selectUserData } from '$shared/modules/user/selectors'
import { getToken } from '$shared/utils/sessionToken'

const title = {
    width: '100%',
    lineHeight: '1.5',
    fontSize: '26px',
    color: 'black',
    display: 'block',
}

const titleSummary = {
    width: '100%',
    lineHeight: '1.5',
    fontSize: '22px',
    color: '#386f88',
    display: 'block',
    marginTop: '20px',
}

const Container = styled.section`
    margin: 0 60px
`

const DropdownDiv = styled.div`
    padding: 20px;
    p{
        font-size: 12px
    }
    span{
        font-weight: bolder;
    }
`

const ColTitle = styled.th`
width: 330px;
font-size: 12px;
line-height: 20px;
font-weight: normal;
text-align: left;
padding: 0.5rem 2rem 0.5rem 0 !important;
color: #989898;
`

const ProvideAccessBtn = styled.button`
border:  none;
background-color: transparent;
color: #386f88;
font-size: 12px;
text-align: center;
`

const RowItem = styled.th`
font-size: 12px;
line-height: 1.7;
font-weight: normal;
// padding-right: 20px;
padding: 0.5rem 2rem 0.5rem 0 !important;
width: 330px;
`

const Tr = styled.tr`
border-top: 0.7px solid black !important
`

const Tbody = styled.tbody`
border-top: none;
`

const Icon = styled.img`
width: 20px
`
const noProducts = {
    width: 'fit-content',
    lineHeight: '1.5',
    fontSize: '14px',
    color: 'red',
    display: 'block',
    // padding: '10px',
    // border: '1px solid red',
    // borderRadius: 5,
}

const ManageSubscriptions = () => {
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null && !!getToken()
    const [subscribers, setSubscribers] = useState([])
    const [subscriptions, setSubscriptions] = useState([])
    const [product, setProduct] = useState([])
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState('')

    const { id } = useParams()

    const handleDropdown = (item) => {
        setSelected(item)
        selected === item ? setOpen(!open) : setOpen(true)
    }

    useEffect(() => {
    }, [isLoggedIn, subscribers])

    // '9926591c653578b4da6c575578b31fe14b976e78d2be48a1adcff3fad0ca0e75'
    useEffect(() => {
        console.log('id ', id)
        try {
            getProductSubscriptions(id)
                .then((res) => setSubscriptions(res))
        } catch (e) {
            console.log('ERROR ', e)
        }

        try {
            getProductById(id)
                .then((res) => setProduct(res))
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('ERROR', e)
        }
    }, [id])

    useEffect(() => {
        subscriptions.map((i) => getProductSeller(i.userId)
            .then((subs) => setSubscribers((s) => [...s, subs])))
    }, [subscriptions])

    return (
        <Layout>
            <MarketplaceHelmet />
            <Container>
                <Translate
                    value="Data product subscriptions"
                    className="mb-5 w-100"
                    style={title}
                />
                <Translate
                    value={(product && product.name) || ''}
                    style={titleSummary}
                />
                <div
                    style={{
                        marginTop: 20,
                        marginBottom: 90,
                    }}
                >
                    {
                        subscribers.length === 0 && subscriptions.length === 0 &&
                        <Translate
                            value="Oops, you have no subscribers yet!"
                            className="my-4"
                            style={noProducts}
                        />
                    }

                    <Table
                        responsive="sm"
                        className=""
                        style={{
                            borderTop: '2px solid transparent',
                            width: '90%',
                        }}
                    >
                        <Tbody>
                            {
                                subscribers.length > 0 && subscriptions.length > 0 &&
                                <Tr>
                                    <ColTitle>Name</ColTitle>
                                    <ColTitle>Organisation</ColTitle>
                                    <ColTitle>Purposes of data processing</ColTitle>
                                    <ColTitle>Categories of personal data used</ColTitle>
                                    <ColTitle>Country / region</ColTitle>
                                    <ColTitle>Transfer based on</ColTitle>
                                    <ColTitle>Automated decision making</ColTitle>
                                    <ColTitle>Data stored until</ColTitle>
                                    <ColTitle> </ColTitle>
                                </Tr>
                            }
                            {
                                subscribers && subscriptions && subscribers.map((subscriber, idx) => (
                                    <React.Fragment key={subscriber.name}>
                                        <Tr key={subscriber.name}>
                                            <RowItem>{subscriber.name}</RowItem>
                                            <RowItem>{subscriber.institution === undefined ? '-' : subscriber.institution}</RowItem>
                                            <RowItem>
                                                {(JSON.stringify(subscriptions[idx]?.purposeOfUse?.job_offers) && <p>Job offers</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.purposeOfUse?.automated) && <p>Automated decision making</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.purposeOfUse?.marketing) && <p>Marketing</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.purposeOfUse?.publicly_funded_research) && <p>Publicly funded research</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.purposeOfUse?.private_research) && <p>Private research</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.purposeOfUse?.managment) && <p>Managment</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.purposeOfUse?.study_recommendations) && <p>Study recommendations</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.purposeOfUse?.statistical_research) && <p>Statistical research</p>)}
                                            </RowItem>
                                            <RowItem>
                                                {(JSON.stringify(subscriptions[idx]?.categoriesOfData?.patients_medical_records) && <p>Patients medical records</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.categoriesOfData?.genetic_data) && <p>Genetic data</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.categoriesOfData?.imaging_data) && <p>Imaging data</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.categoriesOfData?.mobile_data) && <p>Mobile data</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.categoriesOfData?.grades) && <p>Grades</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.categoriesOfData?.diplomas) && <p>Diplomas</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.categoriesOfData?.matriculation) && <p>Matriculation</p>)}
                                            </RowItem>
                                            <RowItem>
                                                {(JSON.stringify(subscriptions[idx]?.countryToTransfer?.EUCountry) && <p>EU/EEA</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.countryToTransfer?.nonEU) && <p>Non-EU/EEA country with an adequacy decision: {JSON.stringify(subscriptions[idx]?.countryToTransfer?.nonEUCountry) || ''}</p>)}
                                                {(JSON.stringify(subscriptions[idx]?.countryToTransfer?.noAdeqDecision) && <p>Non-EU/EEA country without an adequacy decision ${JSON.stringify(subscriptions[idx]?.countryToTransfer?.noAdeqDecisionCountry) || ''}</p>)}
                                            </RowItem>
                                            <RowItem>Informed consent</RowItem>
                                            <RowItem>{subscriptions[idx]?.purposeOfUse?.automated ? 'Yes' : 'No'}</RowItem>
                                            <RowItem>{`${subscriptions[idx]?.endsAt.split('-')[2].slice(0, 2)}/${subscriptions[idx]?.endsAt.split('-')[1]}/${subscriptions[idx]?.endsAt.split('-')[0]}` || ''}</RowItem>
                                            <RowItem>
                                                <ProvideAccessBtn onClick={() => handleDropdown(subscriber.name)}> <Icon src={dropdownArrow} alt="dropdown arrow" /> </ProvideAccessBtn>
                                            </RowItem>
                                        </Tr>
                                        {
                                            open && selected === subscriber.name &&
                                                <Tr>
                                                    <td colSpan="9">
                                                        <DropdownDiv>
                                                            <p><span>Contact details of the data controller:</span> {subscriber.name} - {subscriber.email}</p>
                                                            <p><span>Contact details of the Data Protection Officer:</span> {subscriber.legalName} {subscriber.legalSurname} - {subscriber.officerEmail}</p>
                                                            <p><span>Safeguards used to protect the data and inform about the risks of the transfer:</span> {subscriptions[idx].safeguards || 'N/A'}</p>
                                                        </DropdownDiv>
                                                    </td>
                                                </Tr>
                                        }
                                    </React.Fragment>
                                ))
                            }
                        </Tbody>
                    </Table>
                </div>
            </Container>
        </Layout>
    )
}

export default () => (
    <ManageSubscriptions />
)
