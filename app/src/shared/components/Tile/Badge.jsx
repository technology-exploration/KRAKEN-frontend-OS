import React from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import Link from '$shared/components/Link'

const SharedTheme = {
    backgroundColor: '#525252',
}

const Badge = styled.div`
    align-items: center;
    background-color: #0324ff;
    background-color: ${({ theme }) => theme.backgroundColor};
    border-bottom-left-radius: ${({ bottom, left }) => (bottom || left ? 0 : 2)}px;
    border-bottom-right-radius: ${({ bottom, left, right }) => (bottom || (!left && right) ? 0 : 2)}px;
    border-top-left-radius: ${({ top, left }) => (top || left ? 0 : 2)}px;
    border-top-right-radius: ${({ top, left, right }) => (top || (!left && right) ? 0 : 2)}px;
    color: white !important;
    cursor: default;
    display: flex;
    font-size: 12px;
    height: 24px;
    line-height: 1em;
    padding: 0 12px;
    pointer-events: none;
    user-select: none;

    a& {
        cursor: pointer;
        pointer-events: auto;
        text-decoration: none !important;
    }

    ${({ top, left, right, bottom }) => !!(top || left || right || bottom) && css`
        position: absolute;
    `}

    ${({ bottom, top }) => !!bottom && !top && css`
        bottom: 0;
    `}

    ${({ left }) => !!left && css`
        left: 0;
    `}

    ${({ right, left }) => !!right && !left && css`
        right: 0;
    `}

    ${({ top }) => !!top && css`
        top: 0;
    `}

    > * + * {
        margin-left: 12px;
    }
`

const AnalyticsBadge = styled.div`
    align-items: center;
    background-color: green;
    background-color: ${({ theme }) => theme.backgroundColor};
    border-bottom-left-radius: ${({ bottom, left }) => (bottom || left ? 0 : 2)}px;
    border-bottom-right-radius: ${({ bottom, left, right }) => (bottom || (!left && right) ? 0 : 2)}px;
    border-top-left-radius: ${({ top, left }) => (top || left ? 0 : 2)}px;
    border-top-right-radius: ${({ top, left, right }) => (top || (!left && right) ? 0 : 2)}px;
    color: white !important;
    cursor: default;
    display: flex;
    font-size: 12px;
    height: 24px;
    line-height: 1em;
    padding: 0 12px;
    pointer-events: none;
    user-select: none;

    a& {
        cursor: pointer;
        pointer-events: auto;
        text-decoration: none !important;
    }

    ${({ top, left, right, bottom }) => !!(top || left || right || bottom) && css`
        position: absolute;
    `}

    ${({ bottom, top }) => !!bottom && !top && css`
        bottom: 0;
    `}

    ${({ left }) => !!left && css`
        left: 0;
    `}

    ${({ right, left }) => !!right && !left && css`
        right: 0;
    `}

    ${({ top }) => !!top && css`
        top: 0;
    `}

    > * + * {
        margin-left: 12px;
    }
`

// background-color: ${({ theme }) => theme.backgroundColor};
const BatchBadge = styled.div`
    align-items: center;
    background-color: black;
    border-bottom-left-radius: ${({ bottom, left }) => (bottom || left ? 0 : 2)}px;
    border-bottom-right-radius: ${({ bottom, left, right }) => (bottom || (!left && right) ? 0 : 2)}px;
    border-top-left-radius: ${({ top, left }) => (top || left ? 0 : 2)}px;
    border-top-right-radius: ${({ top, left, right }) => (top || (!left && right) ? 0 : 2)}px;
    color: white !important;
    cursor: default;
    display: flex;
    font-size: 12px;
    height: 24px;
    line-height: 1em;
    padding: 0 12px;
    pointer-events: none;
    user-select: none;

    a& {
        cursor: pointer;
        pointer-events: auto;
        text-decoration: none !important;
    }

    ${({ top, left, right, bottom }) => !!(top || left || right || bottom) && css`
        position: absolute;
    `}

    ${({ bottom, top }) => !!bottom && !top && css`
        bottom: 0;
    `}

    ${({ left }) => !!left && css`
        left: 0;
    `}

    ${({ right, left }) => !!right && !left && css`
        right: 0;
    `}

    ${({ top }) => !!top && css`
        top: 0;
    `}

    > * + * {
        margin-left: 12px;
    }
`

const DataUnionBadge = (props) => (
    <Badge {...props}>
        <span>Data Union</span>
    </Badge>
)
const AnalyticsProductBadge = (props) => (
    <AnalyticsBadge {...props}>
        <span>Analytics</span>
    </AnalyticsBadge>
)
const BatchProductBadge = (props) => (
    <BatchBadge {...props}>
        <span>Batch</span>
    </BatchBadge>
)

const SharedBadge = (props) => (
    <Badge {...props} theme={SharedTheme}>
        <span>Shared</span>
    </Badge>
)

const UnstyledIconBadge = ({ forwardAs, children, icon, ...props }) => (
    <Badge {...props} as={forwardAs}>
        <SvgIcon name={icon} />
        {children != null && (
            <div>{children}</div>
        )}
    </Badge>
)

const IconBadge = styled(UnstyledIconBadge)`
    svg {
        height: 12px;
        width: auto;
    }
`

const BadgeLink = ({
    left,
    top,
    bottom,
    right,
    ...props
}) => (
    <Link {...props} />
)

Object.assign(Badge, {
    Link: styled(BadgeLink)``,
})

export {
    DataUnionBadge,
    AnalyticsProductBadge,
    BatchProductBadge,
    IconBadge,
    SharedBadge,
    SharedTheme,
}

export default Badge
