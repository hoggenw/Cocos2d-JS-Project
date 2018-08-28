/**
 * Created by wangliugen on 2018/8/28.
 */
var SushiSprite = cc.Sprite.extend({
    disappearAction:null,//消失动画
    onEnter:function () {
        cc.log("onEnter");
        this._super();
        this.addTouchEventListenser();
        this.disappearAction = this.createDisappearAction();
        this.disappearAction.retain();
    },

    onExit:function () {
        cc.log("onExit");
        this.disappearAction.release();
        this._super();
    },
    addTouchEventListenser:function() {
        //首先通过使用cc.EventListener.create创建了一个Touch事件监听器touchListener，
        this.touchListener = cc.EventListener.create({
            //event属性，定义这个监听器监听的类型。
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
           //swallowTouches属性设置是否吃掉事件，事件被吃掉后不会递给下一层监听器。
            // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
            swallowTouches: true,
            //onTouchBegan event callback function
            //onTouchBegan方法处理触摸点击按下事件，我们在这里可以获取到触摸点的坐标pos。
            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();
                if ( cc.rectContainsPoint(target.getBoundingBox(),pos)) {
                    target.removeTouchEventListenser();
                    //响应精灵点中
                    cc.log("pos.x="+pos.x+",pos.y="+pos.y);

                    target.stopAllActions();

                    var ac = target.disappearAction;
                    var seqAc = cc.Sequence.create( ac, cc.CallFunc.create(function () {
                        cc.log("callfun........");
                        target.getParent().addScore();
                        target.getParent().removeSushiByindex(target.index - 1);
                        target.removeFromParent();

                    },target) );

                    target.runAction(seqAc);

                    return true;
                }
                return false;
            }

        });
        //通过cc.eventManager.addListener注册监听器到事件管理器。
        cc.eventManager.addListener(this.touchListener, this);
    },
    createDisappearAction : function() {
        var frames = [];
        for (var i = 0; i < 11; i++) {
            var str = "sushi_1n_"+i+".png"
            //cc.log(str);
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }

        var animation = new cc.Animation(frames, 0.02);
        var action = new cc.Animate(animation);

        return action;
    },

    removeTouchEventListenser:function(){
        cc.eventManager.removeListener(this.touchListener);
    }

});