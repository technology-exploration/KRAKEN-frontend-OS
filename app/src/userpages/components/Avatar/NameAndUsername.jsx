import React from 'react'
import styled from 'styled-components'

const Name = styled.div`
  color: #323232;
  font-family: var(--sans);
  letter-spacing: 0;
  font-size: 20px;
  line-height: 26px;
`

const UnstyledNameAndUsername = ({ name, children, ...props }) => (
    <div {...props} className="d-flex align-items-center">
        <Name>{name}</Name>
    </div>
)

const NameAndUsername = styled(UnstyledNameAndUsername)`
  flex-grow: 1;
`

export default NameAndUsername
