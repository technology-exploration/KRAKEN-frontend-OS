/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useReducer, useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import cx from 'classnames'
import styled from 'styled-components'
import Autosuggest from 'react-autosuggest'
import { defaultTheme } from 'react-autosuggest/dist/theme'
import SelectField from '$mp/components/SelectField'
// import Label from '$ui/Label'
// import SvgIcon from '$shared/components/SvgIcon'
// import EditableText from '$shared/components/EditableText'
import UseState from '$shared/components/UseState'
import routes from '$routes'

import styles from './searchInput.pcss'

const SelectFieldNarrow = styled(SelectField)`
    width: 17rem;
`

const Row = styled.div`
    display: ${(props) => (props.hide ? 'none' : 'block')};
    justify-content: flex-start;
    flex-direction: column;
    width: 100%;
`

const Item = styled.div`
    flex: 0 32%;
    height: 70px;
    margin-bottom: 2%;
`

const SearchInput = ({ onChange, placeholderProp = I18n.t('actionBar.searchInput.placeholder'), className }) => {
    // valueProp,
    // onClear,
    // hidePlaceholderOnFocus,
    // autoFocus,

    const categories = [{
        label: 'Product category', value: -1,
    }, {
        label: 'Diploma', value: 0,
    }, {
        label: 'Study Status', value: 1,
    }, {
        label: 'Course Grade', value: 2,
    }, {
        label: 'Transcript', value: 3,
    }]
    const universities = [{
        label: 'University', value: -1,
    }, {
        label: 'TU Graz', value: 0,
    }]
    const programs = [{
        label: 'Study programme', value: -1,
    }, {
        label: 'Bachelor', value: 0,
    }, {
        label: 'Master', value: 1,
    }, {
        label: 'Doctoral', value: 2,
    }]
    const courses = [{
        label: 'Course name', value: -1,
    }, {
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
    const initialState = {
        courseInputValue: '',
        inputValue: '',
        category: '',
        programme: '',
        university: '',
    }
    const formReducer = (prevState, newState) => ({
        ...prevState, ...newState,
    })
    const [state, setState] = useReducer(formReducer, initialState)
    const [suggestions, setSuggestions] = useState([])
    const [hidden, setHidden] = useState(1)
    const [sector, setSector] = useState('All')
    useEffect(() => {
        onChange({
            search: state.inputValue.toLowerCase(), sector, category: state.category, programme: state.programme, course: state.courseInputValue,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sector, state])
    const categoryOptions = useMemo(() => (categories || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [categories])
    const selectedCategory = useMemo(() => (
        categoryOptions.find((o) => o.label === state.category)
    ), [categoryOptions, state.category])
    const programOptions = useMemo(() => (programs || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [programs])
    const selectedProgram = useMemo(() => (
        programOptions.find((o) => o.label === state.programme)
    ), [programOptions, state.programme])
    const courseOptions = useMemo(() => (courses || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [courses])
    const selectedCourse = useMemo(() => (
        courseOptions.find((o) => o.label === state.courseInputValue)
    ), [courseOptions, state.courseInputValue])
    const universityOptions = useMemo(() => (universities || []).map((c) => ({
        label: c.label,
        value: c.value,
    })), [universities])
    const selectedUniversity = useMemo(() => (
        universityOptions.find((o) => o.label === state.university)
    ), [universityOptions, state.university])

    const hideAdvancedMenuHandler = (e) => {
        const { target } = e
        if (target.checked) {
            setSector(target.value)
            setHidden(target.value === 'Education' ? 0 : 1)
        }
    }

    return (
        <div className={cx(className, styles.searchInput)}>
            <div className={styles.radioButtons}>
                <p className={styles.paragraph}>Select market sector:</p>
                <div className={styles.radio_toolbar}>
                    <input id="radio1" type="radio" value="Education" checked={sector === 'Education'} onChange={hideAdvancedMenuHandler} />
                    <label htmlFor="radio1">Education</label>
                    <input id="radio2" type="radio" value="Health & Wellness" checked={sector === 'Health & Wellness'} onChange={hideAdvancedMenuHandler} />
                    <label htmlFor="radio2">Health & Wellness</label>
                    <input id="radio3" type="radio" value="All" checked={sector === 'All'} onChange={hideAdvancedMenuHandler} />
                    <label htmlFor="radio3">All sectors</label>
                </div>
            </div>
            <UseState initialValue={false}>
                {(editing, setEditing) => (
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsClearRequested={() => setSuggestions([])}
                        onSuggestionsFetchRequested={({ value }) => {
                            setState({
                                inputValue: value,
                            })
                            if (sector === 'Health & Wellness') {
                                fetch(routes.api.products.suggestions(), {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        query: {
                                            prefix: {
                                                tag: value,
                                            },
                                        },
                                    }),
                                    redirect: 'follow',
                                })
                                    .then((response) => response.text())
                                    .then((result) => setSuggestions(JSON.parse(result)))
                                    .catch((error) => console.log('error', error))
                            }
                        }}
                        onSuggestionSelected={(_, { suggestionValue }) =>
                            setState({
                                inputValue: suggestionValue.toLowerCase(),
                            })
                        }
                        getSuggestionValue={(suggestion) => suggestion.tag}
                        renderSuggestion={(suggestion) => <span>{suggestion.tag}</span>}
                        inputProps={{
                            placeholder: placeholderProp,
                            value: state.inputValue,
                            onChange: (_, { newValue, method }) => {
                                setState({
                                    inputValue: newValue,
                                })
                            },
                        }}
                        theme={{
                            ...defaultTheme,
                            container: styles.react_autosuggest__container,
                            input: styles.react_autosuggest__input,
                            inputOpen: styles.react_autosuggest__input__open,
                            inputFocused: styles.react_autosuggest__input__focused,
                            suggestionsContainer: styles.react_autosuggest__suggestions_container,
                            suggestionsContainerOpen: styles.react_autosuggest__suggestions_container__open,
                            suggestionsList: styles.react_autosuggest__suggestions_list,
                            suggestion: styles.react_autosuggest__suggestion,
                            suggestionHighlighted: styles.react_autosuggest__suggestion__highlighted,
                        }}
                    />
                )}
            </UseState>
            <Row hide={hidden}>
                <div className={styles.advancedTitle}>
                    <Translate
                        value="actionBar.advanced"
                        tag="div"
                    />
                </div>
                {/* </Row>
            <Row hide={hidden} className={styles.advancedDropdowns}> */}
                <div className={`${styles.advancedDropdowns} d-flex`}>
                    <Item>
                        <SelectFieldNarrow
                            name="category"
                            options={categoryOptions}
                            value={selectedCategory}
                            onChange={(option) => {
                                if (option.value < 0) {
                                    setState({
                                        category: '',
                                    })
                                } else {
                                    setState({
                                        category: option.label.split(' ')[0].toLowerCase(),
                                    })
                                }
                            }}
                            isSearchable={false}
                            defaultValue={categories[0]}
                        />
                    </Item>
                    <Item>
                        <SelectFieldNarrow
                            name="university"
                            options={universityOptions}
                            value={selectedUniversity}
                            isSearchable={false}
                            defaultValue={universities[0]}
                        />
                    </Item>
                    <Item>
                        <SelectFieldNarrow
                            name="studyProgram"
                            options={programOptions}
                            value={selectedProgram}
                            onChange={(option) => {
                                if (option.value < 0) {
                                    setState({
                                        programme: '',
                                    })
                                } else {
                                    setState({
                                        programme: option.label.toLowerCase(),
                                    })
                                }
                            }}
                            isSearchable={false}
                            defaultValue={programs[0]}
                        />
                    </Item>
                    <Item>
                        <SelectFieldNarrow
                            name="course"
                            options={courseOptions}
                            value={selectedCourse}
                            onChange={(option) => {
                                if (option.value < 0) {
                                    setState({
                                        courseInputValue: '',
                                    })
                                } else {
                                    setState({
                                        courseInputValue: option.label.toLowerCase(),
                                    })
                                }
                            }}
                            isSearchable={false}
                            defaultValue={courses[0]}
                        />
                    </Item>
                </div>
            </Row>
        </div>
    )
}

SearchInput.defaultProps = {
    valueProp: {
        search: '', sector: '', category: '', programme: '', course: '',
    },
    onChange: () => {},
}

export default SearchInput
