var webpack = require('webpack');

module.exports = {
    entry: 'ractive-datepicker',
    stats: {
        // Configure the console output
        errorDetails: true, //this does show errors
        colors: false,
        modules: true,
        reasons: true
    },
    progress: true,
    output: {
        path: __dirname + '/',
        filename: 'ractive-datepicker.js',
        library: 'RactiveDatepicker',
        libraryTarget: 'umd',
        sourcePrefix: '    ',
    },
    resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['.js', '.styl', '.html'],
    },
    module: {
        loaders: [
            { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' },
            { test: /\.html/, loader: 'ractive-loader' }
        ],
    },

    devtool: 'none'
}