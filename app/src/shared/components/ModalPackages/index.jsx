import React from 'react'
import styled from 'styled-components'
import { Modal, Table } from 'react-bootstrap'
// import Table from 'react-bootstrap/Table'
import Button from '$shared/components/Button'

const Header = styled.p`
text-align: left;
font-size: 17px;
color: black;
margin-bottom: 6px;
`

const Titles = styled.th`
font-size: 12px;
line-height: 1.5;
color: #386f88;
font-weight: normal;
`

const ColTitle = styled.th`
font-size: 12px;
font-weight: normal;
text-align: left;
`

const FirstCol = styled.th`
font-size: 10px;
width: 190px;
text-align: left;
font-weight: normal;
color: #818181;
height: 45px;
`

const RowItem = styled.th`
font-size: 10px;
font-weight: normal;
height: 45px;
width: 106px
`

const Tbody = styled.tbody`
border-top: 0.7px solid black !important;
`

const ModalPackages = ({ show, handleClose }) => (
    <Modal show={show} onHide={handleClose} >
        <div
            className="text-center"
            style={{
                padding: 40,
            }}
        >
            <Header>Analytics package options and features</Header>
            <Table responsive="sm">
                <thead>
                    <tr>
                        <ColTitle>Package feature</ColTitle>
                        <Titles>Standard package</Titles>
                        <Titles>Medium package</Titles>
                        <Titles>Premium package</Titles>
                    </tr>
                </thead>
                <Tbody>
                    <tr>
                        <FirstCol>Histogram</FirstCol>
                        <RowItem>Yes</RowItem>
                        <RowItem>Yes</RowItem>
                        <RowItem>Yes</RowItem>
                    </tr>
                    <tr>
                        <FirstCol>Min and max value</FirstCol>
                        <RowItem>Yes</RowItem>
                        <RowItem>Yes</RowItem>
                        <RowItem>Yes</RowItem>
                    </tr>
                    <tr>
                        <FirstCol>Average value</FirstCol>
                        <RowItem>Yes</RowItem>
                        <RowItem>Yes</RowItem>
                        <RowItem>Yes</RowItem>
                    </tr>
                    <tr>
                        <FirstCol>Median value</FirstCol>
                        <RowItem>Yes</RowItem>
                        <RowItem>Yes</RowItem>
                        <RowItem>Yes</RowItem>
                    </tr>
                    <tr>
                        <FirstCol>Standard deviation</FirstCol>
                        <RowItem>Yes</RowItem>
                        <RowItem>Yes</RowItem>
                        <RowItem>Yes</RowItem>
                    </tr>
                    <tr>
                        <FirstCol>Max number of datasets</FirstCol>
                        <RowItem>1-3</RowItem>
                        <RowItem>4-6</RowItem>
                        <RowItem>7-10</RowItem>
                    </tr>
                    <tr>
                        <FirstCol>Price</FirstCol>
                        <RowItem>1 $DATA</RowItem>
                        <RowItem>2 $DATA</RowItem>
                        <RowItem>3 $DATA</RowItem>
                    </tr>
                </Tbody>
            </Table>

            <Button variant="secondary" size="mini" onClick={handleClose} className="mt-4">
                Close
            </Button>
        </div>
    </Modal>
)

export default ModalPackages
