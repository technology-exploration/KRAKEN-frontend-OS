/* eslint-disable flowtype/no-types-missing-file-annotation */
/* eslint-disable camelcase */
/* eslint-disable max-len */

import React from 'react'
import styled from 'styled-components'
import { Translate } from 'react-redux-i18n'
import { useSelector } from 'react-redux'
import { selectUserData } from '$shared/modules/user/selectors'
import type { Product } from '$mp/flowtype/product-types'
import { MEDIUM } from '$shared/utils/styled'
import Segment from '$shared/components/Segment'
import ProductPage from '$shared/components/ProductPage'

type Props = {
    className?: string,
    product: Product,
}

const PolicyValue = styled.div`
    float: right;
    width: 300px;
    text-align: left;
`

const PolicyTitle = styled.div`
    display: inline-block;
    width: 500px;
    margin-left: 0px;
`

const PolicyContainer = styled.div`
    display: inline;
`

const purposesCalculator = (product) => {
    const ret = []
    if (product?.purposes?.marketing) {
        ret.push('Marketing')
    }
    if (product?.purposes?.publicly_funded_research) {
        ret.push('Publicly funded research')
    }
    if (product?.purposes?.private_research) {
        ret.push('Private research')
    }
    if (product?.purposes?.managment) {
        ret.push('Management or improvement of business services')
    }
    if (product?.purposes?.automated) {
        ret.push('Automated decision-making, eg. artificial intelligence (including profiling)')
    }
    if (product?.purposes?.study_recommendations) {
        ret.push('Study recommendations')
    }
    if (product?.purposes?.job_offers) {
        ret.push('Job offers')
    }
    if (product?.purposes?.statistical_research) {
        ret.push('Statistical research')
    }
    if (ret.length === 0) {
        ret.push('N/A')
    }
    return ret
}

const peopleAccessCalculator = (product) => {
    const ret = []
    if (product.sector === 'Education' && product.policies.recipientType.includes('categories')) {
        ret.push('Educational institutions')
        ret.push('Private companies')
        ret.push('Public instutitions')
        ret.push('Public research centers')
        ret.push('Public research institutions')
        ret.push('HR agencies')
    } else if (product.sector === 'Health and wellness' && product.policies.recipientType.includes('categories')) {
        ret.push('Public hospitals')
        ret.push('Private hospitals')
        ret.push('Private research centers')
        ret.push('Public research centers')
        ret.push('Other non-profits')
        ret.push('Governments')
        ret.push('Private companies (including consultancies, services, technology)')
    } else {
        if (product.policies.recipientType.includes('public_hospitals')) {
            ret.push('Public hospitals')
        }
        if (product.policies.recipientType.includes('private_hospitals')) {
            ret.push('Private hospitals')
        }
        if (product.policies.recipientType.includes('private_research_centers')) {
            ret.push('Private research centers')
        }
        if (product.policies.recipientType.includes('public_research_centers')) {
            ret.push('Public research centers')
        }
        if (product.policies.recipientType.includes('other')) {
            ret.push('Other non-profits')
        }
        if (product.policies.recipientType.includes('governments')) {
            ret.push('Governments')
        }
        if (product.policies.recipientType.includes('private_companies')) {
            ret.push('Private companies')
        }
        if (product.policies.recipientType.includes('educational_institutions')) {
            ret.push('Educational institutions')
        }
        if (product.policies.recipientType.includes('public_institutions')) {
            ret.push('Public instutitions')
        }
        if (product.policies.recipientType.includes('public_research_institutions')) {
            ret.push('Public research institutions')
        }
        if (product.policies.recipientType.includes('hr_agencies')) {
            ret.push('HR agencies')
        }
    }
    return ret
}

const UnstyledPolicies = ({ product, ...props }: Props) => {
    const currentUser = useSelector(selectUserData)

    if (product == null) {
        return null
    }

    return (
        <Segment {...props}>
            <Segment.Header>
                <Translate value="Data protection and permissions" />
            </Segment.Header>
            <Segment.Body pad>
                <div>
                    Data protection
                    <PolicyValue>{product.policies.protectionType && product.policies.protectionType}</PolicyValue>
                    <ProductPage.Separator />
                </div>
                <div>
                    Does the data contain personal data?
                    <PolicyValue>{product.policies.personalData === false && 'No'}
                        {product.policies.personalData && product.policies.personalData === true && 'Yes'}
                    </PolicyValue>
                    <ProductPage.Separator />
                </div>

                <div>
                    Has informed, explicit and free consent been obtained <br />
                    from all data subjects whose data is included?
                    <PolicyValue>{currentUser.institutionalAffiliation === 'Yes' && product.policies.personalDataOfOthers ? 'Yes' : 'N/A'}</PolicyValue>
                    <ProductPage.Separator />
                </div>

                <PolicyContainer>
                    <PolicyTitle>
                        The purposes specified by subjects<br />
                        other than yourself for sharing their<br />
                        data as stated in their consent:
                    </PolicyTitle>
                    <PolicyValue>
                        {purposesCalculator(product).map((purpose) => <div key={purpose}>{purpose}</div>)}
                    </PolicyValue>
                    <ProductPage.Separator />
                </PolicyContainer>
                <PolicyContainer>
                    <PolicyTitle>
                        Who can access and use this data?<br /><br /><br /><br /><br /><br /><br /><br />
                    </PolicyTitle>
                    <PolicyValue>
                        {
                            ((product.type === 'ANALYTICS' && product.sector === 'Health and wellness') || (product.sector === 'Education')) &&
                        peopleAccessCalculator(product).map((person) => <div key={person}>{person}</div>)
                        }
                        {
                            (product.type !== 'ANALYTICS' && product.sector === 'Health and wellness') &&
                            product.policies.approvedOrgs.length && product.policies.approvedOrgs.map((company) => <div key={company}>{company}</div>)
                        }
                    </PolicyValue>
                    <ProductPage.Separator />
                </PolicyContainer>
                <div>
                    <PolicyTitle>
                        Data can be shared in the following countries<br /><br /><br /><br /><br /><br /><br />
                    </PolicyTitle>
                    <PolicyValue>
                        {product.dataShareCountries && product.dataShareCountries.euCountries && 'EU/EEA countries'}
                        {product.dataShareCountries && product.dataShareCountries.thirdCountries && 'EU/EEA countries and non-EU/EEA countries with an adequacy decision'}
                        {product.dataShareCountries && product.dataShareCountries.allOther && 'All countries of the world, including non- EU/EEA countries without an adequacy decision.'}
                    </PolicyValue>
                </div>
            </Segment.Body>
        </Segment>
    )
}

const Policies = styled(UnstyledPolicies)`
    font-size: 14px;
    line-height: 24px;

    strong {
        font-weight: ${MEDIUM};
    }
`

export default Policies
