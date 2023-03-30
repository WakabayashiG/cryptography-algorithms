module.exports = {
	publicPath: './',

	runtimeCompiler: true,

	chainWebpack: config => {
		config
			.plugin('html')
			.tap(args => {
				args[0].title = 'YTU | Cryptography'
				return args
			})
	}
}
