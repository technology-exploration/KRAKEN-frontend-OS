// @flow

/*
    These are all type
    {
        id: label
    }
 */

// The order of these must be the same than in the smart contract
export const contractCurrencies = {
    DATA: 'DATA',
    EUR: 'EUR',
}

export const paymentCurrencies = {
    DATA: 'DATA',
    ETH: 'ETH',
    DAI: 'DAI',
}

export const DEFAULT_CURRENCY = contractCurrencies.DATA

export const MIN_UNISWAP_AMOUNT_USD = 0.1

// The order of these must be the same than in the smart contract
export const productStates = {
    NOT_DEPLOYED: 'NOT_DEPLOYED',
    DEPLOYED: 'DEPLOYED',
    DEPLOYING: 'DEPLOYING',
    UNDEPLOYING: 'UNDEPLOYING',
}
export const networks = {
    MAINNET: 'mainnet',
    SIDECHAIN: 'sidechain',
}

export const ethereumNetworks = {
    '1': 'Mainnet',
    '3': 'Ropsten',
    '4': 'Rinkeby',
    '5': 'Görli',
    '42': 'Kovan',
    '100': 'xDAI',
}

export const timeUnits = {
    second: 'second',
    minute: 'minute',
    hour: 'hour',
    day: 'day',
    week: 'week',
    month: 'month',
    year: 'year',
}

export const transactionStates = {
    STARTED: 'started', // transaction started
    PENDING: 'pending', // hash received
    CONFIRMED: 'confirmed', // mined
    FAILED: 'failed', // error
}

export const transactionTypes = {
    SET_DATA_ALLOWANCE: 'setDataAllowance',
    RESET_DATA_ALLOWANCE: 'resetDataAllowance',
    SET_DAI_ALLOWANCE: 'setDaiAllowance',
    RESET_DAI_ALLOWANCE: 'resetDaiAllowance',
    SUBSCRIPTION: 'subscription',
    CREATE_CONTRACT_PRODUCT: 'createContractProduct',
    UPDATE_CONTRACT_PRODUCT: 'updateContractProduct',
    REDEPLOY_PRODUCT: 'redeployProduct',
    UNDEPLOY_PRODUCT: 'undeployProduct',
    PAYMENT: 'payment',
    DEPLOY_DATA_UNION: 'deployDataUnion',
    UPDATE_ADMIN_FEE: 'updateAdminFee',
    SET_REQUIRES_WHITELIST: 'setRequiresWhitelist',
    WHITELIST_APPROVE: 'whitelistApprove',
    WHITELIST_REJECT: 'whitelistReject',
    BUY_ANALYTICS_PACKAGE: 'buyAnalyticsPackage',
}

export const gasLimits = {
    BUY_PRODUCT: 3e5,
    BUY_PRODUCT_WITH_ERC20: 6e5,
    APPROVE: 7e4,
}

export const dialogAutoCloseTimeout = 2000 // in milliseconds

export const maxFileSizeForImageUpload = 5242880

export const integrationKeyServices = {
    PRIVATE_KEY: 'ETHEREUM',
    ETHEREREUM_IDENTITY: 'ETHEREUM_ID',
}

export const NotificationIcon = {
    CHECKMARK: 'checkmark',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    SPINNER: 'spinner',
}

export const ProgrammingLanguages = {
    JAVASCRIPT: 'javascript',
    JAVA: 'java',
}

export const StreamrClientRepositories = {
    [ProgrammingLanguages.JAVASCRIPT]: 'https://github.com/streamr-dev/streamr-client-javascript',
    [ProgrammingLanguages.JAVA]: 'https://github.com/streamr-dev/streamr-client-java',
}

export const dataUnionMemberLimit = parseInt(process.env.DATA_UNION_PUBLISH_MEMBER_LIMIT, 10) || 0
