var koa = require('koa'),
    route = require('koa-route'),
    qs = require('querystring'),
    appservice = require('./service/readerService'),
    app = koa();

var views = require('co-views'),
    render = views('./view' , {
        map: { html : 'ejs'}
    });

//访问静态资源 利用中间件koa-static-server
var koa_static = require('koa-static-server');
app.use(koa_static({
    rootDir: './static',
    rootPath: '/static'
}));


//service 提供获取数据的接口，而在这里根据url俩调用对应的数据处理接口
//test service的数据接口所输出的数据
app.use(route.get('/api_test' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = appservice.getJSONData();
}));
//mock
app.use(route.get('/ajax/index' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = appservice.get_index_data();
}));
app.use(route.get('/ajax/bookbacket' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = appservice.get_bookbacket_data();
}));
app.use(route.get('/ajax/category' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = appservice.get_category_data();
}));
app.use(route.get('/ajax/rank' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = appservice.get_rank_data();
}));
//channel
app.use(route.get('/ajax/female' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = appservice.get_female_data();
}));
app.use(route.get('/ajax/male' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = appservice.get_male_data();
}));
//book
app.use(route.get('/ajax/book' , function*(){
    this.set('Cache-Control' , 'no-cache');
    var params = qs.parse(this.req._parsedUrl.query);
    var id = params.id;
    if(!id) id='';
    this.body = appservice.get_book_data(id);
}));

//利用后端暴露出来的服务接口信息(start、end、keywords)，供前端通过ajax调用
app.use(route.get('/ajax/search' , function*(){
    this.set('Cache-Control' , 'no-cache');
    var params = qs.parse(this.req._parsedUrl.query);
    var start = params.start;
    var end = params.end;
    var keywords = params.keywords;
    this.body = yield appservice.getSearchData(start , end , keywords);
}));

app.use(route.get('/' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = yield render('index' , {title : '书城首页'});
}));
app.use(route.get('/bookbacket' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = yield render('bookbacket' , {title : '书架页面'});
}));
app.use(route.get('/category' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = yield render('category' , {title : '目录页面'});
}));
app.use(route.get('/rank' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = yield render('rank' , {title : '排行页面'});
}));
//channel
app.use(route.get('/female' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = yield render('female' , {title : '女生首页'});
}));
app.use(route.get('/male' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = yield render('male' , {title : '男生首页'});
}));
//book
app.use(route.get('/book' , function*(){
    this.set('Cache-Control' , 'no-cache');
    var params = qs.parse(this.req._parsedUrl.query);
    var id = params.id;
    this.body = yield render('book' , {bookId:id});
}));

//other
app.use(route.get('/search' , function*(){
    this.set('Cache-Control' , 'no-cache');
    this.body = yield render('search' , {title : '搜索页面'});
}));






app.listen(3007);
console.log('koa server start by 3007 port.');
