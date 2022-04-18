/**
 * Created by George on 2017/2/7.
 */
var fs = require('fs'),
    qs = require('querystring'),
    http = require('http');

//test
exports.getJSONData = function(){
    var content = fs.readFileSync('mock/test.json' , 'utf-8');
    return content;
};
//mock
exports.get_index_data = function(){
    var content = fs.readFileSync('mock/home.json' , 'utf-8');
    return content;
};
exports.get_bookbacket_data = function(){
    var content = fs.readFileSync('mock/bookbacket.json' , 'utf-8');
    return content;
};
exports.get_category_data = function(){
    var content = fs.readFileSync('mock/category.json' , 'utf-8');
    return content;
};
exports.get_rank_data = function(){
    var content = fs.readFileSync('mock/rank.json' , 'utf-8');
    return content;
};
//channel
exports.get_female_data = function(){
    var content = fs.readFileSync('mock/channel/female.json' , 'utf-8');
    return content;
};
exports.get_male_data = function(){
    var content = fs.readFileSync('mock/channel/male.json' , 'utf-8');
    return content;
};
//book 根据图书id肯定还有很多这里暂时只写一个
exports.get_book_data = function(id){
    if(!id) id = 18218;
    var content = fs.readFileSync('mock/book/'+id+'.json' , 'utf-8');
    return content;
};

//调用线上的数据接口 为什么？
//因为利用node 直接操作数据库效率不高，一般是用node去调用后台所写的http请求(即服务接口)
exports.getSearchData = function(start , end , keywords) {
    return function (cb) { //这里如果不这么写的话就成了项目里不断往进包含的情况嵌套很多层(至少俩层，主要是对于chunk的处理如果复杂的话肯定会继续嵌套很多)很累赘
        var data = {
            s: start,
            e: end,
            kw: keywords
        };
        var content = qs.stringify(data);

        var option = {
            hostname: 'dushu.xiaomi.com',
            port: 80,
            path: '/store/v0/lib/query/onbox?' + content
        };

        var req = http.request(option, function (data) {
            var getData = '';
            data.setEncoding('utf8');
            req.on('data', function (chunk) {
                getData += chunk;
            });
            req.on('end', function () {
                cb(null, getData)
            });
        });

        req.on('error', function () {
            console.log('http_get_error!');
        });
    }

};