// @flow

import React, { useCallback } from 'react'
import styled from 'styled-components'

import type { Filter, SearchFilter } from '../../flowtype/product-types'
import type { Category } from '../../flowtype/category-types'
import { isValidSearchQuery } from '../../utils/validate'

import SearchInput from './SearchInput'
import FilterModal from './FilterModal'

export type Props = {
    filter: Filter,
    categories: ?Array<Category>,
    onFilterChange: (filter: Filter) => void,
    onSearchChange: (searchFilter: SearchFilter) => void,
    onCreateProduct: () => void,
}

// const sortByOptions = ['pricePerSecond', 'free', 'dateCreated']

// const Filters = styled.div`
//     background-color: white;
// `

// const Container = styled(UnstyledContainer)`
//     padding: 0 30px;

//     ul {
//         margin: 0;
//         list-style: none;
//         padding: 1em 0;
//         display: flex;
//         align-items: center;
//     }

//     li {
//         flex: 1;

//         + li {
//             margin-left: 0;
//         }

//         :last-child {
//             display: none;
//         }
//     }

//     @media (min-width: ${LG}px) {
//         padding: 0 5em;

//         ul {
//             padding: 1.5em 0;
//         }

//         li {
//             display: inline-block;
//             outline: none !important;
//             flex: unset;

//             :last-child {
//                 margin-left: auto;
//                 display: block;
//             }
//         }

//         li + li {
//             margin-left: 3em;
//         }
//     }
// `

const UnstyledActionBar = ({
    filter,
    categories,
    onCreateProduct,
    onFilterChange: onFilterChangeProp,
    onSearchChange: onSearchChangeProp,
    ...props
}: Props) => {
    // const { api: filterModal } = useModal('marketplace.filter')

    const onSearchChange = useCallback((searchFilter: SearchFilter) => {
        if (isValidSearchQuery(searchFilter.search)) {
            if (searchFilter.sector === 'All') {
                onSearchChangeProp({
                    ...searchFilter, sector: '',
                })
            } else {
                onSearchChangeProp(searchFilter)
            }
        }
    }, [onSearchChangeProp])

    const clearSearch = useCallback(() => {
        onSearchChangeProp({
            search: '', sector: '', category: '', programme: '', course: '',
        })
    }, [onSearchChangeProp])
    // const productTypeOptions = useMemo(() => ([{
    //     id: 'all',
    //     value: undefined,
    //     title: I18n.t('actionBar.productTypes.all'),
    // }, {
    //     id: 'normal',
    //     value: 'normal',
    //     title: I18n.t('actionBar.productTypes.normal'),
    // }, {
    //     id: 'dataunion',
    //     value: 'dataunion',
    //     title: I18n.t('actionBar.productTypes.dataunion'),
    // }]), [])

    // const categoryOptions = useMemo(() => ([{
    //     id: '__all',
    //     value: '__all',
    //     title: I18n.t('actionBar.categories.all'),
    // },
    // ...(categories ? categories.map((c) => ({
    //     id: c.id,
    //     value: c.id,
    //     title: c.name,
    // })) : []),
    // ]), [categories])

    // const sortOptions = useMemo(() => sortByOptions.map((option) => ({
    //     id: option,
    //     value: option,
    //     title: I18n.t(`actionBar.sortOptions.${option}`),
    // })), [])

    // const { categories: category, maxPrice, sortBy, type } = filter

    // const currentSortByFilter = useMemo(() => {
    //     const opt = BN(maxPrice).isEqualTo('0') ?
    //         sortByOptions.find((o) => o === 'free') :
    //         sortByOptions.find((o) => o === sortBy)

    //     return opt
    // }, [maxPrice, sortBy])

    return (
        <div {...props}>
            <SearchInput
                value={filter.searchFilter.search}
                onChange={(searchFilter) => onSearchChange(searchFilter)}
                onClear={clearSearch}
                hidePlaceholderOnFocus
            />
            <FilterModal />
        </div>
    )
}

const ActionBar = styled(UnstyledActionBar)`
    color: #323232;
`

export default ActionBar
