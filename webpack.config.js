var webpack = require('webpack');

module.exports = {
    entry: 'src/ractive-datepicker',
    output: {
        path: __dirname + '/',
        filename: 'ractive-datepicker.js',
        library: 'RactiveDatepicker',
        libraryTarget: 'umd',
        sourcePrefix: '    ',
    },
    resolve: {
        root: process.cwd(),
        modulesDirectories: ['node_modules', 'src'],
        extensions: ['', '.js', '.styl', '.html'],
    },
    module: {
        loaders: [
            {test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'},
            {test: /\.html/, loader: 'ractive-loader'}
        ],
    },
    debug: true,
    devtool: 'none',
    stylus: {
        use: [(require('nib')())],
    },
}
