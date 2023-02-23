/* eslint-disable react/no-unused-state */

import React, { useCallback, useEffect, useReducer, useMemo } from 'react'
import Context from '$auth/contexts/Session'
import { setToken, getToken, setKrakenToken, getKrakenToken, setMethod, getMethod } from '$shared/utils/sessionToken'

function SessionProvider(props) {
    const { children } = props

    const [{ token, krakenToken, method }, updateState] = useReducer((state, nextState) => ({
        token: nextState.token ? nextState.token : state.token,
        krakenToken: nextState.krakenToken ? nextState.krakenToken : state.krakenToken,
        method: nextState.method ? nextState.method : state.method,
    }), {
        token: getToken(),
        krakenToken: getKrakenToken(),
        method: getMethod(),
    })

    useEffect(() => {
        // update storage when token changes
        setToken(token)
    }, [token])

    useEffect(() => {
        // update storage when token changes
        setKrakenToken(krakenToken)
    }, [krakenToken])

    useEffect(() => {
        // update storage when method changes
        setMethod(method)
    }, [method])

    const setSessionToken = useCallback(({ token: nextToken, krakenToken: nextKrakenToken, method: nextMethod }) => {
        updateState({
            token: nextToken,
            krakenToken: nextKrakenToken,
            method: nextMethod,
        })
    }, [])

    const sessionProvider = useMemo(() => ({
        setSessionToken,
        token,
        krakenToken,
    }), [
        setSessionToken,
        token,
        krakenToken,
    ])

    return (
        <Context.Provider value={sessionProvider}>
            {children}
        </Context.Provider>
    )
}

export default SessionProvider
