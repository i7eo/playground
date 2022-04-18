var htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	//entry: './src/scripts/main.js',  //配置文件入口   第一种一个string即一个文件开始
	//entry: ["./src/scripts/main.js" , "./src/scripts/mainA.js"],  //数组入口文件 将多个何为一个即multi上面的[0]代表存储关系
	entry: {
		main: './src/scripts/main.js',
		mainA: './src/scripts/mainA.js'
	},
	output: {                        //配置文件输出位置
		/*path: './dist/js',
		filename: '[name]-[chunkhash]-bundle.js'        //打包的文件名称*/
		path : './dist',
		filename: 'js/[name]-[chunkhash].js',            //把html与js分开存放
		publicPath: 'http://bluespace/'                  //上线地址的绝对路径，自动替换当前项目中相对路径
	},
	plugins: [
		new htmlWebpackPlugin({
			//filename: '[hash].index.html',              //名称
			template: 'index.html',						//以什么为模板，一般以配置文件下的index.html为模板
			//inject: 'head'								//scripts存放的位置
			title: 'webpack is good!',
			inject: body,
			date: new Date(),
			minify: {                                    //压缩html文件，去除空格，去除注释
				collapseWhitespace: true,
				removeComments: true            
			}
		})
		/*new htmlWebpackPlugin({                        多页面下的htmlwebpackplugin使用
			filename: '[hash].index.html', 
			template: 'index.html',	
			title: 'webpack is a&b!',
			inject: body,
			chunks: ['main' , 'mainA']
		}),
		new htmlWebpackPlugin({
			filename: '[hash].index.html', 
			template: 'index.html',	
			title: 'webpack is a!',
			inject: body,
			chunks: ['main'],
			excludeChunks: ['main']                配置该选项可以设置每个html除了哪个chunk不需要剩下均被需要
		}),
		new htmlWebpackPlugin({
			filename: '[hash].index.html', 
			template: 'index.html',	
			title: 'webpack is b!',
			inject: body,
			chunks: ['mainA']                      配置该选项可以设置每个html所需要的chunk而不是所有的chunks(所有的js)
		})*/
	]
	
};