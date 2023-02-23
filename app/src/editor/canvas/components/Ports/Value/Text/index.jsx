// @flow

import React, { useState } from 'react'
import cx from 'classnames'
import EditableText from '$shared/components/EditableText'
import { type CommonProps } from '..'
import styles from './text.pcss'

type Props = CommonProps & {
    className?: ?string,
}

const Text = ({
    className,
    disabled,
    onChange,
    value,
    ...props
}: Props) => {
    const [editing, setEditing] = useState(false)
    const [valid, setValid] = useState(true)

    return (
        <EditableText
            {...props}
            className={cx(styles.root, className, {
                [styles.editing]: editing,
                [styles.disabled]: disabled,
                [styles.valid]: valid,

            })}
            blankClassName={styles.blank}
            commitEmpty
            valid={valid}
            setValid={setValid}
            disabled={disabled}
            editing={editing}
            editOnFocus
            onCommit={onChange}
            setEditing={setEditing}
        >
            {value}
        </EditableText>
    )
}

export default Text
