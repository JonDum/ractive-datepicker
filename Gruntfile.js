/*global module:false*/
module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-webpack");
//    require('jit-grunt')(grunt);
    var webpack = require('webpack');
    grunt.initConfig({

        webpack: {
            options: require('./webpack.config.js'),
            development: {
            },
            production: {
                devtool: 'none',
                output: {
                    pathinfo: false,
                    filename: 'ractive-datepicker.min.js',
                },
                plugins: [
                    new webpack.DefinePlugin({
                        DEBUG: false,
                        PRODUCTION: true
                    }),
                    new webpack.optimize.UglifyJsPlugin({
                        output: {
                            comments: false,
                        }
                    }),
                    new webpack.optimize.AggressiveMergingPlugin(),
		    new  webpack.LoaderOptionsPlugin({
	                options: {
            		    stylus: {
	                        use: [(require('nib')())]
        	       	    }
	                }
        	    })
		]
            },
        },

    });
   grunt.registerTask('default', ['webpack:development', 'webpack:production']);
};