/*
**链接页面与后端数据接口的一个文件
*/

$.get('/ajax/index' , function(d){
    var windowWidth = $('html').offset().width;
    if(windowWidth < 320){
        windowWidth = 320;
    }
    var ioffset = $($('.Swipe-tab').find('a')[0]).offset();
    var iPosition = ioffset.width;
    new Vue({
        el: '#app',
        data: {
            sw: windowWidth,
            dsw: windowWidth*2,
            top: d.items[0].data.data,
            hot: d.items[1].data.data,
            recommend: d.items[2].data.data,
            female: d.items[3].data.data,
            male: d.items[4].data.data,
            free: d.items[5].data.data,
            topic: d.items[6].data.data,
            position:0,
            header_position:0,
            duration:0,
            header_duration:0,
            tab_1_class:'Swipe-tab-on',
            tab_2_class:''
        },
        methods: {
            tabSwitch:function(position){
                this.duration = 0.5;
                this.header_duration = 0.5;
                if(position == 0){
                    this.position = 0;
                    this.header_position = 0;
                    this.tab_1_class = 'Swipe-tab-on';
                    this.tab_2_class = '';
                }else{
                    this.position = -(windowWidth);
                    this.header_position = iPosition;
                    this.tab_2_class = 'Swipe-tab-on';
                    this.tab_1_class = '';
                }
            }
        }
    });
} , 'json');