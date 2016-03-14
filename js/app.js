var QuesVM = function(range,parent){
        var me = this;
        me.getNum = function(range){
            var min = 0;
            var max = range.length - 1;
            var c = Math.floor(Math.random() * (max - min + 1)) + min;
            return range[c];
        };
        me.getRandNum = function(min,max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        me.a = ko.observable();
        me.b = ko.observable();
        me.c = ko.observable();
        me.hide = ko.observable("c");
        me.result = ko.observable("");
        me.check = function(){
            if(me.hide() == 'a')
                return me.result() == me.a();
            if(me.hide() == 'b')
                return me.result() == me.b();
            if(me.hide() == 'c')
                return me.result() == me.c();
        }
        me.go = function(d,e){
            var result = me.check();
//            alert(me.check() ? "Correct!" : "Incorrect!");
            console.log($(e.currentTarget).parent().parent().parent().find('img'));
            if(result){
                var correctSound =  new Media('/android_asset/www/images/correct-mountain.mp3');
                correctSound.play();
                $(e.currentTarget).parent().parent().parent().find('img').attr('src','images/math-mountains-correct-circle.png')
            }else{
                $(e.currentTarget).parent().parent().parent().find('img').attr('src','images/math-mountains-incorrect-circle.png')
            }
            var p = parent;
            setTimeout(function(){
                p.next(result);
            },2000);

        }
        me.init = function (range) {
            var hide = me.getRandNum(1,3);
            var c = ["a","b","c"];
            me.hide(c[hide-1]);
            me.a(me.getNum(range));
            me.b(me.getRandNum(1,me.a() - 1));
            me.c(me.a() - me.b());
            console.log(me.a() + ", " + me.b() + ", " + me.c());

        };
        me.init(range);
    };
    var ExpVM = function(parent){
      var me = this;
        me.parent = parent;
        me.getRandNum = function(min,max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        me.isActive = ko.observable(false);
        me.notActive = ko.computed(function(){
            return !me.isActive();
        });
        me.a = ko.observable();
        me.b = ko.observable();
        me.c = ko.observable();
        me.result = ko.observable('');
        me.hide = ko.observable();
        me.setupKeyboard = function(){
            var m = me;
            $('.key2').find('li[data-v]').off('click').on('click',function(){
                var v = $(this).data('v');
                console.log(v);
                //m.que()[m.currentQue()-1].result(v);
                if(v == 'c'){
                    m.result(m.result().replace(/.+$/,''));
                }else{
                    m.result(m.result() + v);
                }
            });
        }
        me.onTap = function(d,e){
            me.hide($(e.currentTarget).data('v'));
            me.a(me.getRandNum(2,99));
            me.b(me.getRandNum(1,me.a() - 1));
            me.c(me.a() - me.b());
            me.isActive(true);
            me.setupKeyboard();
            me.result('');
        };
        me.reset = function(){
            me.isActive(false);
        };
        me.check = function(){

        };
        me._init = function(){

        }
        me._init();
    };
    var MainVM = function(){
        var me = this;
        me.getNum = function(min,max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        me.gameMode = ko.observable('practice');

        me.timerStatus = ko.observable(false);
        me.focusFactsInp = [];
        me.focusFacts = [];//[13,15,17,18,19,25,24];
        me.maxNumOfQue = ko.observable(10);
        me.currentQue = ko.observable(1);
        me.que = ko.observableArray([]);
        me.exp = ko.observableArray([]);
        me.score = ko.observable(0);
        me.startTime = moment();

        me.goHome = function(){
            var clickSound = new Media('/android_asset/www/images/button-click.mp3');
            clickSound.play();
            window.location.reload();
        };


        me.setGameMode = function(d,e){
            var clickSound = new Media('/android_asset/www/images/button-click.mp3');
            clickSound.play();
            me.gameMode($(e.currentTarget).data('gmode'));
            if(me.gameMode() == 'explore'){
                me.exp.push(new ExpVM(me));
                $('.bx2').hide(function(){$('.bx6').show()});
            }else{
                $('.bx2').hide(function(){$('.bx3').show()});
            }
        };

        me.focusFactsCss = function(a){
            return $.inArray(a,me.focusFacts) != -1;
        };
        me.focusFactsSet = function(a){
              if($.inArray(a,me.focusFactsInp) == -1){
                  me.focusFactsInp.push(a);
              }else{
                  me.focusFactsInp.splice($.inArray(a,me.focusFactsInp),1);
              }
            if(a == 11){
                me.focusFactsInp = [11]; // For any Random Ranges
            }else if($.inArray(11,me.focusFactsInp) != -1){
                me.focusFactsInp.splice($.inArray(11,me.focusFactsInp),1)
            }
            $('#frt li').removeClass('active-list');
            $(me.focusFactsInp).each(function(i,v){
                $('#frt li').eq(v).addClass('active-list');
            });
        };
        me.setupKeyboard = function(){
            var m = me;
            $('.key1').find('li[data-v]').off('click').on('click',function(){
                var clickSound = new Media('/android_asset/www/images/button-click.mp3');
                clickSound.play();
                var v = $(this).data('v');
                console.log(v);
                //m.que()[m.currentQue()-1].result(v);
                if(v == 'c'){
                    m.que()[0].result(m.que()[0].result().replace(/.+$/,''));
                }else{
                    m.que()[0].result(m.que()[0].result() + v);
                }
            });
        }
        me.gameStart = function(){
            var rng = [];
            if(me.focusFactsInp[0] == 11){
                for(i = 1; i <= me.maxNumOfQue(); i++){
                    me.focusFacts.push(me.getNum(5,99));
                }
                me.que.push(new QuesVM(me.focusFacts,me));
            }else{
                for(i = 1; i <= me.maxNumOfQue(); i++){
                    me.focusFacts.push(9);
                }
                me.que.push(new QuesVM(me.focusFacts,me));
            }
            $('.bx3').hide(function(){$('.bx4').show()});
            me.setupKeyboard();
        };
        me.next = function(result){
            var clickSound = new Media('/android_asset/www/images/button-click.mp3');
            clickSound.play();
            if(me.currentQue() == me.maxNumOfQue()){
                $('.bx4').hide(function(){$('.bx5').show()});
                $('#frt2 li').removeClass('active-list');
                $(me.focusFactsInp).each(function(i,v){
                    $('#frt2 li').eq(v).addClass('active-list');
                });
            }
            if(result)
                me.score(me.score() + 1);
            if(me.currentQue() <= me.maxNumOfQue()){
                me.que.removeAll();
                me.que.push(new QuesVM(me.focusFacts,me));
                me.currentQue(me.currentQue() + 1);
            }
            me.setupKeyboard();
        }
        me.reset = function(){
            me.timerStatus(false);
            me.currentQue(1);
            me.que([]);
            me.exp([]);
            me.score(0);
            me.startTime = moment();
            me.gameStart();
        }

        me._init = function(){
//            me.que.push(new QuesVM(me.focusFacts,me));
//            for(i = 1; i <= me.maxNumOfQue(); i++){
//                me.list.push(new QuesVM(me.focusFacts));
//            }

            setTimeout(function(){
                $('.bx1').hide(function(){$('.bx2').show()});
            },3000);

            /* Set FullScreen */
            //addEventListener("click", function () {
            //    var el = document.documentElement
            //            , rfs =
            //                    el.requestFullScreen
            //                    || el.webkitRequestFullScreen
            //                    || el.mozRequestFullScreen
            //            ;
            //    rfs.call(el);
            //});
            /* Set FullScreen */

            if($(window).width() < 720) {
                document.body.style.overflow = "hidden";
                $('.border').width($(window).width());
            }
            $('.border').height($(window).height()+20);

        };
        me._init();
    };
    o = new MainVM();
	document.addEventListener('deviceready', function(){
		ko.applyBindings(o,$('.container')[0]);
	}, false);