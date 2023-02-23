import React from 'react'
import styled, { css } from 'styled-components'

const TopTheme = {
    left: '50%',
    top: 'auto',
    bottom: 'calc(100% + 8px)',
    right: 'auto',
    transform: 'translateX(-50%)',
}

const BottomTheme = {
    left: '50%',
    top: 'calc(100% + 8px)',
    bottom: 'auto',
    right: 'auto',
    transform: 'translateX(-50%)',
}

const Parent = styled.div``

const Root = styled.div`
    position: relative;
    display: inline-block;
    line-height: 1;

    ${({ tooltip, disabled }) => !!tooltip && !disabled && css`
        ::after {
            content: "${tooltip}";
            visibility: hidden;
            opacity: 0;
            transition: 0s all;
            position: absolute;
            background-color: #323232;
            border-radius: 2px;
            color: white;
            font-size: 12px;
            line-height: 16px;
            padding: 2px 6px;
            white-space: nowrap;
            z-index: 1;
            text-align: center;

            top: ${({ theme }) => theme.top};
            bottom: ${({ theme }) => theme.bottom};
            left: ${({ theme }) => theme.left};
            right: ${({ theme }) => theme.right};
            transform: ${({ theme }) => theme.transform};
        }

        ${Parent}:hover &::after,
        :hover::after {
            transition-delay: 0.5s;
            visibility: visible;
            opacity: 1;
        }
    `}
`

const UnstyledTooltip = ({ value, placement = TopTheme, ...props }) => (
    <Root {...props} tooltip={value} theme={placement} />
)

const Tooltip = styled(UnstyledTooltip)``

Object.assign(Tooltip, {
    BOTTOM: BottomTheme,
    Parent,
    Root,
    TOP: TopTheme,
})

export default Tooltip
