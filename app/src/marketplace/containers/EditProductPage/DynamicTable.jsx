/* eslint-disable react-hooks/exhaustive-deps */
// @flow

import React, { useState, useCallback, useContext } from 'react'
import styled from 'styled-components'
import SelectField from '$mp/components/SelectField'
import Text from '$ui/Text'
import Button from '$shared/components/Button'
import { Context as EditControllerContext } from './EditControllerProvider'

const DynamicTable = ({ updateFormats }: { updateFormats: any }) => {
    const [items, setItems] = useState([])
    const [input, setInput] = useState('')
    const [megabytes, setMegabytes] = useState('')
    const [instructions, setInstructions] = useState('')
    const [filetype, setFiletype] = useState({
        label: 'CSV', value: 0,
    })
    const { publishAttempted } = useContext(EditControllerContext)

    const addItem = useCallback(() => {
        setItems([...items, {
            input, megabytes, instructions, filetype,
        }])
        setInput('')
        setMegabytes('')
        setInstructions('')
        setFiletype({
            label: 'CSV', value: 0,
        })
        updateFormats([...items, {
            input, megabytes, instructions, filetype,
        }])
    }, [items, input, megabytes, instructions, filetype, updateFormats])

    const deleteItem = useCallback((ind) => {
        setItems(items.filter((_, i) => i !== ind))
        updateFormats(items.filter((_, i) => i !== ind))
    })

    const updateItemValue = useCallback((ind, value) => {
        setItems(items.map((v, i) => {
            if (i === ind) {
                return value
            }
            return v
        }))
    }, [items])

    return (
        <div>
            {items.map((o, i) =>
                (
                    <div key={i.toString()} className="mb-4">
                        <P>File {i + 1}</P>
                        <div className="d-flex align-items-baseline">
                            <Text
                                onChange={(e) => updateItemValue(i, e.target.value)}
                                value={o.input}
                                selectAllOnFocus
                                smartCommit
                                // error={publishAttempted && !input ? 'Filename is required' : undefined}
                                style={{
                                    width: 140,
                                }}
                            />

                            <SelectFieldNarrow
                                name="filetype"
                                options={[{
                                    label: 'CSV', value: 0,
                                }, {
                                    label: 'TXT', value: 1,
                                }]}
                                value={o.filetype}
                                onChange={(option) => updateItemValue(i, option)}
                            />

                            <Text
                                onChange={(e) => updateItemValue(i, e.target.value)}
                                value={o.megabytes}
                                selectAllOnFocus
                                smartCommit
                                // error={publishAttempted && !input ? 'Filesize is required' : undefined}
                                style={{
                                    width: 70,
                                }}
                            />

                            <P className="ml-1 mr-3">MB</P>

                            <Text
                                onChange={(e) => updateItemValue(i, e.target.value)}
                                placeholder="Add instructions (optional)"
                                value={o.instructions}
                                selectAllOnFocus
                                smartCommit
                            />

                            <Button
                                kind="primary"
                                size="mini"
                                outline
                                onClick={() => deleteItem(i)}
                                className="ml-2"
                            >
                                Delete
                            </Button>

                        </div>
                    </div>

                ))
            }

            <div className="d-flex align-items-baseline mt-5">
                <Text
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Filename"
                    value={input}
                    selectAllOnFocus
                    smartCommit
                    // error={publishAttempted && !input ? 'Filename is required' : undefined}
                    style={{
                        width: 140,
                    }}
                />

                <SelectFieldNarrow
                    name="filetype"
                    options={[{
                        label: 'CSV', value: 0,
                    }, {
                        label: 'TXT', value: 1,
                    }]}
                    value={filetype}
                    onChange={(option) => setFiletype(option)}
                />

                <Text
                    onChange={(e) => setMegabytes(e.target.value)}
                    placeholder="Size"
                    value={megabytes}
                    selectAllOnFocus
                    smartCommit
                    // error={publishAttempted && !input ? 'Filesize is required' : undefined}
                    style={{
                        width: 100,
                    }}
                />

                <P className="ms-1 me-3">MB</P>

                <Text
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Add instructions (optional)"
                    value={instructions}
                    selectAllOnFocus
                    smartCommit
                />
                <Button
                    kind="primary"
                    size="mini"
                    outline
                    onClick={addItem}
                    disabled={!megabytes || !input}
                    className="ms-2"
                >
                    Add
                </Button>
            </div>
        </div>
    )
}

const SelectFieldNarrow = styled(SelectField)`
            width: 6rem;
            margin-right: 10px;
        `

const P = styled.p`
font-size: 16px;
`

export default DynamicTable
