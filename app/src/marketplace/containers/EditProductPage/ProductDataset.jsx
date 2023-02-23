/* eslint-disable no-unused-vars */
/* eslint-disable no-else-return */
/* eslint-disable no-console */
// @flow

import React, { useState, useContext } from 'react'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'
import styled from 'styled-components'
import naclFactory from 'js-nacl'

import Text from '$ui/Text'
import Button from '$shared/components/Button'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import routes from '$routes'

import useEditableProduct from '../ProductController/useEditableProduct'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import useValidation from '../ProductController/useValidation'
import { Context as EditControllerContext } from './EditControllerProvider'

import styles from './productDetails.pcss'
import ColumnsInputs from './ColumnsInputs'

const Details = styled.div`
    padding-top:2rem;
    // display: flex;
    align-items: baseline;
`
const P = styled.p`
   margin-bottom: 10px;
`

let nacl
naclFactory.instantiate((naclInstance) => { nacl = naclInstance })

const Uint8ToBase64 = (data) => btoa(String.fromCharCode(...data))

const processDataset = async (file) => {
    const dataset = await file.text() // wait for file to be retrieved
    // seller's key pair for input authenticity
    const keyPair = window.GenerateKeypairWASM() // position 0: secret key, position 1: public key

    // mpc nodes public keys retrieval
    const mpcNode1PubKey = new Uint8Array(await fetch(routes.api.products.mpcNode1PubKey()).then((response) => response.arrayBuffer()))
    console.log(mpcNode1PubKey.toString())
    const mpcNode2PubKey = new Uint8Array(await fetch(routes.api.products.mpcNode2PubKey()).then((response) => response.arrayBuffer()))
    console.log(mpcNode2PubKey.toString())
    const mpcNode3PubKey = new Uint8Array(await fetch(routes.api.products.mpcNode3PubKey()).then((response) => response.arrayBuffer()))
    console.log(mpcNode3PubKey.toString())

    const mpcNodesPubKeys = [mpcNode1PubKey, mpcNode2PubKey, mpcNode3PubKey]

    // generation of encryption key and shares
    const retValues = window.GenerateKeyAndCiphertexts(keyPair[0], mpcNodesPubKeys.length, ...mpcNodesPubKeys)
    const encryptionKey = retValues[0]
    const cipherTextsForMPC = []
    retValues[1].forEach((item) => {
        cipherTextsForMPC.push(Uint8ToBase64(item))
    })

    // dataset encryption
    const encodedDataset = nacl.encode_utf8(dataset)
    const randomNonce = nacl.crypto_box_random_nonce()
    const keyString = String.fromCharCode(...encryptionKey)
    const encryptedDataset = nacl.crypto_secretbox(encodedDataset, randomNonce, keyString)

    // dataset provision to the user
    const encryptedDatasetFile = new Blob([encryptedDataset])
    const encryptedDatasetFileURL = window.URL.createObjectURL(encryptedDatasetFile)
    const tempLink = document.createElement('a')
    tempLink.href = encryptedDatasetFileURL
    tempLink.setAttribute('download', 'dataset.encrypted.kraken')
    tempLink.click()

    // returning keyshares, seller's pubKey and random nonce
    return {
        keyShares: cipherTextsForMPC,
        publisherPubKey: Uint8ToBase64(keyPair[1]),
        randomNonce: Uint8ToBase64(randomNonce),
    }
}

type Props = {
    disabled?: boolean,
}

