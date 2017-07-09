module.exports = {
	entry: './src/web/app.js',
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: 'ts-loader'
		}, {
			test: /\.tag$/,
			exclude: /node_modules/,
			loader: 'riot-tag-loader',
			query: {
				hot: false,
				style: 'stylus',
				expr: false,
				compact: true,
				parserOptions: {
					style: {
						compress: true
					}
				}
			}
		}]
	},
	output: {
		path: __dirname + '/built/web/',
		filename: `app.js`
	}
};
