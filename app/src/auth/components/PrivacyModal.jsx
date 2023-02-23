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
line-height: 1;
marginTop: 20px;
`

const Text = styled.div`
font-size: 14px;
line-height: 1.5;
color: black;
font-weight: normal;
marginTop: 20px;
`
const Br = styled.b`
line-height: 3;
`

const PrivacyModal = ({ show, handleClose }) => (
    <Modal
        show={show}
        onHide={handleClose}
        scrollable="true"
    >
        <div
            style={{
                padding: '20px 30px',
                borderRadius: 20,
            }}
        >
            <Modal.Header closeButton>
                <Header>KRAKEN Privacy Policy</Header>
            </Modal.Header>
            <Modal.Body style={{
                height: '65vh',
            }}
            >
                <Text>
                    This Privacy Policy contains all essential information on the processing of your Personal Data and your corresponding
                    rights when making use of the KRAKEN website and KRAKEN mobile application in order to publish and make available a
                    data product or obtain access to a data product (“KRAKEN Platform Service”). To ensure an appropriate level of data protection,
                    KRAKEN (also “KRAKEN Platform”, “we”, and “us”) complies with the European Union General Data Protection Regulation (“GDPR”).

                    <br /><Br>1. Definitions</Br>
                    <br />Wherever we talk about Personal Data below, we mean any information relating to an identified or identifiable natural person (“Data Subject”).
                    An identifiable natural person can be identified, directly or indirectly, by reference to an identifier such as a name, an identification number,
                    location data, an online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or socialidentity of that natural person.
                    The entity who determines the purposes and means of the processing of Personal Data is the Controller. The entity who processes Personal Data on behalf of the Controller is the Processor.
                    The term Data Provider refers to the KRAKEN user that publishes and makes accessible a data product by making use of the KRAKEN Platform Service.
                    The term Data Consumer refers to the KRAKEN user that obtains access to a data product by making use of the KRAKEN Platform Service.

                    <br /><Br>2. Categories of personal data</Br>
                    <br />We distinguish between two types of data when you create a new KRAKEN user account or when you make use of the KRAKEN Platform Service: Account Data and Content Data.
                    <br /><Br>2.1 Account Data</Br>
                    <br />Account Data refers to the data that is necessary to create a KRAKEN user account and make use of the KRAKEN Platform Service. Account Data includes the following Personal
                    Data categories: first name, last name, e-mail address, country of residence, and whether you are over 18 years old.
                    <br /><Br>2.2 Content Data</Br>
                    <br />Content Data refers to a data product that is published and made accessible by the Data Provider by making use of the
                    KRAKEN Platform Service. Content Data may include any Personal Data category that the Data Provider decides to publish
                    and make accessible through the KRAKEN Platform Service.

                    <br /><br /><b>3. Who processes your personal data, legal basis for processing, and purposes of processing</b>

                    <br /><Br>3.1 Account Data</Br>
                    <br />The KRAKEN Platform acts as a Controller in relation to your Account Data.
                    We collect and process your Account Data because it is necessary for the fulfillment of our agreement with you in order to:
                    create and maintain a KRAKEN user account;
                    enable the use of the KRAKEN Platform Service, which means the publication and making available of a data product or obtaining access to a data product.
                    We may also store and process your Account Data in order to comply with a legal obligation for the purpose of legal compliance, tax or auditing purposes, or to detect and prevent fraudulent or illegal activity.
                    <br /><Br>3.2 Content Data</Br>
                    <br />The KRAKEN Platform acts as a Processor in relation to your Content Data. We do not directly process Content Data, but rather facilitate the
                    matchmaking between Data Providers and Data Consumers and facilitate the provision of the Data Provider’s consent for the access
                    and subsequent processing of Content Data by the Data Consumer.
                    The Data Consumer acts as a Controller in relation to your Content Data. As a Controller, the Data Consumer must adhere
                    to the obligations of the GDPR and may only process Personal Data for their own specific purposes under the conditions and
                    limitations of the consent given by the Data Provider. The Data Provider sets the conditions and limitations of their consent
                    for the access and subsequent processing of Content Data by the Data Consumer through the publication process of a data product
                    and is able to manage their consent by making use of the dynamic consent function through the KRAKEN mobile application.
                    In case the Data Provider publishes and makes accessible Content Data that includes their own Personal Data, the Data Provider is considered a Data Subject in relation to those Personal Data.
                    In case a Data Provider publishes and makes accessible Content Data that includes Personal Data of Data Subjects other
                    than themselves, the Data Provider is also considered a Controller in relation to those Personal Data. As a Controller,
                    the Data Provider must adhere to the obligations of the GDPR and may only publish and make available those Personal Data
                    in accordance with a valid legal basis, such as the consent given by those Data Subjects.

                    <br /><Br>4. Storage duration and erasure</Br>
                    <br /><Br>4.1 Account Data</Br>
                    <br />Your Account Data will be stored by us in accordance with the GDPR and to the extent necessary for the processing
                    purposes set out in this Privacy Policy (see ‘3. Who processes your Personal Data, legal basis for processing, and purposes of processing’).
                    Subsequently, we will delete your Personal Data or take steps to render the data anonymous, unless we are legally obliged or permitted to
                    keep your Personal Data for a longer period (e.g. legal compliance, tax or auditing purposes, or to detect and prevent fraudulent or illegal activity).
                    <br /><Br>4.2 Content Data</Br>
                    <br />Your Content Data will be stored by the Data Consumer to the extent necessary for their own processing purposes and under
                    the conditions and limitations of the consent given by the Data Provider. For more information on the specific data retention and
                    deletion policy, please contact the Data Consumer directly. Please find the contact details of the Data Consumer on the KRAKEN user dashboard.

                    <br /><Br>5. Data security</Br>
                    <br /><Br>5.1 Account Data</Br>
                    <br />We protect your Personal Data through the implementation of technical and organizational measures to minimize risks associated with data loss,
                    misuse, unauthorized access and unauthorized disclosure and alteration (e.g. strong web security, end-to-end encryption, and access policies).
                    <br /><Br>6. International data transfers</Br>

                    <br /><Br>6.1 Account Data</Br>
                    <br />Account Data will never be transferred or made accessible to third parties.
                    <br /><Br>6.2 Content Data</Br>
                    <br />For data transfers between Data Providers and Data Consumers located in the European Union (“EU”) or European Economic Area (“EAA”), an adequate
                    level of data protection is offered by the GDPR meaning no further safeguards are necessary.
                    For international data transfers to Data Consumers located in third countries (i.e. countries outside of the EU/EEA),
                    an equivalent level of data protection to that of the GDPR may not be guaranteed. However, according to the European Commission,
                    a series of third countries provide an adequate level of data protection meaning no further safeguards are necessary. Third countries
                    with such an adequacy decision currently include: Andorra, Argentina, Canada (commercial organizations), the Faroe Islands,
                    Guernsey, Israel, the Isle of Man, Japan, Jersey, New Zealand, the Republic of Korea, Switzerland, the United Kingdom, and Uruguay.
                    In case of international data transfers to Data Consumers located in other third countries than the ones mentioned in the list above,
                    the Data Consumer should implement appropriate safeguards and ensure the proper exercise of Data Subject rights. In case of absence of
                    these appropriate safeguards, please be aware of increased risks relating to the processing of your Personal Data and the exercise of the rights of Data Subjects.
                    During the publication of a data product, the Data Provider has the option to indicate to which regions the data product may be
                    transferred and is able to exclude the transfer of the data product to third countries.

                    <br /><Br>7. Rights as a data subject</Br>
                    <br />Under the conditions laid down by the GDPR and possible restrictions under national law, as a Data Subject, you have the right
                    to access, rectification, erasure, restriction of processing and data portability in relation to your Personal Data.
                    Moreover, as a Data Subject, you are able to withdraw your consent at any time and object to the processing of your Personal Data where applicable. You can also lodge a complaint with a supervisory authority.
                    Please find a more detailed explanation of your rights as a Data Subject below.
                    <br /><Br>7.1 Account Data</Br>
                    <br />You may contact the KRAKEN Platform to exercise your rights as a Data Subject in relation to your Account Data.
                    Please find the contact details of the KRAKEN data protection officer below (see ‘8. Data protection officer and contact details’).
                    <br />- You have to right to obtain access to your Personal Data that is being processed by us. The right of access includes
                    a confirmation as to whether or not Personal Data concerning you are being processed by us, and, where that is the case,
                    allows you to request access to the Personal data and the following information: the purposes of the processing, the categories
                    of Personal Data concerned, the categories of recipients to whom the Personal Data have been or will be disclosed, where possible the
                    envisaged period for which the Personal Data will be stored or the criteria used to determine that period, the existence of the right
                    to request rectification or erasure of Personal Data or restriction of processing of Personal Data or to object to such processing, the
                    right to lodge a complaint with a supervisory authority, any available information as to the Personal Data’s source (where the Personal
                    Data are not collected from you), the existence of automated decision-making, including profiling and, where appropriate, meaningful informationon its details.
                    <br />- You have the right to obtain from us without undue delay the rectification of inaccurate Personal Data concerning you. Taking
                    into account the purposes of the processing, you have the right to have incomplete Personal Data completed, including by means of
                    providing a supplementary statement. You can exercise your right to rectification by changing your Account Data through your KRAKEN
                    profile or by contacting the KRAKEN data protection officer.
                    <br />- You have the right to obtain from us the erasure of Personal Data concerning you under certain conditions
                    (e.g. when the Personal Data are no longer necessary in relation to the purposes for which they were processed, when
                    they have been unlawfully processed, or when they have to be erased for compliance with a legal obligation). The right
                    to erasure does not apply if the processing of your Personal Data is necessary for compliance with a legal obligation,
                    for reasons of public interest or for the establishment, exercise or defense of legal claims. The right to erasure may be
                    subject to additional conditions under national law. You can exercise your right to erasure by deleting your KRAKEN user
                    account through your KRAKEN profile or by contacting the KRAKEN data protection officer.
                    <br />- You have the right to obtain from us restriction of processing your Personal Data under certain conditions
                    (e.g. the accuracy of the Personal Data is contested by you, the processing is unlawful and you oppose the erasure of the
                    Personal Data, we no longer need the Personal Data for the purposes of processing but they are required by you to establish,
                    exercise or defend legal claims, or you have objected to the processing).
                    <br />- You have the right to object at any time to the processing of your Personal Data for direct marketing purposes,
                    which includes profiling to the extent that it is related to such direct marketing.
                    <br />- You have the right to data portability which includes the right to receive the Personal Data concerning you,
                    which you have provided to us, in a structured, commonly used and machine-readable format and the right to transmit
                    those data to another Controller.
                    <br />- You have the right to lodge a complaint with a supervisory authority.

                    <br /><Br>7.2 Content Data</Br>
                    <br />You may contact the Data Consumer to exercise your rights as a Data Subject in relation to your Content Data. Please find
                    the contact details of the Data Consumer on the KRAKEN user dashboard.
                    For an overview of your rights as a Data Subject, see ‘7. Rights as a data subject’. The exercise of your
                    rights as a Data Subject in relation to your Content Data is subject to the conditions laid down by the GDPR and possible
                    restrictions under national law, which must be assessed by the Data Consumer. The exercise and extent of your rights as a Data
                    Subject in relation to your Content Data may therefore differ from your rights as a Data Subject in relation to your Account Data
                    (see ‘7.1 Account Data’).
                    <br />You have the right to withdraw your consent for the processing of Personal Data by the Data Consumer at any time and without detriment. Consequently,
                    the Data Consumer is no longer allowed to process your Personal Data based on this consent and must erase those Personal Data without undue delay. The
                    withdrawal of consent shall not affect the lawfulness of processing based on this consent before its withdrawal. You can exercise your right to withdraw consent by making use of the dynamic consent function through the KRAKEN mobile application or by contacting the Data Consumer directly.

                    <br /><Br>8. Data protection officer and contact details</Br>
                    <br />For questions regarding our Privacy Policy, the processing of your Personal Data, or your corresponding rights, you may contact
                    the KRAKEN data protection officer at: insert contact details of KRAKEN data protection officer

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

export default PrivacyModal
