/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Text from '$ui/Text'
import Check from '$mp/assets/check.svg'

const Ul = styled.ul`
    list-style: none;
    min-width: 300px;
    max-width: 500px;
    padding-left: 0;
    font-family: Calibri;
    position: absolute;
    z-index: 3;
    border: 0.5px solid #D5D5D5;
    background-color: white !important;
    border-radius: 5px;

    li {
        line-height: 1.5;
        font-size: 16px;
        padding: 9px 20px;
        border-radius: 10px;
        word-wrap: break-word;
    },
    li:hover{
     background-color:#F8F8F8;
     cursor: pointer;
    }
`

const TextRed = styled.p`
    color: red;
    font-size: 16px;
    margin-left: 105px;
`
const Label = styled.label`
    width: 100px;
    margin-bottom: 0;
`

const Icon = styled.img`
    color: green;
    width: 30px;
    position: relative;
    left: -35px;
    background-color: white;
    padding: 6px;
`

const ColumnsInputs = ({
    col, idx, handleSubmit, validated, setValidated,
}) => {
    const [name, setName] = useState(col)
    const [suggestions, setSuggestions] = useState([])
    const [active, setActive] = useState(false)
    const dropdownRef = useRef()

    useEffect(() => {
        function handler(event) {
            if (!dropdownRef.current?.contains(event.target)) {
                setActive(false)
            }
        }
        window.addEventListener('click', handler)
        return () => window.removeEventListener('click', handler)
    }, [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function suggestionList(search) {
        const arraySugg = []
        const firstResponse = await fetch(`https://id.nlm.nih.gov/mesh/lookup/term?label=${search}&match=exact&limit=5`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        const firstJsonResponse = await firstResponse.json()
        const firstobjInArray = await firstJsonResponse.map((object) => arraySugg.push((object.label)))
        await setSuggestions(arraySugg)

        if (arraySugg.length < 5) {
            const secondResponse = await fetch(`https://id.nlm.nih.gov/mesh/lookup/term?label=${search}&match=startswith&limit=5`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            const secondjsonResponse = await secondResponse.json()
            const objInArray = await secondjsonResponse.map((object) => arraySugg.push((object.label)))

            const filterRepeated = await arraySugg.filter((val, id) => arraySugg.indexOf(val) === id)

            const sliceArray = await filterRepeated.slice(0, 5)

            await setSuggestions(sliceArray)
        }

        if (arraySugg.length < 5) {
            const thirdResponse = await fetch(`https://id.nlm.nih.gov/mesh/lookup/term?label=${search}&match=contains&limit=5`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            const thirdJsonResponse = await thirdResponse.json()

            const objectsInArray = await thirdJsonResponse.map((object) => arraySugg.push((object.label)))

            const filterRepeated = await arraySugg.filter((val, id) => arraySugg.indexOf(val) === id)

            const sliceArray = await filterRepeated.slice(0, 5)

            await setSuggestions(sliceArray)
        }
    }

    useEffect(() => {
        suggestionList(name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name])

    const handleChange = (e) => {
        setName(e.target.value)

        if (e.target.value === '') {
            setActive(false)
        } else {
            setActive(true)
            setName(e.target.value)
            suggestionList(e.target.value)
        }
    }

    const handleName = (sugg) => {
        setName(sugg)
        setActive(false)
    }

    if ((suggestions.length >= 1) && (suggestions.find((sug) => sug.toLowerCase() === name.trim().toLowerCase()))) {
        handleSubmit(name, idx)
    } else {
        // setValidated(false)
    }

    return (
        <div
            className="mb-5 mt-2"
        >
            <div className="d-flex align-items-center justify-content-start">
                <Label>Column {idx + 1}:</Label>
                <div>
                    <Text
                        value={name}
                        onChange={(e) => handleChange(e)}
                        style={{
                            position: 'relative', display: 'inline-block',
                        }}
                    />
                    {
                        suggestions.length >= 1 && suggestions[0] !== name && active &&
                        (
                            <Ul ref={dropdownRef}>
                                {suggestions.map((sugg) => <li key={sugg} onClick={() => handleName(sugg, idx)}>{sugg}</li>)}
                            </Ul>
                        )
                    }
                </div>

                {
                    suggestions.length >= 1 && (suggestions.find((sug) => sug.toLowerCase() === name.trim().toLowerCase())) &&
                    <Icon src={Check} alt="check" />
                }
                {
                    suggestions.length >= 1 && !(suggestions.find((sug) => sug.toLowerCase() === name.trim().toLowerCase())) && !active &&
                    <Icon src="https://cdn-icons-png.flaticon.com/512/179/179386.png" />
                }
            </div>

            {
                suggestions.length === 0 && !validated && <TextRed className="nofound my-3">no matches found!</TextRed>
            }
        </div>
    )
}

export default ColumnsInputs
