/* eslint-disable no-unused-expressions */
// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import useModal from '$shared/hooks/useModal'

import ConfirmSaveDialog from '$shared/components/ConfirmSaveDialog'

import { deleteProduct } from '$mp/modules/product/services'
import useEditableProduct from '../ProductController/useEditableProduct'

export default () => {
    const { api, isOpen } = useModal('confirmSave')
    const product = useEditableProduct()

    if (!isOpen) {
        return null
    }

    return (
        <ConfirmSaveDialog
            onSave={() => api.close({
                save: true,
                redirect: true,
            })}
            onContinue={() => {
                product.state !== 'DEPLOYED' ?
                    (
                        deleteProduct(product.id),
                        setTimeout(
                            () =>
                                api.close({
                                    save: false,
                                    redirect: true,
                                })
                            , 600,
                        )
                    )
                    :
                    () =>
                        api.close({
                            save: false,
                            redirect: true,
                        })
            }}
            onClose={() => api.close({
                save: false,
                redirect: false,
            })}
        >
            <Translate
                value="modal.confirmSave.product.message"
                tag="p"
                dangerousHTML
            />
        </ConfirmSaveDialog>
    )
}