/* eslint-disable object-curly-newline */
const ProductDataset = ({ disabled }: Props) => {
    const [uploaded, setUploaded] = useState(false)
    const [columns, setColumns] = useState([])
    const [data, setData] = useState([])
    const [csvSplit, setCsvSplit] = useState(null)
    const [compliantColumns, setCompliantColumns] = useState([])
    const [validated, setValidated] = useState(false)

    const product = useEditableProduct()
    const { publishAttempted } = useContext(EditControllerContext)
    const { updateProductDatasetInfo, updateColumnVariables, updateNumberOfRecords } = useEditableProductActions()

    const { type, sector } = product

    const { isValid: isFileValid, message: fileMessage } = useValidation('file')
    const { isValid: isUrlValid, message: urlMessage } = useValidation('datasetUrl')

    const newProcessDataset = async (file) => {
        const dataset = await file.text() // wait for file to be retrieved
        const cols = dataset.toString().split(/\r\n|\n|\r/)
        if (cols[0].includes(',')) {
            const col = cols[0].split(',')
            setColumns(col)
            setCsvSplit(',')
            setCompliantColumns(col.map((column) => column.replace(column, 'false')))
            setData(cols)
        } else {
            const col = cols[0].split(';')
            setColumns(col)
            setCsvSplit(',')
            setCompliantColumns(col.map((column) => column.replace(column, 'false')))
            setData(...data, cols.map((column) => column.replaceAll(';', ',')))
        }
        setUploaded(true)
    }

    const isChecked = (val) => val === true

    const handleSubmit = (name, idx) => {
        columns.splice(idx, 1, name)
        compliantColumns.splice(idx, 1, true)

        if (compliantColumns.every(isChecked) === true) {
            setValidated(true)
        } else {
            setValidated(false)
        }
    }

    async function saveChanges() {
        // mpc nodes public keys retrieval
        const mpcNode1PubKey = new Uint8Array(await fetch(routes.api.products.mpcNode1PubKeyAnalytics()).then((response) => response.arrayBuffer()))
        const mpcNode1PubKeyString = btoa(String.fromCharCode.apply(null, mpcNode1PubKey))
        const mpcNode2PubKey = new Uint8Array(await fetch(routes.api.products.mpcNode2PubKeyAnalytics()).then((response) => response.arrayBuffer()))
        const mpcNode2PubKeyString = btoa(String.fromCharCode.apply(null, mpcNode2PubKey))
        const mpcNode3PubKey = new Uint8Array(await fetch(routes.api.products.mpcNode3PubKeyAnalytics()).then((response) => response.arrayBuffer()))
        const mpcNode3PubKeyString = btoa(String.fromCharCode.apply(null, mpcNode3PubKey))

        const mpcNodesPubKeys = [mpcNode1PubKeyString, mpcNode2PubKeyString, mpcNode3PubKeyString]
        const proofKey = await fetch(routes.api.products.proofKey()).then((response) => response.text())

        let cols
        let res
        let finalDataset
        if (sector === 'Health and wellness') {
            if (csvSplit === ',') {
                cols = columns.join(',')
            } else {
                cols = columns.join(',')
            }

            const numRecords = data.join().split(',').length - columns.length
            updateColumnVariables(columns)

            updateNumberOfRecords(numRecords)

            data.splice(0, 1, cols)
            const modifiedColumns = data.splice(0, 1, cols)
            let stringData = data.join('\n')
            stringData = stringData.split(' ').join('')

            res = window.SplitCsvText(stringData, proofKey, ...mpcNodesPubKeys)
            finalDataset = `${res[0]}\n${res[1]}\n${res[2]}\n${res[3]}\n`
        } else {
            const numRecords = data.filter((elem) => elem !== '').length - 1 - columns.length
            updateNumberOfRecords(numRecords)
            updateColumnVariables(columns)
            if (csvSplit === ',') {
                cols = columns.join(',')
            } else {
                cols = columns.join(',')
            }
            data.splice(0, 1, cols)
            const modifiedColumns = data.splice(0, 1, cols)

            let stringData = data.join('\n')
            stringData = stringData.split(' ').join('')

            res = window.SplitCsvText(stringData, proofKey, ...mpcNodesPubKeys)
            finalDataset = `${res[0]}\n${res[1]}\n${res[2]}\n${res[3]}\n${res[4]}\n`
        }

        const encryptedDatasetFile = new Blob([finalDataset])
        const encryptedDatasetFileURL = window.URL.createObjectURL(encryptedDatasetFile)
        const tempLink = document.createElement('a')
        tempLink.href = encryptedDatasetFileURL
        tempLink.setAttribute('download', 'dataset.encrypted.kraken')
        tempLink.click()
    }

    return (
        <section id="processDataset" className={cx(styles.root, styles.ProductDetails)}>
            <div className="d-block">
                <Translate
                    tag="h1"
                    value="editProductPage.processDataset.title"
                />
                <Translate
                    tag="p"
                    value="editProductPage.marketSector.encryption"
                />
                <Details>
                    <div className="">
                        {
                            type === 'ANALYTICS' &&
                                <input
                                    type="file"
                                    onChange={(e) => newProcessDataset(e.target.files[0])}
                                />
                        }
                        {
                            (type === 'BATCH') &&
                                <input
                                    type="file"
                                    onChange={(e) => processDataset(e.target.files[0]).then((info) => updateProductDatasetInfo({
                                        ...product.datasetInfo,
                                        ...info,
                                    }))}
                                    className="mb-4"
                                />
                        }
                        <div>
                            {
                                publishAttempted && !isFileValid && (
                                    <Errors
                                        theme={MarketplaceTheme}
                                        style={{
                                            marginBottom: 15,
                                        }}
                                    >
                                        {fileMessage}
                                    </Errors>
                                )}
                        </div>
                    </div>
                    {
                        type === 'ANALYTICS' && sector !== 'Health and wellness' &&
                        <div>
                            <Button
                                kind="primary"
                                size="mini"
                                outline
                                onClick={saveChanges}
                                className="mt-4"
                                disabled={!uploaded}
                            >
                                Save changes and encrypt
                            </Button>

                            <P className="mt-5">Upload your encrypted file on your cloud storage and then provide the file’s URL here:</P>
                            <Text
                                onCommit={(datasetUrl) => {
                                    updateProductDatasetInfo({
                                        ...product.datasetInfo,
                                        datasetUrl,
                                    })
                                }}
                                placeholder={I18n.t('editProductPage.processDataset.placeholder.link')}
                                disabled={!!disabled}
                                selectAllOnFocus
                                smartCommit
                                error={publishAttempted && !isUrlValid ? urlMessage : undefined}
                                className=""
                            />
                        </div>
                    }
                </Details>
                {
                    type === 'ANALYTICS' && sector === 'Health and wellness' &&
                    uploaded &&
                    <div>
                        <Translate
                            tag="p"
                            value="editProductPage.policies.columns"
                            className="mt-5 mb-4"
                        />
                        {columns.map((col, idx) => (
                            <ColumnsInputs
                                key={col}
                                col={col}
                                idx={idx}
                                handleSubmit={handleSubmit}
                                validated={validated}
                                setValidated={setValidated}
                            />
                        ))}
                        <Button
                            kind="primary"
                            size="mini"
                            outline
                            onClick={saveChanges}
                            className="mt-4"
                            disabled={!validated}
                        >
                            Save changes and encrypt
                        </Button>
                        <P className="mt-5">Upload your encrypted file on your cloud storage and then provide the file’s URL here:</P>
                        <Text
                            onCommit={(datasetUrl) => {
                                updateProductDatasetInfo({
                                    ...product.datasetInfo,
                                    datasetUrl,
                                })
                            }}
                            placeholder={I18n.t('editProductPage.processDataset.placeholder.link')}
                            disabled={!!disabled}
                            selectAllOnFocus
                            smartCommit
                            className="w-50"
                            error={publishAttempted && !isUrlValid ? urlMessage : undefined}
                        />
                    </div>
                }
                {
                    type === 'BATCH' &&
                    <Text
                        onCommit={(datasetUrl) => {
                            updateProductDatasetInfo({
                                ...product.datasetInfo,
                                datasetUrl,
                            })
                        }}
                        placeholder={I18n.t('editProductPage.processDataset.placeholder.link')}
                        disabled={!!disabled}
                        selectAllOnFocus
                        smartCommit
                        className="w-50"
                        error={publishAttempted && !isUrlValid ? urlMessage : undefined}
                    />
                }
            </div>
        </section>
    )
}
export default ProductDataset
