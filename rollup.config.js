/*eslint-env es6 */
const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const pkg = require('./package.json');
const dts = require('rollup-plugin-dts').default;

const external = Object.keys(pkg.dependencies || {})
    .concat(Object.keys(pkg.peerDependencies || {}))
    .concat([
        '@themost/query-compat/closures',
        '@themost/query-compat/operators',
        '@themost/query-compat'
    ])


module.exports = [
    {
        input: 'src/index.js',
        output: {
            dir: 'dist',
            format: 'cjs',
            sourcemap: true
        },
        external: external,
        plugins: [
            commonjs(),
            babel({ babelHelpers: 'bundled' })
        ]
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        },
        external: external,
        plugins: [babel({ babelHelpers: 'bundled' })]
    },
    {
        input: 'src/index.d.ts',
        output: [
            {
                file: 'dist/index.d.ts'
            }
        ],
        external: external,
        plugins: [dts()],
    }, // @themost/query-compat/closures
    {
        input: 'closures/src/index.js',
        output: {
            dir: 'closures/dist',
            format: 'cjs',
            sourcemap: true
        },
        external: external,
        plugins: [
            commonjs(),
            babel({ babelHelpers: 'bundled' })
        ]
    },
    {
        input: 'closures/src/index.js',
        output: {
            file: 'closures/dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        },
        external: external,
        plugins: [babel({ babelHelpers: 'bundled' })]
    },
    {
        input: 'closures/src/index.d.ts',
        output: [
            {
                file: 'closures/dist/index.d.ts'
            }
        ],
        external: external,
        plugins: [dts()],
    }, // @themost/query-compat/operators
    {
        input: 'operators/src/index.js',
        output: {
            dir: 'operators/dist',
            format: 'cjs',
            sourcemap: true
        },
        external: external,
        plugins: [
            commonjs(),
            babel({ babelHelpers: 'bundled' })
        ]
    },
    {
        input: 'operators/src/index.js',
        output: {
            file: 'operators/dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        },
        external: external,
        plugins: [babel({ babelHelpers: 'bundled' })]
    },
    {
        input: 'operators/src/index.d.ts',
        output: [
            {
                file: 'operators/dist/index.d.ts'
            }
        ],
        external: external,
        plugins: [dts()],
    }
];
