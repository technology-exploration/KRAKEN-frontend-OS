import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { Modal } from 'react-bootstrap'
import useIsMounted from '$shared/hooks/useIsMounted'
import useFailure from '$shared/hooks/useFailure'
import { logout as logoutAction } from '$shared/modules/user/actions'
import Button from '$shared/components/Button'
// import deleteAccount from '$mp/modules/product/services'
import { post } from '$shared/utils/api'
import routes from '$routes'

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

const DeleteAccountModal = ({ show, handleClose }) => {
    const isMounted = useIsMounted()
    const fail = useFailure()
    const dispatch = useDispatch()

    const handleDeleteAccount = async () => {
        // await post({
        //     url: routes.auth.deleteAccount(),
        // })

        try {
            await post({
                url: routes.auth.deleteAccount(),
            })
            if (isMounted()) {
                dispatch(logoutAction())
            }
        } catch (e) {
            fail(e)
        }
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
                    Are you sure you want to delete your account?
                </Header>
                <Text>
                    This will remove all of your Data Products and your account’s metadata from the KRAKEN marketplace,
                    terminate existing consents provided to process your data and require you to create a new account
                    to use the marketplace in future.
                </Text>
                <div className="d-flex justify-content-around alignt-items-center my-3">
                    <Button variant="secondary" size="mini" className="mt-4" onClick={handleDeleteAccount}>
                        Yes, I’m sure
                    </Button>
                    <Button variant="secondary" size="mini" onClick={handleClose} className="mt-4">
                        No thanks
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteAccountModal
