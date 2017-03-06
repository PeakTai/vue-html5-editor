import progress from 'rollup-plugin-progress'
import postcss from 'rollup-plugin-postcss'
import cssnext from 'postcss-cssnext'
import buble from 'rollup-plugin-buble'
import html from 'rollup-plugin-html'
import autoprefixer from 'autoprefixer'
import clean from 'postcss-clean'
import atImport from 'postcss-import'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonJs from 'rollup-plugin-commonjs'
import license from 'rollup-plugin-license'
var pkg = require('./package.json')

/**
 * Created by peak on 2017/1/6.
 */
export default {
    entry: 'src/index.js',
    dest: 'dist/vue-html5-editor.js',
    format: 'umd',
    moduleName: "VueHtml5Editor",
    plugins: [
        license({
            banner: `Vue-html5-editor ${pkg.version}\n${pkg.repository.url}\nbuild at ${new Date()}`
        }),
        progress({
            clearLine: false
        }),
        replace({
            VERSION: JSON.stringify(pkg.version)
        }),
        postcss({
            plugins: [
                atImport(),
                cssnext({
                    warnForDuplicates: false
                }),
                autoprefixer(),
                clean()
            ],
            extensions: ['.css', '.pcss']
        }),
        html({
            include: '**/*.html',
            htmlMinifierOptions: {
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                conservativeCollapse: true
            }
        }),
        commonJs({
            include: 'node_modules/lrz/**'
        }),
        nodeResolve({jsnext: true}),
        buble({
            include: '**/*.js'
        })
    ]
}