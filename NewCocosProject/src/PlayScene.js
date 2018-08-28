/**
 * Created by wangliugen on 2018/8/28.
 */
var PlayLayer = cc.Layer.extend({
    bgSprite:null,
    scoreLabel:null,
    score:0,
    timeoutLabel:null,
    timeout:60,
    SushiSprites:null,
    ctor:function () {
        this._super();

        var size = cc.winSize;

        // add bg
        this.bgSprite = new cc.Sprite(res.BackGround_png);
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            //scale: 0.5,
            rotation: 180
        });
        this.addChild(this.bgSprite, 0);
        cc.spriteFrameCache.addSpriteFrames(res.Sushi_plist);
        this.SushiSprites = [];


        this.scoreLabel = new  cc.LabelTTF("score:0","Arial",20);
        this.scoreLabel.attr({
           x:size.width/2 + 100,
            y:size.height - 20
        });
        this.addChild(this.scoreLabel,5);

        this.timeoutLabel = cc.LabelTTF.create(""+ this.timeout, "Arial",30);
        this.timeoutLabel.x = 30;
        this.timeoutLabel.y = size.height - 20;
        this.addChild(this.timeoutLabel,5);

        //schedule(callback_fn, interval, repeat, delay) 根据用户指定的参数定时执行

//         里面四个参数对应的含义是：
//
// callback_fn：调用的方法名
//
//         interval：间隔多久再进行调用
//
//         repeat：重复的次数
//
//         delay：延迟多久再进行调用
//
//         scheduleOnce(callback_fn, delay) 该函数只调用一次callback_fn的方法
//
//         scheduleUpdate()该函数会每一帧都调用，调用的方法名为"update"
        this.schedule(this.update,1,16*1024,1);
        this.schedule(this.timer,1,this.timeout,1);
        return true;
    },
    addSushi : function() {

        //var sushi = new cc.Sprite(res.Sushi_png);
        var sushi = new SushiSprite(res.Sushi1_png);
        var size = cc.winSize;

        var x = sushi.width/2+size.width/2*cc.random0To1();
        sushi.attr({
            x: x,
            y:size.height - 30
        });

        this.addChild(sushi,5);
        this.SushiSprites.push(sushi);

        var dorpAction = cc.MoveTo.create(4, cc.p(sushi.x,-30));
        sushi.runAction(dorpAction);
        // cc.MoveTo使一个Node做直线运动，在规定时间内移动到指定位置。最后精灵调用runAction方法来运行动画。
        // cc.MoveTo只是Cocos2d-JS中简单动作的一种，还有更多丰富的动作，
        // 如MoveBy(移动经过某位置)/JumpTo(跳动到某位置)/BezierTo(贝尔曲线运动到某位置)等持续动作，
        // FadeIn(淡入)/FadeOut(淡出)/FadeTo(渐变)等视觉动作
        // 和复合动作Repeat(重复执行动作)/Spawn(同时执行一批动作)/Sequence(使一批动作有序执行)
    },
    update : function() {
        this.addSushi();
        this.removeSushi();
    },

    removeSushi : function() {
        //移除到屏幕底部的sushi
        for (var i = 0; i < this.SushiSprites.length; i++) {
            cc.log("removeSushi.........");
            if(0 >= this.SushiSprites[i].y) {
                cc.log("==============remove:"+i);
                this.SushiSprites[i].removeFromParent();
                this.SushiSprites[i] = undefined;
                this.SushiSprites.splice(i,1);
                i= i-1;
            }
        }
    },
    removeSushiByindex : function(dx) {

        if(isNaN(dx)||dx>this.SushiSprites.length){return false;}
        for(var i=0,n=0;i<this.length;i++)
        {
            if(this.SushiSprites[i]!=this[dx])
            {
                cc.log("--------------");
                this.SushiSprites[n++]=this.SushiSprites[i]
            }
        }
        this.SushiSprites.length-=1
    },
    addScore:function(){
        this.score +=1;
        this.scoreLabel.setString("score:" + this.score);
    },
    timer : function() {

        if (this.timeout == 0) {
            //cc.log('游戏结束');
            var gameOver = new cc.LayerColor(cc.color(225,225,225,100));
            var size = cc.winSize;
            var titleLabel = new cc.LabelTTF("Game Over", "Arial", 38);
            titleLabel.attr({
                x:size.width / 2 ,
                y:size.height / 2
            });
            gameOver.addChild(titleLabel, 5);
            var TryAgainItem = new cc.MenuItemFont(
                "Try Again",
                function () {
                    cc.log("Menu is clicked!");
                    var transition= cc.TransitionFade(1, new PlayScene(),cc.color(255,255,255,255));
                    cc.director.runScene(transition);
                }, this);
            TryAgainItem.attr({
                x: size.width/2,
                y: size.height / 2 - 60,
                anchorX: 0.5,
                anchorY: 0.5
            });

            var menu = new cc.Menu(TryAgainItem);
            menu.x = 0;
            menu.y = 0;
            gameOver.addChild(menu, 1);
            this.getParent().addChild(gameOver);

            this.unschedule(this.update);
            this.unschedule(this.timer);
            return;
        }

        this.timeout -=1;
        //console.log("this.timeout value :  " + this.timeout);
        this.timeoutLabel.setString("" + this.timeout);

    },
});



var PlayScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PlayLayer();
        this.addChild(layer);
    }
});