/* eslint-disable max-len */
import moduleDescription from './Gradient-216.md'

export default {
    id: 216,
    name: 'Gradient',
    path: 'Utils',
    help: {
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_KidPrbcDSUuJkHrcnf7pgA',
            name: 'in',
            longName: 'Gradient.in',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
    ],
    outputs: [
        {
            id: 'ep_d2Sq84nIQpyQBRE4Gv6V3A',
            name: 'color',
            longName: 'Gradient.color',
            type: 'Color',
            connected: false,
            canConnect: true,
            export: false,
        },
    ],
    params: [
        {
            id: 'ep_0SH-T6JPSNePlIzUSESG8A',
            name: 'minValue',
            longName: 'Gradient.minValue',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 0,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 0,
        },
        {
            id: 'ep_VbELn3-HSU-OEUP6irZ3kw',
            name: 'maxValue',
            longName: 'Gradient.maxValue',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 1,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 1,
        },
        {
            id: 'ep_Tj3G6IicT4KYfQHTtRncNQ',
            name: 'minColor',
            longName: 'Gradient.minColor',
            type: 'Color',
            connected: false,
            canConnect: true,
            export: false,
            value: 'rgba(0, 255, 0, 1.0)',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Color',
            ],
            requiresConnection: false,
            defaultValue: 'rgba(0, 255, 0, 1.0)',
        },
        {
            id: 'ep_s1htVwyTSGidbO7SJCOcMQ',
            name: 'maxColor',
            longName: 'Gradient.maxColor',
            type: 'Color',
            connected: false,
            canConnect: true,
            export: false,
            value: 'rgba(255, 0, 0, 1.0)',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Color',
            ],
            requiresConnection: false,
            defaultValue: 'rgba(255, 0, 0, 1.0)',
        },
    ],
}
