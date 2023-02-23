// @flow

import { getToken, getKrakenToken } from '$shared/utils/sessionToken'

export default (kraken: boolean) => {
    const token: ?string = kraken ? getKrakenToken() : getToken()

    return token ? {
        Authorization: `Bearer ${token}`,
    } : {}
}
