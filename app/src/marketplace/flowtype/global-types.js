// @flow

declare class process {
    static env: {
        PORT: string,
        NODE_ENV: string,
        PLATFORM_ORIGIN_URL: string,
        STREAMR_API_URL: string,
        KRAKEN_API_URL: url,
        KRAKEN_WS_URL: url,
        STREAMR_URL: string,
        STREAMR_WS_URL: string,
        GOOGLE_ANALYTICS_ID: string,
        [key: string]: ?string
    }
}
