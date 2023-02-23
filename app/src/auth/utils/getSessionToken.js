// @flow

import StreamrClient from 'streamr-client'

const parseError = ({ body }) => {
    const message = ((defaultMessage) => {
        try {
            return JSON.parse(body).message || defaultMessage
        } catch (e) {
            return defaultMessage
        }
    })('Something went wrong.')

    return new Error(message)
}

export default async (auth: Object): Promise<?string> => {
    console.log('AUTH ', auth)
    try {
        return await new StreamrClient({
            restUrl: process.env.STREAMR_API_URL,
            // auth: auth.provider,
            auth: {
                ethereum: auth.provider,
            },
        }).session.getSessionToken()
    } catch (e) {
        console.log('EEEE ', e)
        throw parseError(e)
    }
}
