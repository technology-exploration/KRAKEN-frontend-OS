// @flow

import React, { useMemo, useState } from 'react'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'
import SelectField from '$mp/components/SelectField'

const SelectFieldNarrow = styled(SelectField)`
    width: 11rem;
`

const Item = styled.span`
    margin: auto;
`

// const Row = styled.div`
//     display: grid;
//     grid-gap: 15px;
//     grid-template-columns: repeat(3, 1fr);
// `

// const StyledCheckbox = styled(Checkbox)`
//     width: 24px !important;
//     height: 24px !important;
// `

// const PurposeCheckbox = ({ id, disabled, onChange, purposes }: { id: string, disabled: boolean, onChange: Function, purposes: any }) => (
//     <CheckboxLabel htmlFor={id}>
//         <StyledCheckbox
//             id={id}
//             name={id}
//             value={purposes[id]}
//             onChange={onChange}
//             disabled={disabled}
//         />&nbsp;
//         <Translate
//             value={`editProductPage.policies.${id}`}
//             dangerousHTML
//         />
//     </CheckboxLabel>
// )

// const Item = styled(PurposeCheckbox)`
//     padding: 10px;
//     background-color: #ccc;
// `

const TimeContainer = styled.div`
    margin-top: 3.5rem;
`

const Row = styled.div`
    display: flex;
    width: 25rem;
    margin-top: 1.5rem;
    alignt-items: flex-start;
`

const TimePeriodAndPrice = () => {
    // const [purposes, setPurposes] = useState({})
    // const product = useEditableProduct()
    const [price, setPrice] = useState()
    const periods = [{
        label: 'Day', value: 0,
    }, {
        label: 'Month', value: 1,
    }, {
        label: 'Year', value: 2,
    }]
    const BuyPeriod = 'Select Period'
    const periodOptions = useMemo(() => (periods || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [periods])
    const selectedPeriod = useMemo(() => (
        periodOptions.find((o) => o.label === BuyPeriod)
    ), [periodOptions, BuyPeriod])
    return (
        <TimeContainer>
            <Translate
                tag="h3"
                value="productPage.buyersView.timePeriod"
            />
            <div>
                <Translate
                    value="productPage.buyersView.timePeriodDescription"
                />
            </div>
            <Row >
                <Item>
                    <SelectFieldNarrow
                        name="sector"
                        options={periodOptions}
                        value={selectedPeriod}
                        // onChange={(option) => updateSector(option.label)}
                        isSearchable={false}
                        // error={publishAttempted && !isSectorValid ? sectorMessage : undefined}
                        // disabled={!!disabled}
                        // errorsTheme={MarketplaceTheme}
                        defaultValue={{
                            label: 'Day', value: 0,
                        }}
                    />
                </Item>
                <Item>

                    <Translate
                        value="productPage.buyersView.price"
                    />
                </Item>
                <Item>
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        size="4"
                    />
                    <Translate
                        value="productPage.buyersView.Data"
                    />
                </Item>
            </Row>
        </TimeContainer>
    )
}

export default TimePeriodAndPrice
