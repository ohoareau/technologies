import detectTechnologies from '..';

export default {
    command: ['detect', '$0'],
    describe: 'detect technologies',
    builder: {
        source: {
            alias: 's',
            default: process.cwd(),
        }
    },
    handler: async argv => {
        detectTechnologies(argv.source).map(t => console.log(t));
    },
};