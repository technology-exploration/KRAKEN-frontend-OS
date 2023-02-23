// @flow

import React, { forwardRef } from 'react'
import { compose } from 'redux'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import FlushHistoryDecorator, { type Props as FlushHistoryProps } from './FlushHistoryDecorator'
import OnCommitDecorator, { type Props as OnCommitProps } from './OnCommitDecorator'
import RevertOnEscapeDecorator, { type Props as RevertOnEscapeProps } from './RevertOnEscapeDecorator'
import SelectAllOnFocusDecorator, { type Props as SelectAllOnFocusProps } from './SelectAllOnFocusDecorator'
import StyledInput from './StyledInput'

export { SpaciousTheme } from './StyledInput'

type Props =
    & FlushHistoryProps
    & OnCommitProps
    & RevertOnEscapeProps
    & SelectAllOnFocusProps
    & {
        tag: 'input' | 'textarea',
        unstyled?: boolean,
        error?: boolean,
    }

const Text = ({ tag: Tag = 'input', error, unstyled, ...props }: Props, ref: any) => (
    unstyled ? (
        <Tag {...props} ref={ref} />
    ) : (
        <div>
            <StyledInput {...props} as={Tag} ref={ref} />
            {
                error && (
                    <Errors
                        theme={MarketplaceTheme}
                    >
                        {error}
                    </Errors>
                )}
        </div>
    )
)

const EnhancedText = compose(
    FlushHistoryDecorator,
    OnCommitDecorator,
    SelectAllOnFocusDecorator,
    RevertOnEscapeDecorator,
)(forwardRef(Text))

EnhancedText.displayName = 'Text'

export default EnhancedText
