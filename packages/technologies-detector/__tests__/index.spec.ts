import detectTechnologies from '../src';

describe('detectTechnologies', () => {
    [
        ['dir1', []],
        ['dir2', ['aws', 'nvm', 'aws_sdk', 'node', 'npm']],
    ]
        .forEach(
            ([name, expected]) => it(`${name} => ${(<string[]>expected).join(', ')}`, () => {
                expect(detectTechnologies(`${__dirname}/../__fixtures__/dirs/${<string>name}`)).toEqual(expected);
            })
        )
    ;
})