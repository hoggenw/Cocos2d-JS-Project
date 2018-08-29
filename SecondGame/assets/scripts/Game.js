// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        //default：设置属性的默认值，这个默认值仅在组件第一次添加到节点上时才会用到
        //type：限定属性的数据类型，详见 CCClass 进阶参考：type 参数
        // visible：设为 false 则不在属性检查器面板中显示该属性
        // serializable： 设为 false 则不序列化（保存）该属性
        // displayName：在属性检查器面板中显示成指定名字
        // tooltip：在属性检查器面板中添加属性的 tooltip
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },

        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad: function () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;

        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 初始化计分
        this.score = 0;
        // 生成一个新的星星
        this.spawnNewStar();
        //监听
        this.node.on('touchstart',this.onTouchEnd,this);
    },

    spawnNewStar: function() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        newStar.getComponent('Star').game = this;
        // 为星星设置一个随机位置

        newStar.setPosition(this.getNewStarPosition());
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星坐标
        return cc.v2(randX, randY);
    },

    start () {

    },


    onTouchEnd: function(event) {
        console.log("  x: " + event.currentTouch._point.x );
        var playerPos = this.node.convertToWorldSpaceAR(this.player.getPosition());
        if (playerPos.x > event.currentTouch._point.x ){//左边
            this.player.getComponent('Player').changeDirection(true,false);
        }else {
            this.player.getComponent('Player').changeDirection(false,true);
        }
        console.log("playerPos  x: " + playerPos.x);

    },



    // update (dt) {},
    update: function (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    gainScore: function () {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score;
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },
    gameOver: function () {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        this.onDisable();
        cc.director.loadScene('game');
    },
    onDisable: function () {
        this.node.off('touchstart', this.onTouchEnd, this);
    },

});
