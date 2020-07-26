import getTechnology , {requireTechnologies} from '../src';

describe('getTechnology', () => {
    [
        ['aws_profiles', {
            id: 'aws_profiles',
            path: 'aws/profiles',
            name: 'AWS Profiles',
            link: 'https://aws.amazon.com/cli/',
            dependencies: [
                'aws_cli',
            ],
            fullDependencies: [
                'aws',
                'aws_cli',
            ],
            orderedFullDependencies: [
                'aws',
                'aws_cli',
            ],
            installProcedure: {id: 'aws_profiles', name: 'AWS Profiles', type: 'template', template: expect.any(String)},
            installProcedures: {
                aws_cli: {id: 'aws_cli', name: 'AWS CLI', type: 'template', template: expect.any(String)},
                aws_profiles: {id: 'aws_profiles', name: 'AWS Profiles', type: 'template', template: expect.any(String)},
            },
            preRequisite: {id: 'aws_profiles', name: 'AWS Profiles', type: 'template', template: expect.any(String)},
            preRequisites: {
                aws_cli: {id: 'aws_cli', name: 'AWS CLI', type: 'template', template: expect.any(String)},
                aws_profiles: {id: 'aws_profiles', name: 'AWS Profiles', type: 'template', template: expect.any(String)},
            },
            requiredTechnologies: {
                aws: expect.anything(),
                aws_cli: expect.anything(),
            },
        }],
        ['jest', {
            id: 'jest',
            path: 'jest',
            name: 'Jest',
            link: 'https://jestjs.io/',
            dependencies: [
                'node',
                'nvm',
            ],
            fullDependencies: [
                'node',
                'nvm',
            ],
            orderedFullDependencies: [
                'nvm',
                'node',
            ],
            installProcedures: {
                node: {id: 'node', name: 'Node.js', type: 'template', template: expect.any(String)},
                nvm: {id: 'nvm', name: 'NVM', type: 'template', template: expect.any(String)},
            },
            preRequisites: {
                node: {id: 'node', name: 'Node.js', type: 'template', template: expect.any(String)},
                nvm: {id: 'nvm', name: 'NVM', type: 'template', template: expect.any(String)},
            },
            requiredTechnologies: {
                node: expect.anything(),
                nvm: expect.anything(),
            },
        }],
        ['react_gatsby', {
            id: 'react_gatsby',
            path: 'react/gatsby',
            name: 'GatsbyJS',
            link: 'https://www.gatsbyjs.org/',
            dependencies: [
                'react_js',
            ],
            fullDependencies: [
                'node',
                'npm',
                'nvm',
                'react_js',
            ],
            orderedFullDependencies: [
                'nvm',
                'node',
                'npm',
                'react_js',
            ],
            installProcedures: {
                node: {id: 'node', name: 'Node.js', type: 'template', template: expect.any(String)},
                nvm: {id: 'nvm', name: 'NVM', type: 'template', template: expect.any(String)},
                npm: {id: 'npm', name: 'NPM', type: 'template', template: expect.any(String)},
            },
            preRequisites: {
                node: {id: 'node', name: 'Node.js', type: 'template', template: expect.any(String)},
                nvm: {id: 'nvm', name: 'NVM', type: 'template', template: expect.any(String)},
                npm: {id: 'npm', name: 'NPM', type: 'template', template: expect.any(String)},
            },
            requiredTechnologies: {
                node: expect.anything(),
                npm: expect.anything(),
                nvm: expect.anything(),
                react_js: expect.anything(),
            },
        }],
    ]
        .forEach(
            ([id, expected]) => it(`${id} => ${JSON.stringify(expected)}`, () => {
                expect(getTechnology(<string>id)).toEqual(expected);
            })
        )
    ;
})

describe('requireTechnologies', () => {
    [
        [['aws_profiles', 'jest', 'react_gatsby'], {
            preRequisites: {
                ...getTechnology('aws_profiles').preRequisites,
                ...getTechnology('jest').preRequisites,
                ...getTechnology('react_gatsby').preRequisites,
            },
            installProcedures: {
                ...getTechnology('aws_profiles').installProcedures,
                ...getTechnology('jest').installProcedures,
                ...getTechnology('react_gatsby').installProcedures,
            },
            fullDependencies: [
                'aws',
                'nvm',
                'aws_cli',
                'node',
                'aws_profiles',
                'jest',
                'npm',
                'react_js',
                'react_gatsby',
            ],
            technologies: {
                aws_profiles: getTechnology('aws_profiles'),
                jest: getTechnology('jest'),
                react_gatsby: getTechnology('react_gatsby'),
                ...getTechnology('aws_profiles').requiredTechnologies,
                ...getTechnology('jest').requiredTechnologies,
                ...getTechnology('react_gatsby').requiredTechnologies,
            }
        }],
    ]
        .forEach(
            ([ids, expected]) => it(`${(<string[]>ids).join(', ')} => ${JSON.stringify(expected)}`, () => {
                expect(requireTechnologies(<string[]>ids)).toEqual(expected);
            })
        )
    ;
})