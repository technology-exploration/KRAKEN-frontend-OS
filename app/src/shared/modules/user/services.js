// @flow

import { get, post, put, del } from '$shared/utils/api'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { User } from '$shared/flowtype/user-types'
import type { ProductId } from '$mp/flowtype/product-types'
import routes from '$routes'

export const getUserData = (): ApiResult<User> => get({
    url: routes.api.currentUser.index({
        noCache: Date.now(),
    }),
})

export const putUser = (user: User): ApiResult<User> => put({
    url: routes.api.currentUser.index(),
    data: user,
})

export const uploadProfileAvatar = (image: File): Promise<void> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }

    const data = new FormData()
    data.append('file', image, image.name)

    return post({
        url: routes.api.currentUser.image(),
        data,
        options,
    })
}

export const deleteUserAccount = (): ApiResult<null> => del({
    url: routes.api.currentUser.index(),
})

export const getProductSeller = (id: User): ApiResult<User> => get({
    url: routes.api.currentUser.productSeller({
        id,
    }),
})

export const getUserInfo = (id: ProductId): ApiResult<User> => get({
    url: routes.api.userInfo({
        id,
    }),
})

export const WhitelistSubscription = (id: ProductId): ApiResult<User> => post({
    url: routes.api.findSubscriptions({
        id,
    }),
})
