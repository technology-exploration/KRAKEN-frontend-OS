/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// @flow

import React, { useContext, useMemo } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'
import styled from 'styled-components'

import { WithContext as ReactTags } from 'react-tag-input'
import SelectField from '$mp/components/SelectField'
import Label from '$ui/Label'
import { MarketplaceTheme } from '$ui/Errors'
import useValidation from '../ProductController/useValidation'
import useEditableProduct from '../ProductController/useEditableProduct'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { Context as EditControllerContext } from './EditControllerProvider'

import styles from './productDetails.pcss'
import css from './marketSector.css'

type Props = {
    disabled?: boolean,
}

const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    visibility: ${(props) => (props.hide ? 'hidden' : 'visible')};
`

const Item = styled.div`
    flex: 0 32%;
    height: 70px;
    margin-bottom: 2%;
`

const NewLineItem = styled.div`
    flex: 0 69%;
    height: 70px;
    margin-bottom: 2%;
`

const SelectFieldNarrow = styled(SelectField)`
    width: 13rem;
`

const MarketSector = ({ disabled }: Props) => {
    const [tags, setTags] = React.useState([])
    const [suggestions, setSuggestions] = React.useState([])
    const { isValid: isTagValid, message: tagMessage } = useValidation('tags')
    const { isValid: isSectorValid, message: sectorMessage } = useValidation('sector')
    const { isValid: isCategoryValid, message: categoryMessage } = useValidation('category')
    const { isValid: isUniversityValid, message: universityMessage } = useValidation('university')
    const { isValid: isStudyProgramValid, message: studyProgramMessage } = useValidation('studyProgram')
    const { isValid: isCourseValid, message: courseMessage } = useValidation('course')
    const product = useEditableProduct()

    const { type } = product
    const sectors = [{
        label: 'Education', value: 0,
    }, {
        label: 'Health and wellness', value: 1,
    }]
    const DUsectors = [{
        label: 'Health and wellness', value: 1,
    }]
    const categories = [{
        label: 'Diploma', value: 0,
    }, {
        label: 'Study Status', value: 1,
    }, {
        label: 'Course Grade', value: 2,
    }, {
        label: 'Transcript', value: 2,
    }]
    const universities = [{
        label: 'TU Graz', value: 0,
    }]
    const studyPrograms = [{
        label: 'Bachelor', value: 0,
    }, {
        label: 'Master', value: 1,
    }, {
        label: 'Doctoral', value: 2,
    }]
    const courses = [{
        label: 'Geodesy', value: 0,
    }, {
        label: 'Information and Computer Engineering', value: 1,
    },
    {
        label: 'Architecture', value: 2,
    }, {
        label: 'Biomedical Engineering', value: 3,
    },
    {
        label: 'Chemical and Process Engineering', value: 4,
    }, {
        label: 'Chemistry', value: 5,
    },
    {
        label: 'Civil Engineering Sciences and Construction Management', value: 6,
    }, {
        label: 'Computer Science', value: 7,
    },
    {
        label: 'Electrical Engineering', value: 8,
    }, {
        label: 'Electrical Engineering and Audio Engineering', value: 9,
    },
    {
        label: 'Environmental System Sciences / Natural Sciences-Technology', value: 10,
    }, {
        label: 'Geo Sciences', value: 11,
    },
    {
        label: 'Mathematics', value: 12,
    }, {
        label: 'Mechanical Engineering', value: 13,
    },
    {
        label: 'Mechanical Engineering and Business Economics', value: 14,
    }, {
        label: 'Molecular Biology', value: 15,
    },
    {
        label: 'Physics', value: 16,
    }, {
        label: 'Software Engineering and Management', value: 17,
    },
    {
        label: 'Advanced Materials Science', value: 18,
    }, {
        label: 'Biochemistry and Molecular Biomedicine', value: 19,
    },
    {
        label: 'Biorefinery Engineering', value: 20,
    }, {
        label: 'Biotechnology', value: 21,
    },
    {
        label: 'Chemical and Pharmaceutical Engineering', value: 22,
    }, {
        label: 'Civil Engineering Sciences and Structural Engineering', value: 23,
    },
    {
        label: 'Civil Engineering Sciences and Infrastructure', value: 24,
    }, {
        label: 'Construction Management and Civil Engineering', value: 25,
    },
    {
        label: 'Electrical Engineering and Audio Engineering', value: 26,
    }, {
        label: 'Electrical Engineering and Business', value: 27,
    },
    {
        label: 'Environmental System Sciences / Climate Change and Environmental Technology', value: 28,
    }, {
        label: 'Doctoral Programme in Technical Sciences', value: 29,
    },
    {
        label: 'Geo Spatial Technologies', value: 30,
    },
    {
        label: 'Geotechnical and Hydraulic Engineering', value: 31,
    }, {
        label: 'Molecular Microbiology', value: 32,
    },
    {
        label: 'Plant Sciences', value: 33,
    }, {
        label: 'Production Science and Management', value: 34,
    },
    {
        label: 'Space Sciences and Earth from Space', value: 35,
    }, {
        label: 'Technical Chemistry', value: 36,
    },
    {
        label: 'Technical Physics', value: 37,
    }, {
        label: 'Doctoral Programme in Natural Sciences', value: 38,
    },
    ]
    const { publishAttempted } = useContext(EditControllerContext)
    const {
        updateTags,
        updateSector,
        updateCategory,
        updateUniversity,
        updateStudyProgram,
        updateCourse,
    } = useEditableProductActions()
    const sectorOptions = useMemo(() => (sectors || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [sectors])
    const productSector = product.sector ? product.sector : 'Health and wellness'
    const selectedSector = useMemo(() => (
        sectorOptions.find((o) => o.label === productSector)
    ), [sectorOptions, productSector])
    const DUselectedSector = {
        label: 'Health and wellness', value: 1,
    }
    const categoryOptions = useMemo(() => (categories || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [categories])
    const productCategory = product.category
    const selectedCategory = useMemo(() => (
        categoryOptions.find((o) => o.label === productCategory)
    ), [categoryOptions, productCategory])
    const universityOptions = useMemo(() => (universities || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [universities])
    const productUniversity = product.university
    const selectedUniversity = useMemo(() => (
        universityOptions.find((o) => o.label === productUniversity)
    ), [universityOptions, productUniversity])
    const studyProgramOptions = useMemo(() => (studyPrograms || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [studyPrograms])
    const productStudyProgram = product.studyProgram
    const selectedStudyProgram = useMemo(() => (
        studyProgramOptions.find((o) => o.label === productStudyProgram)
    ), [studyProgramOptions, productStudyProgram])
    const courseOptions = useMemo(() => (courses || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [courses])
    const productCourse = product.course
    const selectedCourse = useMemo(() => (
        courseOptions.find((o) => o.label === productCourse)
    ), [courseOptions, productCourse])
    const Keys = {
        TAB: 9,
        ENTER: 13,
        COMMA: 188,
    }
    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i))
        updateTags(tags.filter((tag, index) => index !== i))
    }
    const delimiters = [Keys.TAB, Keys.COMMA, Keys.ENTER]
    const autocomplete = true
    const listOfSuggestions = async (search) => {
        const arraySugg = []
        const firstResponse = await fetch(`https://id.nlm.nih.gov/mesh/lookup/term?label=${search}&match=exact&limit=5`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        const firstJsonResponse = await firstResponse.json()
        const firstobjInArray = await firstJsonResponse.map((object) => arraySugg.push((object.label)))
        await setSuggestions(arraySugg)

        if (arraySugg.length < 5) {
            const secondResponse = await fetch(`https://id.nlm.nih.gov/mesh/lookup/term?label=${search}&match=startswith&limit=5`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            const secondjsonResponse = await secondResponse.json()
            const objInArray = await secondjsonResponse.map((object) => arraySugg.push((object.label)))

            const filterRepeated = await arraySugg.filter((val, id) => arraySugg.indexOf(val) === id)

            const sliceArray = await filterRepeated.slice(0, 5)

            await setSuggestions(sliceArray)
        }

        if (arraySugg.length < 5) {
            const thirdResponse = await fetch(`https://id.nlm.nih.gov/mesh/lookup/term?label=${search}&match=contains&limit=5`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            const thirdJsonResponse = await thirdResponse.json()

            const objectsInArray = await thirdJsonResponse.map((object) => arraySugg.push((object.label)))

            const filterRepeated = await arraySugg.filter((val, id) => arraySugg.indexOf(val) === id)

            const sliceArray = await filterRepeated.slice(0, 5)

            await setSuggestions(sliceArray)
        }
    }

    return (
        <section id="marketSector" className={cx(styles.root, styles.ProductDetails)}>
            <div>
                <Translate
                    tag="h1"
                    value="editProductPage.marketSector.title"
                />
            </div>
            {selectedSector !== undefined && selectedSector.value === 0 &&
            <div>
                <Translate
                    tag="p"
                    value="editProductPage.marketSector.description"
                />
            </div>
            }
            {selectedSector !== undefined && selectedSector.value === 1 &&
            <div>
                <Translate
                    tag="p"
                    value="editProductPage.marketSector.educationDescription"
                />
            </div>
            }
            {((selectedSector !== undefined && selectedSector.value === 1) || type === 'STREAMS') &&
            <Row>
                <Item>
                    <Label
                        as={Translate}
                        value="editProductPage.marketSector.choose"
                        tag="div"
                    />
                    <SelectFieldNarrow
                        name="sector"
                        options={type === 'STREAMS' ? DUsectors : sectorOptions}
                        value={type === 'STREAMS' ? DUselectedSector : selectedSector}
                        onChange={(option) => updateSector(option.label)}
                        isSearchable={false}
                        error={publishAttempted && !isSectorValid ? sectorMessage : undefined}
                        disabled={!!disabled}
                        errorsTheme={MarketplaceTheme}
                        defaultValue={{
                            label: 'Education', value: 0,
                        }}
                    />
                </Item>
                <NewLineItem>
                    <Label
                        as={Translate}
                        tag="div"
                        value="editProductPage.marketSector.tag"
                    />
                    <ReactTags
                        inline={false}
                        tags={tags}
                        error={publishAttempted && !isTagValid ? tagMessage : undefined}
                        handleInputChange={(e) => listOfSuggestions(e)}
                        suggestions={suggestions}
                        delimiters={delimiters}
                        // inputFieldPosition="top"
                        // inputFieldPosition="inline"
                        autocomplete={autocomplete}
                        handleDelete={handleDelete}
                        handleAddition={(tag) => {
                            if (suggestions.includes(tag)) {
                                setTags([...tags, {
                                    id: tags.length + 1, text: tag,
                                }])
                                updateTags([...tags, {
                                    id: tags.length + 1, text: tag,
                                }])
                            }
                        }
                        }
                    />
                </NewLineItem>
            </Row>
            }
            {selectedSector !== undefined && selectedSector.value === 0 && type !== 'STREAMS' &&
            <Row>
                <Item>
                    <Label
                        as={Translate}
                        value="editProductPage.marketSector.choose"
                        tag="div"
                    />
                    <SelectFieldNarrow
                        name="sector"
                        options={sectorOptions}
                        value={selectedSector}
                        onChange={(option) => updateSector(option.label)}
                        isSearchable={false}
                        error={publishAttempted && !isSectorValid ? sectorMessage : undefined}
                        disabled={!!disabled}
                        errorsTheme={MarketplaceTheme}
                        defaultValue={{
                            label: 'Education', value: 0,
                        }}
                    />
                </Item>
                <Item>
                    <Label
                        as={Translate}
                        value="editProductPage.marketSector.category"
                        tag="div"
                    />
                    <SelectFieldNarrow
                        name="category"
                        options={categoryOptions}
                        value={selectedCategory}
                        onChange={(option) => updateCategory(option.label)}
                        isSearchable={false}
                        error={publishAttempted && !isCategoryValid ? categoryMessage : undefined}
                        disabled={!!disabled}
                        errorsTheme={MarketplaceTheme}
                        defaultValue={{
                            label: 'Diploma', value: 0,
                        }}
                    />
                </Item>
                <Item>
                    <Label
                        as={Translate}
                        value="editProductPage.marketSector.university"
                        tag="div"
                    />
                    <SelectFieldNarrow
                        name="university"
                        options={universityOptions}
                        value={selectedUniversity}
                        onChange={(option) => updateUniversity(option.label)}
                        isSearchable={false}
                        error={publishAttempted && !isUniversityValid ? universityMessage : undefined}
                        disabled={!!disabled}
                        errorsTheme={MarketplaceTheme}
                        defaultValue={{
                            label: 'TU Graz', value: 0,
                        }}
                    />
                </Item>
                <Item>
                    <Label
                        as={Translate}
                        value="editProductPage.marketSector.studyProgram"
                        tag="div"
                    />
                    <SelectFieldNarrow
                        name="studyProgram"
                        options={studyProgramOptions}
                        value={selectedStudyProgram}
                        onChange={(option) => updateStudyProgram(option.label)}
                        isSearchable={false}
                        error={publishAttempted && !isStudyProgramValid ? studyProgramMessage : undefined}
                        disabled={!!disabled}
                        errorsTheme={MarketplaceTheme}
                        defaultValue={{
                            label: 'Bachelor', value: 0,
                        }}
                    />
                </Item>
                <Item>
                    <Label
                        as={Translate}
                        value="editProductPage.marketSector.course"
                        tag="div"
                    />
                    <SelectFieldNarrow
                        name="course"
                        options={courseOptions}
                        value={selectedCourse}
                        onChange={(option) => updateCourse(option.label)}
                        isSearchable={false}
                        error={publishAttempted && !isCourseValid ? courseMessage : undefined}
                        disabled={!!disabled}
                        errorsTheme={MarketplaceTheme}
                        defaultValue={{
                            label: 'Geodesy', value: 0,
                        }}
                    />
                </Item>
            </Row>
            }
        </section>
    )
}
export default MarketSector
