// @flow

import React, { type Context } from 'react'

type TokenAndMethod = {
    token?: string,
    krakenToken?: string,
    method?: string,
}

export type Props = {
    token: ?string,
    krakenToken: ?string,
    setSessionToken: ?(?TokenAndMethod) => void,
}

const defaultContext: Props = {
    token: null,
    krakenToken: null,
    setSessionToken: null,
}

export default (React.createContext(defaultContext): Context<Props>)
