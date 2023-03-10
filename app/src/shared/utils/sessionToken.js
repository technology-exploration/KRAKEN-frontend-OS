import { isLocalStorageAvailable } from '$shared/utils/storage'

export const SESSION_TOKEN_KEY = 'session.token'
export const SESSION_LOGIN_TIME = 'session.loginTime'
export const SESSION_LOGIN_METHOD = 'session.loginMethod'
export const EXPIRES_AT_VALID_HOURS = 6
export const SESSION_KRAKEN_TOKEN_KEY = 'session.krakenToken'
export const SESSION_KRAKEN_LOGIN_TIME = 'session.krakenLoginTime'

const cache = {
    [SESSION_TOKEN_KEY]: null,
    [SESSION_LOGIN_TIME]: null,
    [SESSION_LOGIN_METHOD]: null,
    [SESSION_KRAKEN_TOKEN_KEY]: null,
    [SESSION_KRAKEN_LOGIN_TIME]: null,
}

const storage = isLocalStorageAvailable() ? window.localStorage : {
    setItem: (key, value) => {
        cache[key] = value || null
    },
    getItem: (key) => cache[key] || null,
    removeItem: (key) => storage.setItem(key, null),
}

export const setToken = (token) => {
    if (token) {
        storage.setItem(SESSION_TOKEN_KEY, token)
        storage.setItem(SESSION_LOGIN_TIME, new Date())
    } else {
        storage.removeItem(SESSION_TOKEN_KEY)
        storage.removeItem(SESSION_LOGIN_TIME)
    }
}

export const setKrakenToken = (token) => {
    if (token) {
        storage.setItem(SESSION_KRAKEN_TOKEN_KEY, token)
        storage.setItem(SESSION_KRAKEN_LOGIN_TIME, new Date())
    } else {
        storage.removeItem(SESSION_KRAKEN_TOKEN_KEY)
        storage.removeItem(SESSION_KRAKEN_LOGIN_TIME)
    }
}

const expired = (date) => (
    Date.now() > new Date(date || 0).getTime() + (EXPIRES_AT_VALID_HOURS * 1000 * 3600)
)

export const getToken = () => (
    (
        (
            !expired(storage.getItem(SESSION_LOGIN_TIME))
            &&
            !expired(storage.getItem(SESSION_KRAKEN_LOGIN_TIME))
        )
            && storage.getItem(SESSION_TOKEN_KEY)) || null
)

export const getKrakenToken = () => (
    (
        (
            !expired(storage.getItem(SESSION_LOGIN_TIME))
            &&
            !expired(storage.getItem(SESSION_KRAKEN_LOGIN_TIME))
        )
            && storage.getItem(SESSION_KRAKEN_TOKEN_KEY)) || null
)

export const setMethod = (method) => {
    if (method) {
        storage.setItem(SESSION_LOGIN_METHOD, method)
    } else {
        storage.removeItem(SESSION_LOGIN_METHOD)
    }
}

export const getMethod = () => (
    storage.getItem(SESSION_LOGIN_METHOD) || null
)
