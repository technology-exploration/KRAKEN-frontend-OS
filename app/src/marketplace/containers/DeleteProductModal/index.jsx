import React from 'react'
import { Modal } from 'react-bootstrap'
import styled from 'styled-components'
import Button from '$shared/components/Button'
import { deleteProduct } from '$mp/modules/product/services'
import './style.css'

const DeleteProductModal = ({ show, handleClose, id }) => {
    const Header = styled.p`
    font-size: 18px;
    color: #386f88;
    margin-bottom: 6px;
    font-weigh: bold;
    line-height: 1;
    margin-top: 20px;
    `

    const Text = styled.div`
    font-size: 14px;
    line-height: 2;
    color: black;
    font-weight: normal;
    margin-top: 20px;
    `

    const handleDelete = () => {
        deleteProduct(id)
        setTimeout(() => handleClose(), 600)
    }

    return (
        <Modal show={show} onHide={handleClose} >
            <div
                className="text-center"
                style={{
                    padding: 40,
                    borderRadius: 20,
                }}
            >
                <Header>
                    Are you sure you want to delete this Product?
                </Header>
                <Text>
                    This will remove your Data Product from the marketplace catalogue and data buyers will no longer be able to purchase your Product.
                </Text>
                <div className="d-flex justify-content-around alignt-items-center mt-4 mb-3">
                    <Button variant="secondary" size="mini" onClick={handleDelete}>
                        Yes, I’m sure
                    </Button>
                    <Button
                        variant="secondary"
                        size="mini"
                        onClick={handleClose}
                    >
                        No thanks
                    </Button>
                </div>
            </div>
        </Modal>

    )
}

export default DeleteProductModal
