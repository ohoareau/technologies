module.exports = {
    plugins: ['@monorepo-js-libs'],
    root: {
        type: 'monorepo-js-libs',
        vars: {
            node_version: '14.4.0',
            npm_scope: 'ohoareau',
            makefile: {
                microgen: true,
            }
        }
    }
}