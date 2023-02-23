import React from 'react'
import styled from 'styled-components'
import { Modal } from 'react-bootstrap'
import Button from '$shared/components/Button'

const Text = styled.div`
font-size: 14px;
line-height: 2;
color: black;
font-weight: normal;
margin-top: 20px;
`

const RegistrationModal = ({ show, handleClose, modalContent }) => (
    <Modal show={show} onHide={handleClose} >
        <div
            className="text-center"
            style={{
                padding: 40,
                borderRadius: 20,
            }}
        >
            <Text>
                {modalContent}
            </Text>
            <div className="d-flex justify-content-around alignt-items-center my-3">
                <Button variant="secondary" size="mini" onClick={handleClose} className="mt-4">
                    Ok
                </Button>
            </div>
        </div>
    </Modal>
)

export default RegistrationModal
