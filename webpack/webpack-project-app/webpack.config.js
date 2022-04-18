	var htmlWebpackPlugin = require('html-webpack-plugin');
	var path = require('path');

	module.exports = {
		entry: './src/app.js',
		output: {
			path: './dist',
			filename: 'js/[name].bundle.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: [{
						loader: 'babel-loader',
						options: {
							presets: ['es2015']
						}
					}],
					include: path.resolve(__dirname , './src'),
					exclude: path.resolve(__dirname , './node_modules')                           //尽量使用绝对路径会提高打包速度在configruation里面通过exclude和include来提高打包速度
				
				},
				{
					test: /\.css$/,
					use: [
						'style-loader',
						{
				            loader: 'css-loader',
				            options: { importLoaders: 1 } 
				        },
						{
							loader: 'postcss-loader',
							options: {
								plugins: function(){
									return [
										require('autoprefixer')
									];
								}
							}
						}
					]
				},
				{
					test: /.\.less$/,
					use: [
						'style-loader',
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								plugins: function(){
									return [
										require('autoprefixer')    // postcss下的自动补全浏览器前缀的插件
									];
								}
							}
						},
						'less-loader'      //使用less或者sass时不用为@import的less/sass添加importLoaders:1因为自动添加。因为less/sass支持import
					]
				},
				{
					test: /\.html$/,
					use: 'html-loader'      // 将html当做字符串处理，对应innerhtml。坏处是不能使用for等模板语法
				},
				{
					test: /\.ejs$/,
					use: 'ejs-loader'       // 把html当做模板处理
				},
				{
					test: /\.(png|jpg|gif|svg)$/i,            //用包管理工具除了模板外的文件放置相对路径没有问题，但是在模板文件中应该<img src="${require('../../assets/George.jpg')}" />
					use: [
						{
							loader: 'url-loader',                       //url-loader可以设置limit若图片体积小于limit的话则通过url-loader转化为base64代码，若大于则调用file-loader
							options: {
								name: 'assets/[name]-[hash:5].[ext]',
								limit: 4000                                         //经常需要加载的图片利用http请求较好，因为可以享受到缓存，而base64则需每次读取
							}
						},
						'image-webpack-loader'                                      //压缩图片体积
					]                       
				}
			]
		},
		plugins: [
			new htmlWebpackPlugin({
				filename: 'index.html',
				template: 'index.html',
				inject: 'body'
			})
		]
	};