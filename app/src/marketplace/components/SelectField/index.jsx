// @flow

import React from 'react'
import cx from 'classnames'

import Select, { type Props as SelectProps } from '$ui/Select'
import Errors from '$ui/Errors'
import { useLastError, type LastErrorProps } from '$shared/hooks/useLastError'

import styles from './selectField.pcss'

type SelectFieldProps = LastErrorProps & SelectProps & {
    disabled?: boolean,
    errorsTheme?: any,
    className?: String,
}

export const SelectField = ({
    error,
    isProcessing,
    disabled,
    errorsTheme,
    className,
    ...inputProps
}: SelectFieldProps) => {
    const { hasError, error: lastError } = useLastError({
        error,
        isProcessing,
    })
    const castProps: any = inputProps

    return (
        <div className={className}>
            <Select
                controlClassName={cx({
                    [styles.withError]: !!hasError,
                })}
                disabled={disabled}
                {...castProps}
            />
            <Errors overlap theme={errorsTheme}>
                {!!hasError && lastError}
            </Errors>
        </div>
    )
}

export default SelectField
