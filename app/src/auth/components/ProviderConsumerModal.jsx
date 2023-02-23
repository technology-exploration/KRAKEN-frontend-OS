/* eslint-disable max-len */
import React from 'react'
import styled from 'styled-components'
import { Modal } from 'react-bootstrap'
import Button from '$shared/components/Button'

const Header = styled.p`
font-size: 18px;
color: #386f88;
margin-bottom: 6px;
font-weigh: bold;
line-height: 1.5;
margin-top: 20px;
`

const Text = styled.div`
font-size: 14px;
line-height: 1.5;
color: black;
font-weight: normal;
margin-top: 20px;
`
const Br = styled.b`
line-height: 3;
`

const ProviderConsumerModal = ({ show, handleClose }) => (
    <Modal
        show={show}
        onHide={handleClose}
        scrollable
    >
        <div
            style={{
                padding: '20px 30px',
                borderRadius: 20,
            }}
        >
            <Modal.Header closeButton>
                <Header>Data sharing agreement between the Data Provider and Data Consumer</Header>
            </Modal.Header>
            <Modal.Body style={{
                height: '65vh',
            }}
            >
                <Text>
                    This agreement (“Agreement”) sets out the legal obligations in relation to the processing of Personal Data that are applicable to the Data Provider and Data Consumer when making use of the KRAKEN website and KRAKEN mobile application in order to publish and make available a data product or obtain access to a data product (“KRAKEN Platform Service”).
                    <br />
                    <Br>1. Definitions</Br>
                    <br />
                    Wherever we talk about Personal Data below, we mean any information relating to an identified or identifiable natural person (“Data Subject”). An identifiable natural person can be identified, directly or indirectly, by reference to an identifier such as a name, an identification number, location data, an online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person.
                    <br />The entity who determines the purposes and means of the processing of Personal Data is the Controller. The entity who processes Personal Data on behalf of the Controller is the Processor.
                    <br />The term Data Provider refers to the KRAKEN user that publishes and makes accessible a data product by making use of the KRAKEN Platform Service.
                    <br />The term Data Consumer refers to the KRAKEN user that obtains access to a data product by making use of the KRAKEN Platform Service.
                    <br />The legal obligations of the European Union General Data Protection Regulation (“GDPR”) referred to throughout this Agreement include, but are not limited to: the principles of lawfulness, fairness, and transparency; purpose limitation; data minimization; accuracy; storage limitation; integrity and confidentiality; accountability; obligations for Controllers; and obligations relating to the rights of Data Subjects.
                    <br /><Br>2. Obligations for the Data Provider</Br>
                    <br />In case the Data Provider publishes and makes accessible Content Data that includes their own Personal Data, the Data Provider is considered a Data Subject in relation to those Personal Data. The Data Provider that is a Data Subject agrees to ensure that there are no limitations on the sharing of those Personal data (e.g. trade secrets). For more information on your rights as a Data Subject, please consult the KRAKEN Privacy Policy.
                    <br />In case a Data Provider publishes and makes accessible Content Data that includes Personal Data of Data Subjects other than themselves, the Data Provider is considered a Controller in relation to those Personal Data. As a Controller, the Data Provider agrees to adhere to the obligations of the GDPR and to only publish and make available those Personal Data in accordance with a valid legal basis, such as the consent given by those Data Subjects. The Data Provider that is a Controller also agrees to ensure that there are no other limitations on the sharing of those Personal Data (e.g. trade secrets).
                    <br /><Br>3. Obligations for the Data Consumer</Br>
                    <br />The Data Consumer is considered a Controller in relation to the Content Data of the Data Provider. As a Controller, the Data Consumer agrees to adhere to the obligations of the GDPR, to only process Personal Data for their own specific purposes under the conditions and limitations of the consent given by the Data Provider, and to delete the Personal Data at the indicated time.
                    <br />The Data Consumer agrees to enable and facilitate the exercise of the Data Subject rights under the conditions of the GDPR and possible restrictions under national law. This also includes the right of the Data Subject to withdraw their consent at any time and without detriment, thereby stopping the processing activities based on this consent and erasing those Personal data without undue delay. The withdrawal of consent shall not affect the lawfulness of processing based on this consent before its withdrawal.
                    <br /><br /><b>4. Provisions for both the Data Provider and Data consumer</b><br />
                    Upon acceptance of the offer by the Data Consumer, the Data Provider and the Data Consumer enter into a contract for the processing of Personal Data by the Data Consumer in accordance with the conditions and limitations included in the consent of the Data Provider.
                    <br />
                    <br />
                    By signing this Agreement you, as Data Provider or Data Consumer, agree to comply with the provisions of this Agreement and the legal obligations laid down by the GDPR.
                </Text>
            </Modal.Body>
            <div className="d-flex justify-content-around alignt-items-center my-3">
                <Button variant="secondary" size="mini" onClick={handleClose} className="mt-4">
                    Ok
                </Button>
            </div>
        </div>
    </Modal>
)

export default ProviderConsumerModal
