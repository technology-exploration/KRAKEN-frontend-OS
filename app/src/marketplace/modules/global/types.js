// @flow

import type { NumberString, ErrorInUi, PayloadAction } from '$shared/flowtype/common-types'

export type dataPerEurAction = PayloadAction<{
    dataPerUsd: number,
}>
export type dataPerEurActionCreator = (NumberString) => dataPerEurAction

export type GlobalEthereumErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type GlobalEthereumErrorActionCreator = (ErrorInUi) => GlobalEthereumErrorAction
