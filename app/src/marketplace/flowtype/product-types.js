// @flow

import { productStates } from '$shared/utils/constants'
import { productTypes } from '$mp/utils/constants'
import type { StreamIdList, StreamId } from '$shared/flowtype/stream-types'
import type {
    ContractCurrency,
    PaymentCurrency,
    NumberString,
    TimeUnit,
} from '$shared/flowtype/common-types'
import type { Address } from '$shared/flowtype/web3-types'
import type { CategoryId } from './category-types'

export type ProductId = string
export type ProductState = $Keys<typeof productStates>

export type ProductType = $Values<typeof productTypes>

export type PendingChanges = {
    adminFee?: number,
    requiresWhitelist?: boolean,
}

export type TermsOfUse = {
    commercialUse: boolean,
    redistribution: boolean,
    reselling: boolean,
    storage: boolean,
    termsName: ?string,
    termsUrl: ?string,
}

export type FileStructureAndFormats = {
    filename: string,
    format: string,
    filesize: number,
}

export type AutomatedConsequences = {
    automated_placing: Boolean,
    hiring_assessments: Boolean,
    clinical_risks_assessment: Boolean,
    diagnostic_or_treatment: Boolean,
}

export type Purposes = {
    marketing: Boolean,
    publicly_funded_research: Boolean,
    private_research: Boolean,
    managment: Boolean,
    automated: Boolean,
    study_recommendations: Boolean,
    job_offers: Boolean,
    statistical_research: Boolean,
}

export type Policies = {
    hasconsent: boolean,
    protectionType: string,
    secondUseConsent: boolean,
    recipientType: string[],
    transferToCountry: Boolean,
    storagePeriod: number,
    whoCanAccessData: string[],
    personalData: boolean,
    personalDataOfOthers: boolean,
    sensitiveData: boolean,
    categories: boolean,
    marketing: boolean,
    publicly_funded_research: boolean,
    private_research: boolean,
    managment: boolean,
    automated: boolean,
    sharedWith: string,
    approvedUsers: string[],
    approvedOrgs?: string[],
}

export type ContactDetails = {
    url: ?string,
    email: ?string,
    social1: ?string,
    social2: ?string,
    social3: ?string,
    social4: ?string,
}

export type DatasetInfo = {
    keyShares: string[],
    datasetUrl: string,
    randomNonce: string,
    publisherPubKey: string,
}

export type SharingCountries = {
    euCountries: Boolean,
    thirdCountries: Boolean,
    allOther: Boolean,
}

export type Product = {
    adminFee?: number,
    key?: string,
    id: ?ProductId,
    name: string,
    description: string,
    shortDescription: string,
    university: string,
    studyProgram: string,
    course: string,
    tags: Object[],
    formats: FileStructureAndFormats,
    owner: string,
    imageUrl: ?string,
    newImageToUpload?: ?File,
    thumbnailUrl: ?string,
    state?: ProductState,
    created?: Date,
    updated?: Date,
    // ownerId: String,
    // category: ?CategoryId,
    category: String,
    streams?: StreamIdList,
    previewStream: ?StreamId,
    previewConfigJson?: ?string,
    minimumSubscriptionInSeconds?: number,
    ownerAddress: Address,
    beneficiaryAddress: Address,
    pricePerSecond: NumberString,
    priceCurrency: ContractCurrency,
    timeUnit?: ?TimeUnit,
    price?: NumberString,
    isFree?: boolean,
    type?: ProductType,
    sector: string,
    anonymizeDataset: boolean,
    requiresWhitelist?: boolean,
    pendingChanges?: PendingChanges,
    termsOfUse: TermsOfUse,
    contact: ?ContactDetails,
    policies: Policies,
    datasetInfo: DatasetInfo,
    columnVariables?: string[],
    numberOfRecords?: number,
    dataShareCountries?: SharingCountries,
    purposes?: Purposes,
    automatedConsequences?: AutomatedConsequences,
}

export type DataUnionId = $ElementType<Product, 'beneficiaryAddress'>

export type MemberCount = {
    total: number,
    active: number,
    inactive: number,
}
export type DataUnion = {
    id: DataUnionId,
    adminFee: number | string,
    joinPartStreamId: StreamId,
    owner: Address,
    memberCount?: MemberCount,
}
export type DataUnionStat = {
    id: DataUnionId,
    memberCount: MemberCount,
    totalEarnings: number,
}

export type ProductSubscriptionId = string

export type ProductSubscriptionIdList = Array<ProductSubscriptionId>

export type ProductSubscription = {
    id: ProductSubscriptionId,
    address?: Address,
    user?: string,
    endsAt: Date,
    product: Product,
    dateCreated: Date,
    lastUpdated: Date,
}

export type ProductSubscriptionList = Array<ProductSubscription>

export type SmartContractProduct = {
    id: ProductId,
    name: $ElementType<Product, 'name'>,
    ownerAddress: $ElementType<Product, 'ownerAddress'>,
    beneficiaryAddress: $ElementType<Product, 'beneficiaryAddress'>,
    pricePerSecond: $ElementType<Product, 'pricePerSecond'>,
    priceCurrency: $ElementType<Product, 'priceCurrency'>,
    minimumSubscriptionInSeconds: $ElementType<Product, 'minimumSubscriptionInSeconds'>,
    state: $ElementType<Product, 'state'>,
    requiresWhitelist: $ElementType<Product, 'requiresWhitelist'>,
    type: $ElementType<Product, 'type'>,
}

export type WhitelistStatus = 'added' | 'removed' | 'subscribed'

export type WhitelistedAddress = {
    address: Address,
    status: WhitelistStatus,
    isPending: boolean,
}

export type Subscription = {
    productId: ProductId,
    endTimestamp: number
}

export type ProductIdList = Array<ProductId>

export type ProductList = Array<Product>

export type ProductListPageWrapper = {
    products: ProductList,
    hasMoreProducts: boolean,
}
export type ProductEntities = {
    [ProductId]: Product,
}

export type SmartContractProductEntities = {
    [ProductId]: SmartContractProduct,
}

export type SearchFilter = {
    search: string,
    sector?: ?string,
    category?: ?string,
    programme?: ?string,
    course?: ?string,
}

export type CategoryFilter = CategoryId

export type SortByFilter = string

export type ProductTypeFilter = string

export type MaxPriceFilter = NumberString

export type AnyFilter = SearchFilter | CategoryFilter | SortByFilter | ProductTypeFilter

export type Filter = {
    searchFilter: SearchFilter,
    categories?: ?CategoryFilter,
    sortBy?: ?SortByFilter,
    maxPrice?: ?MaxPriceFilter,
    type?: ?ProductTypeFilter,
}

export type AccessPeriod = {
    time: NumberString,
    timeUnit: TimeUnit,
    paymentCurrency: PaymentCurrency,
    price: ?NumberString,
    approxEur: ?NumberString,
}

export type DataUnionSecretId = string

export type DataUnionSecret = {
    id: DataUnionSecretId,
    name: string,
    secret: string,
    contractAddress: Address,
}
