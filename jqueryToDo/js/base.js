;(function() {
    'use strict';

    var task = function (options) {
        options = options || {};
        this.initVars();
        //this.initTask();
    };

    task.Vars = {
        $tip: $('.tip'),
        $addTask: $('.add-task'),
        $addTaskText: $('.add-task input'),
        $taskList: $('.task-list'),
        $taskDetail: $('.task-detail'),
        $taskDetailMask: $('.task-detail-mask'),
        $window: $(window),
        $popEl: $('.pop-el'),
        $popElMask: $('.pop-el-mask'),
        taskArray: !store ? [] : store.get('tasklist') || [],
        taskTpl: '',
        detailTpl: '',
        current_detail_index:0
    };

    task.prototype = {
        constructor: task,
        initVars: function() {
            var vars = task.Vars;
            for(var key in vars) {
                if(vars.hasOwnProperty(key)) {
                    this[key] = vars[key];
                }
            }
        },
        eventHandler: function() {
            var self = this;
            // main page submit
            self.$addTask.on('click', function(e) {
                e.preventDefault();
                var inputVal = self.$addTaskText.val(),
                    tmp = {'content': inputVal};
                if(!inputVal) return;
                //如果输入有值还可以和数组中之前的数据匹配如果重复的话询问是否处理 function filter(){}
                self.operateTask(tmp);
                self.renderList();
                self.$addTaskText.val(null);
            });
            // delete task
            self.$taskList.on('click', '.del', function() {
                var del_index = $(this).parent().parent().data('index');
                if(del_index !== undefined && self.taskArray[del_index] !== undefined){
                    self.$popEl.fadeIn('fast', function() {
                        self.$popElMask.fadeIn('fast');
                        //self.$popEl.on('click', '.confirm', function() {});
                        pop().then(function(r) {
                            if(r) {
                                self.operateTask(del_index);
                                self.renderList();
                            }
                        });
                    });
                }
            });
            var pop = function() {
                var der = $.Deferred(),
                    confirm = '';
                self.$popEl.on('click', '.confirm', function(){ confirm = true; });
                self.$popEl.on('click', '.cancel', function(){ confirm = false; });
                self.$popElMask.on('click', function(){ confirm = false; });

                var pop_timer = setInterval(function() {
                    if(confirm !== '') {
                        der.resolve(confirm);
                        clearInterval(pop_timer);
                        self.$popEl.hide();
                        self.$popElMask.hide();
                        confirm = '';
                    }
                }, 500);
                return der.promise();
            };
            // dbclick per task detail
            self.$taskList.on('dblclick', '.task', function() {
                var cur_index =  $(this).data('index'),
                    $current_detail_el = $('.detail-list[data-index='+cur_index+']');
                self.current_detail_index = cur_index;
                $current_detail_el.find('.content').text($(this).find('.content').text());
                self.$taskDetailMask.show();
                self.$taskDetail.show();
                $current_detail_el.show();
            });
            // click task detail
            self.$taskList.on('click', '.det', function() {
                var cur_index = $(this).parent().parent().data('index'),
                    $current_detail_el = $('.detail-list[data-index='+cur_index+']');
                self.current_detail_index = cur_index;
                $current_detail_el.find('.content').text($(this).parent().parent().find('.content').text());
                self.$taskDetailMask.show();
                self.$taskDetail.show();
                $current_detail_el.show();
            });
            // doubleclick edit slogan text
            self.$taskDetail.on('dblclick', '.content', function() {
                $(this).hide();
                $(this).parent().find('[name=content]').show();
            });
            // edit input lose focus
            self.$taskDetail.on('blur', '[name=content]', function() {
                $(this).hide();
                $(this).parent().find('.content').text($(this).val()).show();
            });

            // task detail page submit
            self.$taskDetail.on('click', 'button', function(e) {
                e.preventDefault();
                var detail_index = $(this).parent().parent().data('index'),
                    $current_detail_el = $('.detail-list[data-index='+detail_index+']'),
                    update_obj = {'content':'','desc':'','date':''};
                update_obj.content = $current_detail_el.find('[name=content]').val().trim();
                update_obj.desc = $current_detail_el.find('textarea').val().trim();
                update_obj.date = $current_detail_el.find('input[name=remind_date]').val();
                // judge current time and setting time
                if(new Date().getTime() < new Date(update_obj.date).getTime()) update_obj['notify'] = false;

                self.operateTask(detail_index, JSON.stringify(update_obj));
                self.$taskDetailMask.hide();
                self.$taskDetail.hide();
                $('.detail-list[data-index='+self.current_detail_index+']').hide();
                self.renderList();

            });
            // hide task detail
            self.$taskDetailMask.on('click', function() {
                self.$taskDetailMask.hide();
                self.$taskDetail.hide();
                $('.detail-list[data-index='+self.current_detail_index+']').hide();
            });
            // check checkbox
            self.$taskList.on('click', '[type=checkbox]', function() {
                var cur_index = $(this).parent().data('index'),
                    status = $(this).prop('checked'),
                    tmp = {'status': status};
                self.operateTask(cur_index, JSON.stringify(tmp));
                self.renderList();
            });
            // setinterval checks time to notify
            var time_notify = setInterval(function() {
                self.taskArray.forEach(function(v, i) {
                    if(v.date && !v.notify) {
                        var curTime = new Date().getTime(),
                            settingTime = new Date(v.date).getTime(),
                            notify = {'notify': ''};
                        if(curTime - settingTime >= 0) {
                            console.log(v.content, ': notify!');
                            notify.notify = true;
                            self.operateTask(i, JSON.stringify(notify));
                            self.$tip.find('.h1').text(v.content);
                            self.$tip.show();
                        }
                    }
                })
            }, 500);
            self.$window.on('resize', function() {
                self.settingPop.adjustPos(self);
            });
        },
        createTpl: function(data, index) {
            this.taskTpl =
                '<li class="task '+(data.status?'completed':'')+'" data-index="'+index+'">'
                + '<input type="checkbox" '+(data.status?'checked':'')+'>&nbsp;&nbsp;'
                + '<span class="content">'+(data.content || '')+'</span>'
                + '<span class="fr">'
                + '<span class="del">删除</span>'
                + '<span class="det">&nbsp;&nbsp;详情</span>'
                + '</span></li>';

            this.detailTpl =
                '<form class="detail-list" data-index="'+index+'">'
                + '<div class="content" >'+(data.content || '')+'</div>'
                + '<input type="text" name="content" style="display: none" value="'+(data.content || '')+'">'
                + '<textarea name="desc" placeholder="请输入详情信息">'+(data.desc || '')+'</textarea>'
                + '<div class="remind">'
                + '<input class="date_timer" name="remind_date" type="text" value="'+(data.date || '')+'">'
                + '<button>更新</button>'
                + '</div></form>';
        },
        operateTask: function() {  /*利用数组方法splice进行增删改查*/
            var self = this;
            let [i, val] = [].slice.call(arguments);

            if($.isNumeric(i) && !val) { //delete
                self.taskArray.splice(i, 1);
            } else if(typeof i === 'object') { //add
                self.taskArray.splice(self.taskArray.length, 0, i);
            } else { //update
                var obj = $.extend(self.taskArray[i], JSON.parse(val));
                self.taskArray.splice(i, 1, obj);
            }

            store.set('tasklist', self.taskArray);
        },
        settingPop: {
            adjustPos: function(self) {
                var self = self,
                    mask_w = self.$window.width(),
                    mask_h = self.$window.height(),
                    pop_w = self.$popEl.width(),
                    pop_h = self.$popEl.height();

                self.$popEl.css({
                    top: (mask_h - pop_h) / 2 - 50,
                    left: (mask_w - pop_w) / 2
                });
            },
        },
        renderTask: function() {
            var self = this;
            if(self.taskTpl && arguments[0] && arguments[0] === 'completed') {
                self.$taskList.append(self.taskTpl);
            } else {
                self.$taskList.prepend(self.taskTpl);
            }
            if(self.detailTpl) self.$taskDetail.append(self.detailTpl);
        },
        renderList: function() {   /*渲染task列表*/
            var self = this,
                completed_task = [];
            self.$taskList.html(null);
            self.$taskDetail.html(null);
            if(!self.taskArray.length) return;
            self.taskArray.forEach(function(v, i) {
                if(!v.status) {
                    self.createTpl(v, i);
                    self.renderTask();
                } else {
                    completed_task.push({'val': v, 'index': i});
                }
            });
            completed_task.length && completed_task.forEach(function(v) {
                self.createTpl(v.val, v.index);
                self.renderTask('completed');
            });
            $('.date_timer').datetimepicker(); // init datetime picker
            self.settingPop.adjustPos(self);
        },
        initialization: function() {
            this.renderList();
            this.eventHandler();
        }
    };

    var taskList = new task();
    taskList.initialization();

})();